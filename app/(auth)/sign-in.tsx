import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import { useSignIn } from "@/hooks/useSignIn";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { Button, Icon, Input, Text as RNEText } from "@rneui/themed";
import { Link } from "expo-router";
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

function SignInForm() {
  const { t } = useTranslation();
  const { control, errors, submit, isValid } = useSignIn();
  const { isReady, promptMobileAsync, handleGoogleSignIn } = useGoogleSignIn();

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) =>
      handleGoogleSignIn(tokenResponse.access_token),
    onError: () => console.log("Login Failed"),
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <RNEText h2 style={styles.title}>
        Sign In
      </RNEText>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder={t("pages.sign_in.email")}
            leftIcon={<Icon name="email" type="material-community" />}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
            errorMessage={errors.email && t(errors.email.message as any)}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder={t("pages.sign_in.password")}
            leftIcon={<Icon name="lock" type="material-community" />}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry
            errorMessage={errors.password && t(errors.password.message as any)}
          />
        )}
      />

      <Button
        title={t("pages.sign_in.sign_in")}
        onPress={submit}
        disabled={!isValid}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.signInButton}
      />

      <View style={styles.signUpContainer}>
        <Text style={{ fontSize: 16 }}>
          {t("pages.sign_in.sign_up_notice")}
        </Text>
        <Link href="/sign-up" style={styles.signUpLink}>
          <Text style={styles.signUpLinkText}>
            {t("pages.sign_in.sign_up")}
          </Text>
        </Link>
      </View>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {Platform.OS === "web" ? (
        <View style={styles.googleButtonContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => googleLogin()}
          >
            <Icon
              name="google"
              type="antdesign"
              color="#DB4437"
              containerStyle={{ pointerEvents: "none" }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <Button
          title="Sign in with Google"
          onPress={() => promptMobileAsync()}
          disabled={!isReady}
          icon={
            <Icon name="google" type="antdesign" style={{ marginRight: 10 }} />
          }
          containerStyle={styles.buttonContainer}
        />
      )}
    </ScrollView>
  );
}

export default function SignIn() {
  if (Platform.OS === "web") {
    return (
      <GoogleOAuthProvider
        clientId={process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!}
      >
        <SignInForm />
      </GoogleOAuthProvider>
    );
  }

  return <SignInForm />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 16,
  },
  signInButton: {
    backgroundColor: "#000000",
    borderRadius: 8,
    paddingVertical: 12,
    width: "100%",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D1D6",
  },
  dividerText: {
    marginHorizontal: 8,
    color: "#8A8A8E",
  },
  googleButtonContainer: {
    alignItems: "center",
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
  signUpContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signUpLink: {
  },
  signUpLinkText: {
    color: "#000",
    fontWeight: "bold",
  },
});
