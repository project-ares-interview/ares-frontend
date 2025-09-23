import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import CalendarService from '../../services/calendarService';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = params.code as string;
        const state = params.state as string;
        
        if (!code) {
          throw new Error('Authorization code not found');
        }
        
        const status = await CalendarService.handleGoogleAuthCallback(code, state);
        
        if (status.status === 'success') {
          // 성공 시 캘린더 페이지로 이동
          router.replace('/(protected)/calendar');
        } else {
          throw new Error(status.message || 'Authentication failed');
        }
      } catch (error) {
        console.error('Google callback error:', error);
        // 에러 시 캘린더 페이지로 이동 (에러 메시지 표시)
        router.replace('/(protected)/calendar');
      }
    };
    
    handleCallback();
  }, [params, router]);
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4972c3ff" />
      <Text style={styles.text}>Google Calendar 연동 중...</Text>
      <Text style={styles.subText}>잠시만 기다려주세요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
