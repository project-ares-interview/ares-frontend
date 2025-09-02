import Footer from "@/components/ui/Footer";
import { ScrollView, StyleSheet, View } from "react-native";

import { Text } from "@rneui/themed";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={{ fontSize: 64, fontWeight: "bold" }}>{t("welcome")}</Text>
      </View>
      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    minHeight: 1200,
    paddingVertical: 40
  },
});
