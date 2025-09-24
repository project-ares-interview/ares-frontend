import Footer from "@/components/ui/Footer";
import { Video } from "expo-av";
import { Image } from "expo-image";
import { ScrollView, StyleSheet, View } from "react-native";

import { Text } from "@rneui/themed";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.videoContainer}>
          <Video
            source={require("@/assets/videos/main-background.mp4")}
            style={styles.video}
            shouldPlay
            isLooping
            isMuted
            resizeMode="cover"
          />
        </View>
        <View style={styles.videoContainer}>
          <Video
            source={require("@/assets/videos/main-background-2.mp4")}
            style={styles.video}
            shouldPlay
            isLooping
            isMuted
            resizeMode="cover"
          />
        </View>
        <View style={styles.overlay} />
        <View style={styles.textOverlay}>
          <Text style={styles.title}>{t("pages.index.title")}</Text>
          <Text style={styles.subtitle}>{t("pages.index.subtitle")}</Text>
        </View>
      </View>
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>
          {t("pages.index.features.title")}
        </Text>
        <View style={styles.featuresContainer}>
          <View style={styles.featureBox}>
            <Image
              source={require("@/assets/images/new_transparent.png")}
              style={styles.featureImage}
            />
            <View
              style={{
                height: 1,
                width: "80%",
                backgroundColor: "#818080ff",
                marginVertical: 12,
              }}
            />
            <Text style={styles.featureBoxTitle}>
              {t("pages.index.features.box1_title")}
            </Text>
            <Text style={styles.featureBoxDescription}>
              {t("pages.index.features.box1_description")}
            </Text>
          </View>
          <View style={styles.featureBox}>
            <Image
              source={require("@/assets/images/new_transparent_icon_1.png")}
              style={styles.featureImage}
            />
            <View
              style={{
                height: 1,
                width: "80%",
                backgroundColor: "#818080ff",
                marginVertical: 12,
              }}
            />
            <Text style={styles.featureBoxTitle}>
              {t("pages.index.features.box2_title")}
            </Text>
            <Text style={styles.featureBoxDescription}>
              {t("pages.index.features.box2_description")}
            </Text>
          </View>
          <View style={styles.featureBox}>
            <Image
              source={require("@/assets/images/new_transparent_icon_2.png")}
              style={styles.featureImage}
            />
            <View
              style={{
                height: 1,
                width: "80%",
                backgroundColor: "#818080ff",
                marginVertical: 12,
              }}
            />
            <Text style={styles.featureBoxTitle}>
              {t("pages.index.features.box3_title")}
            </Text>
            <Text style={styles.featureBoxDescription}>
              {t("pages.index.features.box3_description")}
            </Text>
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
    height: 800,
    width: "100%",
    flexDirection: "row",
    position: "relative",
    justifyContent: "flex-start",
  },
  videoContainer: {
    flex: 1,
    height: "100%",
    margin: 0,
    padding: 0,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 2,
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  subtitle: {
    fontSize: 24,
    textAlign: "center",
    color: "white",
  },
  featuresSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  featuresTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  featureBox: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#818080ff",
    borderRadius: 8,
    marginHorizontal: 8,
  },
  featureImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
    resizeMode: "contain",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 5,
  },
  featureBoxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  featureBoxDescription: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
});
