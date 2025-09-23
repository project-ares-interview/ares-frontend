import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyPolicyPage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>개인정보 처리방침</Text>

      <View style={styles.borderedContainer}>
        <View style={styles.article}>
          <Text style={styles.articleTitle}>제1조 (총칙)</Text>
          <Text style={styles.articleBody}>
            시행일: 2025년 9월 15일

            Ares-frontend(이하 '회사')는 사용자의 개인정보를 소중하게 생각하며, '정보통신망 이용촉진 및 정보보호 등에 관한 법률' 등 개인정보보호 관련 법규를 준수하고 있습니다. 회사는 본 개인정보 처리방침을 통해 사용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제2조 (수집하는 개인정보 항목 및 수집방법)</Text>
          <Text style={styles.articleBody}>
            가. 수집 항목: (예: 이름, 이메일 주소, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, AI 모델 학습에 사용된 데이터 등)
            나. 수집 방법: (예: 홈페이지, 서면양식, 게시판, 이메일, 이벤트 응모, 배송요청, 전화, 팩스, 생성정보 수집 툴을 통한 수집 등)
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제3조 (개인정보의 수집 및 이용목적)</Text>
          <Text style={styles.articleBody}>
            회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다. 
            - 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산
            - 회원 관리: 회원제 서비스 이용에 따른 본인확인, 개인 식별, 불량회원의 부정 이용 방지와 비인가 사용 방지, 가입 의사 확인, 연령확인, 불만처리 등 민원처리, 고지사항 전달
            - 마케팅 및 광고에 활용: 신규 서비스(제품) 개발 및 특화, 이벤트 등 광고성 정보 전달, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계
            - AI 서비스 개선 및 연구 개발: AI 모델의 학습, 성능 평가 및 개선을 위한 데이터로 활용
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제4조 (개인정보의 보유 및 이용기간)</Text>
          <Text style={styles.articleBody}>
            원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제5조 (개인정보의 파기절차 및 방법)</Text>
          <Text style={styles.articleBody}>
            회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 파기절차 및 방법은 다음과 같습니다.
            - 파기절차: 회원님이 회원가입 등을 위해 입력하신 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기되어집니다.
            - 파기방법: 전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제6조 (개인정보 제공)</Text>
          <Text style={styles.articleBody}>
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
            - 이용자들이 사전에 동의한 경우
            - 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제7조 (이용자 및 법정대리인의 권리와 그 행사방법)</Text>
          <Text style={styles.articleBody}>
            이용자 및 법정 대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만 아동의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다.
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제8조 (개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항)</Text>
          <Text style={styles.articleBody}>
            회사는 귀하의 정보를 수시로 저장하고 찾아내는 '쿠키(cookie)' 등을 운용합니다. 쿠키란 웹사이트를 운영하는데 이용되는 서버가 귀하의 브라우저에 보내는 아주 작은 텍스트 파일로서 귀하의 컴퓨터 하드디스크에 저장됩니다.
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제9조 (개인정보에 관한 민원서비스)</Text>
          <Text style={styles.articleBody}>
            회사는 고객의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와 같이 관련 부서 및 개인정보관리책임자를 지정하고 있습니다.
            - 개인정보관리책임자 성명 : OOO
            - 전화번호 : XX-XXXX-XXXX
            - 이메일 : contact@ares-frontend.com
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제10조 (고지의 의무)</Text>
          <Text style={styles.articleBody}>
            현 개인정보처리방침 내용 추가, 삭제 및 수정이 있을 시에는 개정 최소 7일전부터 홈페이지의 '공지사항'을 통해 고지할 것입니다.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#111",
    textAlign: "center",
  },
  borderedContainer: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 20,
  },
  article: {
    marginBottom: 22,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
    textAlign: "left",
  },
  articleBody: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    textAlign: "left",
  },
});
