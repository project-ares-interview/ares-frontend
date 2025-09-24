import { Button, Text } from "@rneui/themed";
import { Image } from "expo-image";
import { Href, Link } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/authStore";

interface DesktopHeaderProps {
  showNav?: boolean;
}

export default function DesktopHeader({ showNav = true }: DesktopHeaderProps) {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const NAV_ITEMS = [
    {
      title: t("components.header.navigation.cover_letter"),
      href: "/cover-letter" as Href,
    },
    {
      title: t("components.header.navigation.resume"),
      href: "/resumes" as Href,
    },
    {
      title: t("components.header.navigation.interview"),
      href: "/interviewstart" as Href,
    },
    {
      title: t("components.header.navigation.pricing"),
      href: "/pricing" as Href,
    },
    {
      title: t("components.header.navigation.calendar"),
      href: "/calendar" as Href,
    },
  ];

  return (
    <View style={[styles.headerContainer, styles.desktopHeaderContainer]}>
      <View style={styles.leftSection}>
        <Link href={"/" as Href} style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/symbol.png")}
            style={styles.logo}
          />
          <Text h4 style={styles.heading}>
            {t("components.header.navigation.home")}
          </Text>
        </Link>
        {showNav && (
          <View style={styles.desktopNav}>
            {NAV_ITEMS.map((item, index) => (
              <Link key={index} href={item.href as Href} asChild>
                <Button
                  title={item.title}
                  type="clear"
                  titleStyle={styles.desktopNavLink}
                />
              </Link>
            ))}
          </View>
        )}
      </View>
      {showNav &&
        (isAuthenticated ? (
          <View style={styles.rightAuthSection}>
            <Link href={"/(protected)/my-page" as Href} asChild>
              <Button
                title={t("components.header.navigation.my_page")}
                type="clear"
                titleStyle={styles.desktopNavLink}
              />
            </Link>
            <Button
              title={t("components.header.navigation.sign_out")}
              onPress={handleLogout}
              buttonStyle={styles.loginButton}
            />
          </View>
        ) : (
          <Link href={"/(auth)/sign-in" as Href} asChild>
            <Button
              title={t("components.header.navigation.sign_in")}
              buttonStyle={styles.loginButton}
            />
          </Link>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 0,
  },
  desktopHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#1C1C1E",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  rightAuthSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 6,
  },
  heading: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  desktopNav: {
    flexDirection: "row",
    marginLeft: 24,
  },
  desktopNavLink: {
    color: "#fff",
    marginHorizontal: 15,
  },
  loginButton: {
    backgroundColor: "#3A3A3C",
  },
});
