import { Button, Icon, Input, Text } from "@rneui/themed";
import { Href, Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function SignIn() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Text h2 style={styles.title}>
        Welcome Back
      </Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <Input
        placeholder="Email"
        leftIcon={
          <Icon name="email" type="material-community" color="#8E8E93" />
        }
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        containerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />
      <Input
        placeholder="Password"
        leftIcon={
          <Icon name="lock" type="material-community" color="#8E8E93" />
        }
        value={password}
        onChangeText={setPassword}
        containerStyle={styles.inputContainer}
        inputStyle={styles.inputText}
      />

      <Button
        title={t("pages.sign_in.sign_in")}
        onPress={handleSignIn}
        containerStyle={styles.signInButtonContainer}
        buttonStyle={styles.signInButton}
        titleStyle={styles.signInButtonText}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t("pages.sign_in.sign_up_notice")}</Text>
        <Link href={"/sign-up" as Href} style={styles.link}>
          <Text style={styles.linkText}>{t("pages.sign_in.sign_up")}</Text>
        </Link>
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or continue with</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Icon
            name="google"
            type="font-awesome"
            color="#DB4437"
            containerStyle={{ pointerEvents: "none" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  title: {
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    color: "#6E6E72",
    marginBottom: 32,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputText: {
    color: "#000000",
  },
  signInButtonContainer: {
    width: "100%",
  },
  signInButton: {
    backgroundColor: "#000000",
    borderRadius: 8,
    paddingVertical: 12,
    width: "100%",
  },
  signInButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#FFFFFF",
    width: "100%",
  },
  footer: {
    alignItems: "center",
    flexDirection: "column",
    marginTop: 24,
  },
  footerText: {
    color: "#6E6E72",
  },
  link: {
  },
  linkText: {
    color: "#000000",
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#6E6E72",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    cursor: "pointer",
  },
});
