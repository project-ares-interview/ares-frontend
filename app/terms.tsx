import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TermsPage() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>이용약관</Text>

      <View style={styles.borderedContainer}>
        <View style={styles.article}>
          <Text style={styles.articleTitle}>제1조 (목적)</Text>
          <Text style={styles.articleBody}>
            본 약관은 JAI(JobAI)가 제공하는 면접 AI 서비스(이하 “서비스”)의 이용
            조건 및 절차, 권리와 의무, 책임사항을 규정함을 목적으로 합니다.
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제2조 (회원 가입 및 계정 관리)</Text>
          <Text style={styles.articleBody}>
            회원은 실명 및 본인 정보를 기반으로 가입하여야 하며, 허위 정보 제공 시
            서비스 이용이 제한될 수 있습니다.{"\n"}계정(ID, 비밀번호)에 대한 관리
            책임은 회원에게 있으며, 제3자에게 양도·대여할 수 없습니다.
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제3조 (서비스의 제공 및 한계)</Text>
          <Text style={styles.articleBody}>
            서비스는 AI를 활용한 모의면접, 이력서·자기소개서 분석 및 피드백을
            제공합니다. {"\n"}서비스는 참고용 도구일 뿐, 실제 채용 합격 여부를
            보장하지 않습니다. {"\n"}회사는 기술적·운영상 필요에 따라 서비스의
            일부 또는 전부를 변경·중단할 수 있습니다.{"\n"}AI가 판단한 결과는 여러
            직무 정보들을 종합하여 만들어낸 것으로 회원의 채용결과에 관여하지
            않습니다.
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제4조 (개인정보 및 데이터 처리)</Text>
          <Text style={styles.articleBody}>
            서비스 제공을 위해 회원은 이력서, 자기소개서, 음성·영상 데이터 등을
            제출할 수 있습니다.{"\n"}회사는 개인정보보호법 등 관계 법령을
            준수하며, 회원의 데이터는 서비스 제공 목적에만 사용됩니다. {"\n"}
            회원은 언제든지 데이터 삭제를 요청할 수 있으며, 회사는 지체 없이 이를
            처리합니다.
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제5조 (이용자의 의무)</Text>
          <Text style={styles.articleBody}>
            회원은 다음 행위를 하여서는 안 됩니다. {"\n"}- 타인의 개인정보 또는
            자료를 무단으로 사용하는 행위 {"\n"}- 서비스의 정상 운영을 방해하거나
            불법적인 콘텐츠를 업로드하는 행위
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제6조 (지식재산권)</Text>
          <Text style={styles.articleBody}>
            서비스 내 질문, 분석 결과 및 피드백에 대한 저작권은 회사에 귀속됩니다.
            {"\n"}회원이 업로드한 이력서·자기소개서 등은 회원에게 소유권이 있으며,
            회사는 서비스 제공 범위 내에서만 이를 활용할 수 있습니다.
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제7조 (면책조항)</Text>
          <Text style={styles.articleBody}>
            회사는 서비스 오류, 중단 등으로 발생한 손해에 대해 고의 또는 중대한
            과실이 없는 한 책임을 지지 않습니다. {"\n"}AI 분석 결과의
            정확성·완전성에 대해 보장하지 않으며, 해당 결과로 인한 의사결정은
            전적으로 회원의 책임입니다.
          </Text>
        </View>

        <View style={styles.article}>
          <Text style={styles.articleTitle}>제8조 (분쟁 해결)</Text>
          <Text style={styles.articleBody}>
            본 약관과 관련하여 분쟁이 발생할 경우 대한민국 법을 준거법으로 하며,
            회사의 본사 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.
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
