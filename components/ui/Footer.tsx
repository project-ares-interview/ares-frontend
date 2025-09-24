import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon, ListItem, Overlay, Text } from "@rneui/themed";
import { Image } from "expo-image";
import { Href, Link } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

const SUPPORT_LANGUAGES = [
  { code: "ko", name: "한국어" },
  { code: "en", name: "English" },
];

export default function Footer() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { i18n } = useTranslation();
  const [isMenuVisible, setMenuVisible] = useState(false);

  const FOOTER_LINKS = [
    { title: t("components.footer.navigation.terms"), href: "/terms" as Href },
    {
      title: t("components.footer.navigation.privacy"),
      href: "/privacy" as Href,
    },
    { title: t("pages.faq.title"), href: "/faq" as Href },
  ];

  const changeLanguage = async (langCode: string) => {
    i18n.changeLanguage(langCode);
    await AsyncStorage.setItem("@app_language", langCode);
    setMenuVisible(false);
  };

  const currentLanguage =
    SUPPORT_LANGUAGES.find((lang) => lang.code === i18n.language)?.name ||
    "Language";

  return (
    <View style={styles.container}>
      <View style={[styles.topSection, isMobile && styles.topSectionMobile]}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/symbol.png")}
            style={styles.logo}
          />
          <Text style={styles.companyName}>JAI(JobAI)</Text>
        </View>

        <View
          style={[styles.rightSection, isMobile && styles.rightSectionMobile]}
        >
          <View style={styles.linksContainer}>
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href as string}
                href={link.href as Href}
                style={styles.link}
              >
                <Text style={styles.linkText}>{link.title}</Text>
              </Link>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            style={styles.langButton}
          >
            <Icon name="language" color="#8E8E93" style={styles.langIcon} />
            <Text style={styles.linkText}>{currentLanguage}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Overlay
        isVisible={isMenuVisible}
        onBackdropPress={() => setMenuVisible(false)}
        overlayStyle={styles.languageOverlay}
      >
        {SUPPORT_LANGUAGES.map((lang) => (
          <ListItem
            key={lang.code}
            onPress={() => changeLanguage(lang.code)}
            style={styles.languageItem}
          >
            <ListItem.Content>
              <ListItem.Title>{lang.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </Overlay>

      <View style={styles.bottomSection}>
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Project. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1C1C1E",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#3A3A3C",
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  topSectionMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 6,
  },
  companyName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightSectionMobile: {
    marginTop: 20,
  },
  linksContainer: {
    flexDirection: "row",
    marginRight: 20,
  },
  link: {
    marginLeft: 20,
  },
  linkText: {
    color: "#8E8E93",
    fontSize: 14,
  },
  langButton: {
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  langIcon: {
    marginRight: 6,
  },
  languageOverlay: {
    width: 200,
    borderRadius: 6,
  },
  languageItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: "#3A3A3C",
    paddingTop: 20,
    alignItems: "center",
  },
  copyright: {
    color: "#8E8E93",
    fontSize: 12,
  },
});
