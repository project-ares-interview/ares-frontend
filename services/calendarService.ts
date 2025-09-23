import api from './api';

export interface CalendarEvent {
  id?: string;
  summary: string;
  start: string;
  end: string;
  description?: string;
}

export interface CalendarStatus {
  status: 'authenticated' | 'google_auth_required' | 'error' | 'success';
  message?: string;
  events?: CalendarEvent[];
  authorization_url?: string;
  event?: CalendarEvent;
}

export interface CreateEventData {
  summary: string;
  description?: string;
  start_time: string;
  end_time: string;
}

class CalendarService {
  // 캘린더 상태 확인
  async getCalendarStatus(): Promise<CalendarStatus> {
    const response = await api.get('/calendar/');
    return response.data;
  }

  // 이벤트 목록 조회
  async getEvents(): Promise<CalendarStatus> {
    const response = await api.get('/calendar/events/');
    return response.data;
  }

  // 새 이벤트 추가
  async addEvent(eventData: CreateEventData): Promise<CalendarStatus> {
    const response = await api.post('/calendar/add-event/', eventData);
    return response.data;
  }

  // 이벤트 삭제
  async deleteEvent(eventId: string): Promise<CalendarStatus> {
    const response = await api.delete(`/calendar/delete-event/${eventId}/`);
    return response.data;
  }

  // Google OAuth URL 생성
  async getGoogleAuthUrl(returnUrl?: string): Promise<{ authorization_url: string; state: string }> {
    const response = await api.get('/calendar/google-auth-url/', {
      params: returnUrl ? { return_url: returnUrl } : undefined,
    });
    return response.data;
  }

  // Google OAuth 콜백 처리
  async handleGoogleAuthCallback(code: string, state: string): Promise<CalendarStatus> {
    const response = await api.post('/calendar/google-auth-callback/', {
      code,
      state,
    });
    return response.data;
  }
}

export default new CalendarService();
