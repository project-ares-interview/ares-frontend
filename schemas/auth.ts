import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "errors.email.required" })
    .email({ message: "errors.email.invalid" }),
  password: z
    .string()
    .min(1, { message: "errors.password.required" })
    .min(8, { message: "errors.password.min_length" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "errors.password.special_char",
    }),
});

export type SignInSchema = z.infer<typeof signInSchema>;

const baseSignUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "errors.email.required" })
    .email({ message: "errors.email.invalid" }),
  name: z.string().min(1, { message: "errors.name.required" }),
  gender: z.string().min(1, { message: "errors.gender.required" }),
  birth: z.string().min(1, { message: "errors.birth.required" }),
  phoneNumber: z
    .string()
    .min(1, { message: "errors.phone_number.required" }),
  terms: z.boolean().refine((val) => val, {
    message: "errors.terms.required",
  }),
});

export const socialSignUpSchema = baseSignUpSchema;

export const emailSignUpSchema = baseSignUpSchema
  .extend({
    password: z
      .string()
      .min(1, { message: "errors.password.required" })
      .min(8, { message: "errors.password.min_length" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "errors.password.special_char",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "errors.confirm_password.required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "errors.confirm_password.mismatch",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof socialSignUpSchema> &
  Partial<z.infer<typeof emailSignUpSchema>>;
