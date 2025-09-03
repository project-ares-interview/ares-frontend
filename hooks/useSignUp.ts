import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  emailSignUpSchema,
  socialSignUpSchema,
  type SignUpSchema,
} from "../schemas/auth";
import { authService } from "../services/authService";
import { useAuthStore } from "../stores/authStore";

export function useSignUp() {
  const router = useRouter();
  const socialSignUpData = useAuthStore((state) => state.socialSignUpData);
  const clearSocialSignUpData = useAuthStore(
    (state) => state.setSocialSignUpData,
  );

  const isSocialSignUp = !!socialSignUpData;
  const schema = isSocialSignUp ? socialSignUpSchema : emailSignUpSchema;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: socialSignUpData?.email || "",
      password: "",
      confirmPassword: "",
      name: socialSignUpData?.name || "",
      gender: "",
      birth: "",
      phoneNumber: "",
      terms: false,
    },
  });

  const handleSignUp = async (data: SignUpSchema) => {
    try {
      const { confirmPassword, terms, phoneNumber, ...rest } = data;

      if (socialSignUpData) {
        const payload = {
          email: data.email,
          name: data.name,
          gender: data.gender,
          birth: data.birth,
          phone_number: phoneNumber,
          signed_data: socialSignUpData.signed_data,
        };
        await authService.socialSignUp(socialSignUpData.provider, payload);
        clearSocialSignUpData(null);
        router.replace("/");
      } else {
        const payload = {
          ...rest,
          phone_number: phoneNumber,
        };
        await authService.signUp(payload);
        router.replace("/sign-in");
      }
    } catch (error) {
      // Handle sign-up error (e.g., show a toast message)
      console.error("Sign up failed:", error);
    }
  };

  const submit = handleSubmit(handleSignUp);

  return { control, errors, submit, isValid, socialSignUpData };
}
