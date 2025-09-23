import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import { useSignIn } from "@/hooks/useSignIn";
import { FontAwesome5 } from "@expo/vector-icons";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { Link } from "expo-router";
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>

        <View style={styles.formGroup}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder={t("pages.sign_in.email")}
                  placeholderTextColor="#aaa"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {errors.email && (
                  <Text style={styles.errorText}>
                    {t(errors.email.message as any)}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View style={styles.formGroup}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder={t("pages.sign_in.password")}
                  placeholderTextColor="#aaa"
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  secureTextEntry
                />
                {errors.password && (
                  <Text style={styles.errorText}>
                    {t(errors.password.message as any)}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && styles.disabledButton]}
          onPress={submit}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>{t("pages.sign_in.sign_in")}</Text>
        </TouchableOpacity>

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
              <FontAwesome5 name="google" size={24} color="#DB4437" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.googleMobileButton]}
            onPress={() => promptMobileAsync()}
            disabled={!isReady}
          >
            <FontAwesome5 name="google" size={18} color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </TouchableOpacity>
        )}

        <View style={styles.signUpContainer}>
          <Text style={{ fontSize: 16 }}>
            {t("pages.sign_in.sign_up_notice")}
          </Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.signUpLinkText}>
                {t("pages.sign_in.sign_up")}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
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
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  formContainer: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "white",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    marginLeft: 2,
  },
  button: {
    backgroundColor: "#4972c3ff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#ccc",
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
  },
  googleMobileButton: {
    flexDirection: "row",
    backgroundColor: "#DB4437",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },
  signUpLinkText: {
    color: "#4972c3ff",
    fontWeight: "bold",
    fontSize: 16,
  },
});