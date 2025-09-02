import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { signUpSchema, type SignUpSchema } from "../schemas/auth";

export function useSignUp() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      gender: "",
      birth: "",
      phoneNumber: "",
      terms: false,
    },
  });

  const handleSignUp = (data: SignUpSchema) => {
    // TODO: Implement actual sign-up logic
    router.replace("/");
  };

  const submit = handleSubmit(handleSignUp);

  return { control, errors, submit, isValid };
}
