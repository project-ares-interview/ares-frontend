import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { signInSchema, type SignInSchema } from "../schemas/auth";
import { useAuth } from "./useAuth";

export function useSignIn() {
  const router = useRouter();
  const { signIn } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (data: SignInSchema) => {
    try {
      await signIn(data);
      router.replace("/");
    } catch (error) {
      // Handle sign-in error (e.g., show a toast message)
      console.error("Sign in failed:", error);
    }
  };

  const submit = handleSubmit(handleSignIn);

  return { control, errors, submit, isValid };
}
