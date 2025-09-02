import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "이메일을 입력해주세요." })
    .email({ message: "유효한 이메일 형식이 아닙니다." }),
  password: z
    .string()
    .min(1, { message: "비밀번호를 입력해주세요." })
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "비밀번호에는 특수문자가 하나 이상 포함되어야 합니다.",
    }),
});

export type SignInSchema = z.infer<typeof signInSchema>;
