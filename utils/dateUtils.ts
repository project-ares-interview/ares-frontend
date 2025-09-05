/**
 * 날짜 관련 유틸리티 함수들
 */

/**
 * YYYY-MM 형식의 문자열을 Date 객체로 변환
 * @param dateString - YYYY-MM 형식의 문자열
 * @returns Date 객체 또는 null (유효하지 않은 경우)
 */
export const parseYearMonth = (dateString: string): Date | null => {
  if (!dateString || !dateString.trim()) {
    return null;
  }

  const [year, month] = dateString.split('-');
  if (!year || !month || year.length !== 4 || month.length !== 2) {
    return null;
  }

  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    return null;
  }

  return new Date(yearNum, monthNum - 1, 1); // month는 0부터 시작
};

/**
 * YYYY-MM-DD 형식의 문자열을 Date 객체로 변환
 * @param dateString - YYYY-MM-DD 형식의 문자열
 * @returns Date 객체 또는 null (유효하지 않은 경우)
 */
export const parseYearMonthDay = (dateString: string): Date | null => {
  if (!dateString || !dateString.trim()) {
    return null;
  }

  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day || year.length !== 4 || month.length !== 2 || day.length !== 2) {
    return null;
  }

  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);

  if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum) || 
      monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
    return null;
  }

  return new Date(yearNum, monthNum - 1, dayNum);
};

/**
 * Date 객체를 YYYY-MM 형식의 문자열로 변환
 * @param date - Date 객체
 * @returns YYYY-MM 형식의 문자열
 */
export const formatYearMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Date 객체를 YYYY-MM-DD 형식의 문자열로 변환
 * @param date - Date 객체
 * @returns YYYY-MM-DD 형식의 문자열
 */
export const formatYearMonthDay = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 현재 날짜를 YYYY-MM 형식으로 반환
 */
export const getCurrentYearMonth = (): string => {
  return formatYearMonth(new Date());
};

/**
 * 현재 날짜를 YYYY-MM-DD 형식으로 반환
 */
export const getCurrentYearMonthDay = (): string => {
  return formatYearMonthDay(new Date());
};

/**
 * YYYY-MM 형식을 YYYY-MM-DD 형식으로 변환 (해당 월의 1일로 설정)
 * @param yearMonth - YYYY-MM 형식의 문자열
 * @returns YYYY-MM-DD 형식의 문자열 또는 null
 */
export const convertYearMonthToYearMonthDay = (yearMonth: string): string | null => {
  const dateObj = parseYearMonth(yearMonth);
  if (!dateObj) return null;
  return formatYearMonthDay(dateObj);
};

/**
 * 날짜 문자열이 유효한 YYYY-MM 형식인지 검증
 * @param dateString - 검증할 날짜 문자열
 * @returns 유효성 여부
 */
export const isValidYearMonth = (dateString: string): boolean => {
  return parseYearMonth(dateString) !== null;
};

/**
 * 날짜 문자열이 유효한 YYYY-MM-DD 형식인지 검증
 * @param dateString - 검증할 날짜 문자열
 * @returns 유효성 여부
 */
export const isValidYearMonthDay = (dateString: string): boolean => {
  return parseYearMonthDay(dateString) !== null;
};

/**
 * 년도 옵션 배열 생성 (현재 년도부터 과거 50년)
 * @returns 년도 옵션 배열
 */
export const getYearOptions = (): { label: string; value: string }[] => {
  const currentYear = new Date().getFullYear();
  const years: { label: string; value: string }[] = [];
  
  for (let year = currentYear; year >= currentYear - 50; year--) {
    years.push({
      label: `${year}년`,
      value: year.toString(),
    });
  }
  
  return years;
};

/**
 * 월 옵션 배열 생성
 * @returns 월 옵션 배열
 */
export const getMonthOptions = (): { label: string; value: string }[] => {
  const months: { label: string; value: string }[] = [];
  
  for (let month = 1; month <= 12; month++) {
    const monthStr = month.toString().padStart(2, '0');
    months.push({
      label: `${month}월`,
      value: monthStr,
    });
  }
  
  return months;
};

/**
 * 일 옵션 배열 생성
 * @param year - 년도
 * @param month - 월 (1-12)
 * @returns 일 옵션 배열
 */
export const getDayOptions = (year: number, month: number): { label: string; value: string }[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: { label: string; value: string }[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayStr = day.toString().padStart(2, '0');
    days.push({
      label: `${day}일`,
      value: dayStr,
    });
  }
  
  return days;
};

/**
 * YYYY-MM 형식 문자열을 년도와 월로 분리
 * @param dateString - YYYY-MM 형식 문자열
 * @returns {year: string, month: string} 또는 null
 */
export const parseYearMonthString = (dateString: string): { year: string; month: string } | null => {
  if (!dateString || !dateString.trim()) return null;
  
  const [year, month] = dateString.split('-');
  if (year && month && year.length === 4 && month.length === 2) {
    return { year, month };
  }
  
  return null;
};

/**
 * YYYY-MM-DD 형식 문자열을 년도, 월, 일로 분리
 * @param dateString - YYYY-MM-DD 형식 문자열
 * @returns {year: string, month: string, day: string} 또는 null
 */
export const parseYearMonthDayString = (dateString: string): { year: string; month: string; day: string } | null => {
  if (!dateString || !dateString.trim()) return null;
  
  const [year, month, day] = dateString.split('-');
  if (year && month && day && year.length === 4 && month.length === 2 && day.length === 2) {
    return { year, month, day };
  }
  
  return null;
};
