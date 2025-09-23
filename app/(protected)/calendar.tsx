// app/calendar.tsx (백엔드 API 연동 버전)

// import { useRouter } from "expo-router"; // 필요시 사용
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useBackendCalendar } from "../../hooks/useBackendCalendar";

// --- [타입 정의는 useBackendCalendar hook에서 가져옴] ---

export default function CalendarPage() {
  // --- [백엔드 API 연동 Hook 사용] ---
  const {
    isAuthenticated,
    isLoading,
    events,
    promptAuth,
    addEvent,
    deleteEvent,
    error,
  } = useBackendCalendar();

  // --- [State 관리] ---
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

  // 날짜/시간 입력 모드: calendar | select
  const [inputMode, setInputMode] = useState<"calendar" | "select">("calendar");

  // Calendar 모드용 상태 (모바일)
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Select 모드용 상태
  const now = useMemo(() => new Date(), []);
  const years = useMemo(() => {
    const y: number[] = [];
    const base = now.getFullYear();
    for (let i = 0; i < 5; i++) y.push(base + i);
    return y;
  }, [now]);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);

  const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

  const [sYear, setSYear] = useState<number>(now.getFullYear());
  const [sMonth, setSMonth] = useState<number>(now.getMonth() + 1);
  const [sDay, setSDay] = useState<number>(now.getDate());
  const [sHour, setSHour] = useState<number>(9);
  const [sMinute, setSMinute] = useState<number>(0);

  const [eYear, setEYear] = useState<number>(now.getFullYear());
  const [eMonth, setEMonth] = useState<number>(now.getMonth() + 1);
  const [eDay, setEDay] = useState<number>(now.getDate());
  const [eHour, setEHour] = useState<number>(18);
  const [eMinute, setEMinute] = useState<number>(0);

  const sDays = useMemo(() => Array.from({ length: daysInMonth(sYear, sMonth) }, (_, i) => i + 1), [sYear, sMonth]);
  const eDays = useMemo(() => Array.from({ length: daysInMonth(eYear, eMonth) }, (_, i) => i + 1), [eYear, eMonth]);

  // 입력 변경시 startTime/endTime 동기화
  useEffect(() => {
    if (inputMode === "calendar") {
      if (startDate) setStartTime(`${startDate.getFullYear()}-${pad2(startDate.getMonth() + 1)}-${pad2(startDate.getDate())}T${pad2(startDate.getHours())}:${pad2(startDate.getMinutes())}:00`);
      if (endDate) setEndTime(`${endDate.getFullYear()}-${pad2(endDate.getMonth() + 1)}-${pad2(endDate.getDate())}T${pad2(endDate.getHours())}:${pad2(endDate.getMinutes())}:00`);
    } else {
      setStartTime(`${sYear}-${pad2(sMonth)}-${pad2(sDay)}T${pad2(sHour)}:${pad2(sMinute)}:00`);
      setEndTime(`${eYear}-${pad2(eMonth)}-${pad2(eDay)}T${pad2(eHour)}:${pad2(eMinute)}:00`);
    }
  }, [inputMode, startDate, endDate, sYear, sMonth, sDay, sHour, sMinute, eYear, eMonth, eDay, eHour, eMinute]);

  // const router = useRouter(); // 필요시 사용

  // --- [Error 처리] ---
  useEffect(() => {
    if (error) {
      setMessage({
        type: "error",
        text: error,
      });
    }
  }, [error]);

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
      tempStartTime = `${startTime}T00:00:00`;
    } else {
      tempStartTime = tempStartTime.replace(" ", "T");
    }

    let tempEndTime = endTime;
    if (endTime && !endTime.includes(":")) {
      tempEndTime = `${endTime}T23:59:59`; // 종료일은 하루의 끝으로 설정
    } else {
      tempEndTime = tempEndTime.replace(" ", "T");
    }

    // 백엔드 API 형식으로 변환
    const eventData = {
      summary,
      start: tempStartTime,
      end: tempEndTime,
      description: description || undefined,
    };

    const success = await addEvent(eventData);
    if (success) {
      setMessage({
        type: "success",
        text: "일정이 성공적으로 추가되었습니다!",
      });
      setSummary("");
      setStartTime("");
      setEndTime("");
      setDescription("");
    } else {
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
          const success = await deleteEvent(eventId);
          if (success) {
            setMessage({
              type: "success",
              text: "일정이 성공적으로 삭제되었습니다.",
            });
          } else {
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
              const success = await deleteEvent(eventId);
              if (success) {
                setMessage({
                  type: "success",
                  text: "일정이 성공적으로 삭제되었습니다.",
                });
              } else {
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
  };

  const handleGoogleAuth = () => {
    promptAuth();
  };

  // --- [렌더링] ---
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>사용자님의 구글 캘린더 정보를 불러오는 중...</Text>
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
        {!isAuthenticated && (
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
        {isAuthenticated && (
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
            {/* 입력 모드 토글 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, inputMode === 'calendar' ? {} : { backgroundColor: '#9aaad7' }]}
                onPress={() => setInputMode('calendar')}
              >
                <Text style={styles.buttonText}>달력으로 선택</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, inputMode === 'select' ? {} : { backgroundColor: '#9aaad7' }]}
                onPress={() => setInputMode('select')}
              >
                <Text style={styles.buttonText}>연/월/일/시/분 선택</Text>
              </TouchableOpacity>
            </View>

            {inputMode === 'calendar' ? (
              <>
                {/* Calendar 입력 */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>접수 시작(날짜 필수✔️):</Text>
                  {Platform.OS === 'web' ? (
                    // 웹은 공통 입력 스타일 래퍼로 감싸 동일한 크기/테두리 적용
                    <View style={styles.inputWebWrapper}>
                      {/* @ts-ignore */}
                      <input
                        type="datetime-local"
                        className="ares-input-web"
                        style={styles.inputWebField as any}
                        value={startTime ? startTime.substring(0,16) : ''}
                        onChange={(e: any) => setStartTime(e.target.value.replace(' ', 'T') + (e.target.value.length === 16 ? ':00' : ''))}
                      />
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.input} onPress={() => setShowStartPicker(true)}>
                        <Text>{startTime ? startTime.replace('T', ' ') : '날짜/시간 선택'}</Text>
                      </TouchableOpacity>
                      {showStartPicker && (
                        <DateTimePicker
                          value={startDate ?? new Date()}
                          mode="datetime"
                          is24Hour
                          onChange={(_, d) => {
                            setShowStartPicker(false);
                            if (d) setStartDate(d);
                          }}
                        />
                      )}
                    </>
                  )}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>접수 마감(날짜 필수✔️):</Text>
                  {Platform.OS === 'web' ? (
                    <View style={styles.inputWebWrapper}>
                      {/* @ts-ignore */}
                      <input
                        type="datetime-local"
                        className="ares-input-web"
                        style={styles.inputWebField as any}
                        value={endTime ? endTime.substring(0,16) : ''}
                        onChange={(e: any) => setEndTime(e.target.value.replace(' ', 'T') + (e.target.value.length === 16 ? ':00' : ''))}
                      />
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.input} onPress={() => setShowEndPicker(true)}>
                        <Text>{endTime ? endTime.replace('T', ' ') : '날짜/시간 선택'}</Text>
                      </TouchableOpacity>
                      {showEndPicker && (
                        <DateTimePicker
                          value={endDate ?? new Date()}
                          mode="datetime"
                          is24Hour
                          onChange={(_, d) => {
                            setShowEndPicker(false);
                            if (d) setEndDate(d);
                          }}
                        />
                      )}
                    </>
                  )}
                </View>
              </>
            ) : (
              <>
                {/* Select 입력 */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>접수 시작(연/월/일/시/분)</Text>
                  {Platform.OS === 'web' ? (
                    <View style={{ gap: 8 }}>
                      {/* @ts-ignore */}
                      <select value={sYear} onChange={(e: any) => setSYear(Number(e.target.value))}>
                        {years.map((y) => (
                          <option key={y} value={y}>{y}년</option>
                        ))}
                      </select>
                      {/* @ts-ignore */}
                      <select value={sMonth} onChange={(e: any) => setSMonth(Number(e.target.value))}>
                        {months.map((m) => (
                          <option key={m} value={m}>{m}월</option>
                        ))}
                      </select>
                      {/* @ts-ignore */}
                      <select value={sDay} onChange={(e: any) => setSDay(Number(e.target.value))}>
                        {sDays.map((d) => (
                          <option key={d} value={d}>{d}일</option>
                        ))}
                      </select>
                      {/* @ts-ignore */}
                      <select value={sHour} onChange={(e: any) => setSHour(Number(e.target.value))}>
                        {hours.map((h) => (
                          <option key={h} value={h}>{pad2(h)}시</option>
                        ))}
                      </select>
                      {/* @ts-ignore */}
                      <select value={sMinute} onChange={(e: any) => setSMinute(Number(e.target.value))}>
                        {minutes.map((m) => (
                          <option key={m} value={m}>{pad2(m)}분</option>
                        ))}
                      </select>
                    </View>
                  ) : (
                    <View style={{ gap: 8 }}>
                      <Picker selectedValue={sYear} onValueChange={(v) => setSYear(v)}>
                        {years.map((y) => (
                          <Picker.Item key={y} label={`${y}년`} value={y} />
                        ))}
                      </Picker>
                      <Picker selectedValue={sMonth} onValueChange={(v) => setSMonth(v)}>
                        {months.map((m) => (
                          <Picker.Item key={m} label={`${m}월`} value={m} />
                        ))}
                      </Picker>
                      <Picker selectedValue={sDay} onValueChange={(v) => setSDay(v)}>
                        {sDays.map((d) => (
                          <Picker.Item key={d} label={`${d}일`} value={d} />
                        ))}
                      </Picker>
                      <Picker selectedValue={sHour} onValueChange={(v) => setSHour(v)}>
                        {hours.map((h) => (
                          <Picker.Item key={h} label={`${pad2(h)}시`} value={h} />
                        ))}
                      </Picker>
                      <Picker selectedValue={sMinute} onValueChange={(v) => setSMinute(v)}>
                        {minutes.map((m) => (
                          <Picker.Item key={m} label={`${pad2(m)}분`} value={m} />
                        ))}
                      </Picker>
                    </View>
                  )}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>접수 마감(연/월/일/시/분)</Text>
                  {Platform.OS === 'web' ? (
                    <View style={{ gap: 8 }}>
                      {/* @ts-ignore */}
                      <select value={eYear} onChange={(e: any) => setEYear(Number(e.target.value))}>
                        {years.map((y) => (
                          <option key={y} value={y}>{y}년</option>
                        ))}
                      </select>
                      {/* @ts-ignore */}
                      <select value={eMonth} onChange={(e: any) => setEMonth(Number(e.target.value))}>
                        {months.map((m) => (
                          <option key={m} value={m}>{m}월</option>
                        ))}
                      </select>
                      {/* @ts-ignore */}
                      <select value={eDay} onChange={(e: any) => setEDay(Number(e.target.value))}>
                        {eDays.map((d) => (
                          <option key={d} value={d}>{d}일</option>
                        ))}
                      </select>
                      {/* @ts-ignore */}
                      <select value={eHour} onChange={(e: any) => setEHour(Number(e.target.value))}>
                        {hours.map((h) => (
                          <option key={h} value={h}>{pad2(h)}시</option>
                        ))}
                      </select>
                      {/* @ts-ignore */}
                      <select value={eMinute} onChange={(e: any) => setEMinute(Number(e.target.value))}>
                        {minutes.map((m) => (
                          <option key={m} value={m}>{pad2(m)}분</option>
                        ))}
                      </select>
                    </View>
                  ) : (
                    <View style={{ gap: 8 }}>
                      <Picker selectedValue={eYear} onValueChange={(v) => setEYear(v)}>
                        {years.map((y) => (
                          <Picker.Item key={y} label={`${y}년`} value={y} />
                        ))}
                      </Picker>
                      <Picker selectedValue={eMonth} onValueChange={(v) => setEMonth(v)}>
                        {months.map((m) => (
                          <Picker.Item key={m} label={`${m}월`} value={m} />
                        ))}
                      </Picker>
                      <Picker selectedValue={eDay} onValueChange={(v) => setEDay(v)}>
                        {eDays.map((d) => (
                          <Picker.Item key={d} label={`${d}일`} value={d} />
                        ))}
                      </Picker>
                      <Picker selectedValue={eHour} onValueChange={(v) => setEHour(v)}>
                        {hours.map((h) => (
                          <Picker.Item key={h} label={`${pad2(h)}시`} value={h} />
                        ))}
                      </Picker>
                      <Picker selectedValue={eMinute} onValueChange={(v) => setEMinute(v)}>
                        {minutes.map((m) => (
                          <Picker.Item key={m} label={`${pad2(m)}분`} value={m} />
                        ))}
                      </Picker>
                    </View>
                  )}
                </View>
              </>
            )}
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

                    {/* 백엔드 API 응답 형식에 맞게 날짜 표시 */}
                    <Text style={styles.eventTime}>
                      시작: {new Date(event.start).toLocaleString('ko-KR')}
                    </Text>
                    <Text style={styles.eventTime}>
                      종료: {new Date(event.end).toLocaleString('ko-KR')}
                    </Text>
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
  // 웹 datetime-local 입력을 RN TextInput과 동일 크기로 보이게 하기 위한 래퍼/필드 스타일
  inputWebWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
  },
  inputWebField: {
    width: "100%",
    padding: 10,
    fontSize: 15,
    border: "none",
    outline: "none",
    boxSizing: "border-box",
  } as any,
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
