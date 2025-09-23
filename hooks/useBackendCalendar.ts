import { useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import CalendarService, { CalendarEvent } from '../services/calendarService';

interface BackendCalendarHook {
  isAuthenticated: boolean;
  isLoading: boolean;
  events: CalendarEvent[];
  promptAuth: () => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  refreshEvents: () => Promise<void>;
  error: string | null;
}

export function useBackendCalendar(): BackendCalendarHook {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 초기 상태 확인
  const checkCalendarStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const status = await CalendarService.getCalendarStatus();
      
      if (status.status === 'authenticated') {
        setIsAuthenticated(true);
        await fetchEvents();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      console.error('Calendar status check failed:', error);
      if (error.response && error.response.status === 401) {
        setError('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to check calendar status');
      }
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 이벤트 목록 조회
  const fetchEvents = async () => {
    try {
      setError(null);
      const status = await CalendarService.getEvents();
      
      if (status.status === 'authenticated' && status.events) {
        setEvents(status.events);
      } else {
        setEvents([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch events:', error);
      if (error.response && error.response.status === 401) {
        setError('Google Calendar 연동이 필요합니다.');
        setIsAuthenticated(false);
      } else {
        setError(error instanceof Error ? error.message : 'Failed to fetch events');
      }
    }
  };

  // 이벤트 추가
  const addEvent = async (eventData: Omit<CalendarEvent, 'id'>): Promise<boolean> => {
    try {
      setError(null);
      
      // 프론트엔드 형식을 백엔드 형식으로 변환
      const backendEventData = {
        summary: eventData.summary,
        description: eventData.description || '',
        start_time: eventData.start,
        end_time: eventData.end,
      };
      
      const status = await CalendarService.addEvent(backendEventData);
      
      if (status.status === 'success') {
        await fetchEvents(); // 이벤트 목록 새로고침
        return true;
      } else {
        setError(status.message || 'Failed to add event');
        return false;
      }
    } catch (error: any) {
      console.error('Failed to add event:', error);
      if (error.response && error.response.status === 400) {
        setError('입력 데이터가 올바르지 않습니다.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to add event');
      }
      return false;
    }
  };

  // 이벤트 삭제
  const deleteEvent = async (eventId: string): Promise<boolean> => {
    try {
      setError(null);
      
      const status = await CalendarService.deleteEvent(eventId);
      
      if (status.status === 'success') {
        await fetchEvents(); // 이벤트 목록 새로고침
        return true;
      } else {
        setError(status.message || 'Failed to delete event');
        return false;
      }
    } catch (error: any) {
      console.error('Failed to delete event:', error);
      if (error.response && error.response.status === 404) {
        setError('이벤트를 찾을 수 없습니다.');
      } else {
        setError(error instanceof Error ? error.message : 'Failed to delete event');
      }
      return false;
    }
  };

  // 이벤트 새로고침
  const refreshEvents = async () => {
    if (isAuthenticated) {
      await fetchEvents();
    }
  };

  // Google 인증 프롬프트
  const promptAuth = async () => {
    try {
      setError(null);
      // 현재 페이지로 돌아올 수 있도록 return_url 전달
      const returnUrl = Platform.OS === 'web'
        ? window.location.href
        : 'ares-frontend://(protected)/calendar';

      const { authorization_url } = await CalendarService.getGoogleAuthUrl(returnUrl);
      
      // 백엔드가 제공한 authorization_url을 그대로 사용 (백엔드 콜백 플로우)
      if (Platform.OS === 'web') {
        window.location.href = authorization_url;
      } else {
        await Linking.openURL(authorization_url);
      }
    } catch (error: any) {
      console.error('Failed to get auth URL:', error);
      setError(error instanceof Error ? error.message : 'Failed to get auth URL');
    }
  };

  // 초기 로드
  useEffect(() => {
    checkCalendarStatus();
  }, []);

  return {
    isAuthenticated,
    isLoading,
    events,
    promptAuth,
    addEvent,
    deleteEvent,
    refreshEvents,
    error,
  };
}
