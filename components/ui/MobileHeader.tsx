import {
    Button,
    Icon,
    Overlay,
    Header as RNEHeader,
    Text,
} from "@rneui/themed";
import { Image } from "expo-image";
import { Href, Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/authStore";

interface MobileHeaderProps {
  showNav?: boolean;
  showBackButton?: boolean;
}

export default function MobileHeader({
  showNav = true,
  showBackButton = false,
}: MobileHeaderProps) {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { logout } = useAuth();
  const router = useRouter();
  const [isMenuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    toggleMenu();
    await logout();
    router.replace("/");
  };

  const NAV_ITEMS = [
    { title: t("components.header.navigation.home"), href: "/" as Href },
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
  ];

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const AUTH_NAV_ITEMS = [
    {
      title: t("components.header.navigation.my_page"),
      href: "/(protected)/my-page" as Href,
      onPress: toggleMenu,
    },
  ];

  const renderLeftComponent = () => {
    if (showBackButton) {
      return (
        <Icon
          name="arrow-back"
          type="material"
          color="#fff"
          onPress={() => router.back()}
        />
      );
    }
    if (showNav) {
      return (
        <Icon name="menu" type="material" color="#fff" onPress={toggleMenu} />
      );
    }
    return (
      <Icon
        name="arrow-back"
        type="material"
        color="#fff"
        onPress={() => router.back()}
      />
    );
  };

  return (
    <>
      <RNEHeader
        leftComponent={renderLeftComponent()}
        centerComponent={
          <Link href={"/" as Href} style={{ display: "flex" }}>
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/react-logo.png")}
                style={styles.logo}
              />
              <Text style={styles.heading}>
                {t("components.header.navigation.home")}
              </Text>
            </View>
          </Link>
        }
        containerStyle={[
          styles.headerContainer,
          { backgroundColor: "#1C1C1E" },
        ]}
        leftContainerStyle={{ justifyContent: "center" }}
        centerContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      />
      {showNav && (
        <Overlay
          isVisible={isMenuVisible}
          onBackdropPress={toggleMenu}
          overlayStyle={{ borderRadius: 0 }}
          fullScreen
        >
          <View style={styles.overlayContainer}>
            <Icon
              name="close"
              type="material"
              onPress={toggleMenu}
              containerStyle={styles.closeIcon}
              color="black"
            />
            {NAV_ITEMS.map((item, index) => (
              <Link key={index} href={item.href as Href} asChild>
                <Button
                  title={item.title}
                  onPress={toggleMenu}
                  type="clear"
                  titleStyle={styles.overlayMenuText}
                  containerStyle={styles.overlayMenuItem}
                />
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {AUTH_NAV_ITEMS.map((item, index) => (
                  <Link key={index} href={item.href as Href} asChild>
                    <Button
                      title={item.title}
                      onPress={item.onPress}
                      type="clear"
                      titleStyle={styles.overlayMenuText}
                      containerStyle={styles.overlayMenuItem}
                    />
                  </Link>
                ))}
                <Button
                  title={t("components.header.navigation.sign_out")}
                  onPress={handleLogout}
                  type="clear"
                  titleStyle={styles.overlayMenuText}
                  containerStyle={styles.overlayMenuItem}
                />
              </>
            ) : (
              <Link href={"/sign-in" as Href} asChild>
                <Button
                  title={t("components.header.navigation.sign_in")}
                  onPress={toggleMenu}
                  type="clear"
                  titleStyle={styles.overlayMenuText}
                  containerStyle={styles.overlayMenuItem}
                />
              </Link>
            )}
          </View>
        </Overlay>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 0,
    backgroundColor: "#1C1C1E",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  heading: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  overlayMenuItem: {
    marginVertical: 20,
  },
  overlayMenuText: {
    color: "black",
    fontSize: 24,
  },
});
