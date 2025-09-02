import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { signInSchema, type SignInSchema } from "../schemas/auth";

export function useSignIn() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = (data: SignInSchema) => {
    router.replace("/");
  };

  const submit = handleSubmit(handleSignIn);

  return { control, errors, submit };
}
