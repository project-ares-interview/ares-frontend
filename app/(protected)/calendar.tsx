// app/calendar.tsx (React Native 최종 버전)

import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview"; // 🌟 웹뷰를 위해 설치 필요
import api from "../../services/api"; // 🌟 실제 경로 확인 필요

// --- [타입 정의는 그대로 사용합니다] ---
interface CalendarEvent {
  id?: string;
  summary: string;
  start: any; // 🌟 백엔드에서 객체로 오므로 any로 변경
  end: any; // 🌟 백엔드에서 객체로 오므로 any로 변경
  description?: string;
  raw_start?: string;
  raw_end?: string;
}

// ... (다른 interface들은 그대로) ...

export default function CalendarPage() {
  // 🌟 JSX.Element 반환 타입은 생략해도 됩니다.
  // --- [State 관리] ---
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "google_auth_required" | "error"
  >("loading");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [googleAuthUrl, setGoogleAuthUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showJobKoreaCalendar, setShowJobKoreaCalendar] =
    useState<boolean>(false);

  // Form 입력 State
  const [summary, setSummary] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  // --- [Data Fetching] ---
  const fetchCalendarData = useCallback(async () => {
    try {
      const response = await api.get<any>("/calendar/");

      setStatus(response.data.status || "authenticated"); // status가 없을 경우를 대비

      if (response.data.status === "authenticated") {
        setEvents(response.data.events || []);
      } else if (response.data.status === "google_auth_required") {
        setGoogleAuthUrl(response.data.authorization_url || null);
      } else {
        // 백엔드가 events만 보냈을 경우를 대비 (이전 버전 호환)
        setEvents(response.data.events || []);
        setStatus("authenticated");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        Alert.alert(
          "로그인 필요",
          "로그인이 필요합니다. 로그인 페이지로 이동합니다.",
          [{ text: "확인", onPress: () => router.replace("/(auth)/sign-in") }]
        );
      } else {
        console.error("캘린더 데이터 로딩 중 오류:", error);
        setStatus("error");
      }
    }
  }, [router]);

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  // --- [Event Handlers] ---
  const handleAddEvent = async () => {
    setMessage(null);
    if (!summary || !startTime || !endTime) {
      setMessage({
        type: "error",
        text: "공고 내용, 시작 날짜, 종료 날짜는 필수 항목입니다.",
      });
      return;
    }

    // 사용자가 시간 없이 날짜만 입력한 경우 기본값 설정
    let tempStartTime = startTime;
    if (startTime && !startTime.includes(":")) {
      tempStartTime = `${startTime} 00:00`;
    }

    let tempEndTime = endTime;
    if (endTime && !endTime.includes(":")) {
      tempEndTime = `${endTime} 23:59`; // 종료일은 하루의 끝으로 설정
    }

    // 백엔드는 "YYYY-MM-DDTHH:mm" 형식을 기대합니다.
    const formattedStartTime = tempStartTime.replace(" ", "T");
    const formattedEndTime = tempEndTime.replace(" ", "T");

    try {
      const response = await api.post("/calendar/add-event/", {
        summary,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        description,
      });
      setMessage({
        type: "success",
        text: "일정이 성공적으로 추가되었습니다!",
      });
      setSummary("");
      setStartTime("");
      setEndTime("");
      setDescription("");
      await fetchCalendarData();
    } catch (error) {
      console.error("이벤트 추가 중 오류:", error);
      setMessage({
        type: "error",
        text: "일정 추가에 실패했습니다. 입력 형식(YYYY-MM-DD 또는 YYYY-MM-DD HH:mm)을 확인해주세요.",
      });
    }
  };

  const handleDeleteEvent = (eventId: string | undefined) => {
    // [방어 코드 1] eventId가 없는 경우를 대비합니다.
    if (!eventId) {
      console.error("삭제 시도 실패: eventId가 없습니다.");
      Alert.alert("오류", "삭제할 수 없는 항목입니다.");
      return;
    }

    // [1. 웹 환경일 경우] - 브라우저의 기본 confirm() 함수를 사용합니다.
    if (Platform.OS === "web") {
      // window.confirm은 "확인"을 누르면 true, "취소"를 누르면 false를 반환합니다.
      const userConfirmed = window.confirm(
        "정말로 이 일정을 삭제하시겠습니까?"
      );

      if (userConfirmed) {
        (async () => {
          try {
            const response = await api.delete(
              `/calendar/delete-event/${eventId}/`
            );
            setMessage({
              type: "success",
              text:
                response.data.message || "일정이 성공적으로 삭제되었습니다.",
            });
            await fetchCalendarData();
          } catch (error: any) {
            console.error(
              "일정 삭제 실패:",
              error.response?.data || error.message
            );
            setMessage({ type: "error", text: "일정 삭제에 실패했습니다." });
          }
        })();
      } else {
        console.log("삭제가 취소되었습니다.");
      }
    }
    // [2. 모바일 환경일 경우] - React Native의 Alert.alert()를 사용합니다.
    else {
      Alert.alert(
        "일정 삭제",
        "정말로 이 일정을 삭제하시겠습니까?",
        [
          { text: "취소", style: "cancel" },
          {
            text: "삭제",
            onPress: async () => {
              try {
                const response = await api.delete(
                  `/calendar/delete-event/${eventId}/`
                );
                setMessage({
                  type: "success",
                  text:
                    response.data.message ||
                    "일정이 성공적으로 삭제되었습니다.",
                });
                await fetchCalendarData();
              } catch (error: any) {
                console.error(
                  "일정 삭제 실패:",
                  error.response?.data || error.message
                );
                setMessage({
                  type: "error",
                  text: "일정 삭제에 실패했습니다.",
                });
              }
            },
            style: "destructive",
          },
        ],
        { cancelable: false }
      );
    }

    console.log("[5] Alert.alert 함수 호출이 완료되었습니다.");
  };

  const handleGoogleAuth = () => {
    if (googleAuthUrl) {
      // 🌟 앱의 내장 브라우저 대신, 기기의 기본 브라우저를 엽니다.
      Linking.openURL(googleAuthUrl);
    }
  };

  // --- [렌더링] ---
  if (status === "loading") {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>사용자님의 구글 캘린더 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={styles.centerContainer}>
        <Text>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</Text>
      </View>
    );
  }

  const isWeb = Platform.OS === "web";
  const flexDirection = isWeb && showJobKoreaCalendar ? "row" : "column";

  return (
    <View style={{ flex: 1, flexDirection }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>채용 공고 정리 🗓️</Text>

        {/* [분기 1] Google 인증 필요 화면 */}
        {status === "google_auth_required" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Google Calendar 연동</Text>
            <Text style={styles.paragraph}>
              캘린더 기능을 사용하려면 Google 계정 연동이 필요합니다.
            </Text>
            <Button
              title="Google 계정으로 연동하기"
              onPress={handleGoogleAuth}
            />
          </View>
        )}

        {/* [분기 2] 인증 완료 화면 */}
        {status === "authenticated" && (
          <View>
            {message && (
              <View
                style={[
                  styles.messageBox,
                  { borderColor: message.type === "error" ? "red" : "green" },
                ]}
              >
                <Text
                  style={{ color: message.type === "error" ? "red" : "green" }}
                >
                  {message.text}
                </Text>
              </View>
            )}

            {/* --- 일정 추가 폼 --- */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>공고 내용:</Text>
              <TextInput
                style={styles.input}
                value={summary}
                onChangeText={setSummary}
                placeholder="예: 삼성전자 (AI 엔지니어)"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>접수 시작(날짜 필수✔️):</Text>
              <TextInput
                style={styles.input}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="YYYY-MM-DD HH:mm"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>접수 마감(날짜 필수✔️):</Text>
              <TextInput
                style={styles.input}
                value={endTime}
                onChangeText={setEndTime}
                placeholder="YYYY-MM-DD HH:mm"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>상세 일정👀(선택사항):</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            {/* --- 버튼 그룹 --- */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleAddEvent}>
                <Text style={styles.buttonText}>캘린더에 추가</Text>
              </TouchableOpacity>
              {isWeb && (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#7e91b9ff" }]}
                  onPress={() => setShowJobKoreaCalendar(!showJobKoreaCalendar)}
                >
                  <Text style={styles.buttonText}>
                    {showJobKoreaCalendar
                      ? "채용 달력 숨기기"
                      : "채용 달력 보기"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>✨내가 등록한 일정✨</Text>
            {events.length > 0 ? (
              events.map((event) => (
                <View key={event.id || event.summary} style={styles.eventItem}>
                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <Text style={styles.eventSummary}>{event.summary}</Text>
                      <TouchableOpacity
                        onPress={() => handleDeleteEvent(event.id!)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteButtonText}>삭제</Text>
                      </TouchableOpacity>
                    </View>

                    {event.description && (
                      <Text style={styles.eventDescription}>
                        {event.description}
                      </Text>
                    )}

                    {/* 백엔드가 가공하고 정렬해서 보내준 데이터를 그대로 보여주기만 합니다. */}
                    <Text style={styles.eventTime}>시작: {event.start}</Text>
                    <Text style={styles.eventTime}>종료: {event.end}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text>등록한 채용 일정이 없습니다.</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* --- 잡코리아 iframe (플랫폼에 따라 다르게 렌더링) --- */}
      {showJobKoreaCalendar && (
        <View
          style={
            isWeb ? styles.iframeContainerWeb : styles.webviewContainerMobile
          }
        >
          {/* <<<<<<< 🌟 [핵심 수정] isWeb 변수로 어떤 컴포넌트를 보여줄지 결정합니다 >>>>>>>>> */}

          {isWeb ? (
            // [1. 웹 환경일 경우]
            // 웹 표준인 <iframe> 태그를 직접 사용합니다.
            // React가 iframe을 정식으로 지원하므로, 아무런 라이브러리 없이 바로 쓸 수 있습니다.
            // style 속성은 CSS 속성을 JavaScript 객체 형태로 전달합니다.
            <iframe
              title="JobKorea Calendar"
              src="https://www.jobkorea.co.kr/Starter/calendar/sub/month" // 🌟 http -> https로 변경하는 것이 좋습니다.
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          ) : (
            // [2. 모바일 환경일 경우 (iOS, Android)]
            // 설치한 react-native-webview의 WebView 컴포넌트를 사용합니다.
            <WebView
              source={{
                uri: "https://www.jobkorea.co.kr/Starter/calendar/sub/month",
              }}
              style={{ flex: 1 }}
            />
          )}
        </View>
      )}
    </View> // <-- 이 </View>는 return문의 최상위 뷰를 닫는 태그입니다.
  );
}

// --- [3. StyleSheet] ---
const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  section: { marginBottom: 20 },
  paragraph: { fontSize: 16, lineHeight: 24 },
  messageBox: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  formGroup: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 15,
    backgroundColor: "white",
  },
  textarea: { height: 100, textAlignVertical: "top" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  button: {
    backgroundColor: "#4972c3ff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 14 },

  eventItem: {
    backgroundColor: "white", // 깨끗한 흰색 배경
    borderRadius: 12, // 더 부드러운 둥근 모서리
    padding: 16, // 넉넉한 내부 여백
    marginBottom: 12,

    // --- 그림자 효과 (웹/iOS/Android 모두 호환) ---
    // iOS
    shadowColor: "#101828",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // Android
    elevation: 3,

    borderWidth: 1,
    borderColor: "#4972c3ff",
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    color: "#4972c3ff",
    marginBottom: 10,
    fontStyle: "normal",
  },

  deleteButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },

  iframeContainerWeb: {
    flex: 1.8,
    height: 800,
  },
  webviewContainerMobile: {
    flex: 1,
  },

  divider: { height: 3, backgroundColor: "#4972c3ff", marginVertical: 30 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#101828",
  },

  eventSummary: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  eventTime: {
    fontSize: 14,
    color: "#555",
  },
  deleteButton: {
    backgroundColor: "#4972c3ff",
    padding: 8,
    borderRadius: 10, // 원형 버튼
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
