import Footer from "@/components/ui/Footer";
import { Image } from "expo-image";
import { ScrollView, StyleSheet, View } from "react-native";

import { Text } from "@rneui/themed";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={{ fontSize: 64, fontWeight: "bold", textAlign: 'center' }}>{t("pages.index.title")}</Text>
        <Text style={{ fontSize: 24, textAlign: 'center' }}>{t("pages.index.subtitle")}</Text>
      </View>
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>{t("pages.index.features.title")}</Text>
        <View style={styles.featuresContainer}>
          <View style={styles.featureBox}>
            <Image
              source={require('@/assets/images/feature-1.png')}
              style={styles.featureImage}
            />
            <Text style={styles.featureBoxTitle}>{t("pages.index.features.box1_title")}</Text>
            <Text style={styles.featureBoxDescription}>{t("pages.index.features.box1_description")}</Text>
          </View>
          <View style={styles.featureBox}>
            <Image
              source={require('@/assets/images/feature-2.png')}
              style={styles.featureImage}
            />
            <Text style={styles.featureBoxTitle}>{t("pages.index.features.box2_title")}</Text>
            <Text style={styles.featureBoxDescription}>{t("pages.index.features.box2_description")}</Text>
          </View>
          <View style={styles.featureBox}>
            <Image
              source={require('@/assets/images/feature-3.png')}
              style={styles.featureImage}
            />
            <Text style={styles.featureBoxTitle}>{t("pages.index.features.box3_title")}</Text>
            <Text style={styles.featureBoxDescription}>{t("pages.index.features.box3_description")}</Text>
          </View>
        </View>
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
    minHeight: 800,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  featuresSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  featureBox: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  featureImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  featureBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureBoxDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});
