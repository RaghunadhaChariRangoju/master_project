import { z } from 'zod';

// Shared email validation schema
export const emailSchema = z.string().email({ message: 'Please enter a valid email address' });

// Shared password validation schema
export const passwordSchema = z.string().min(6, { message: 'Password must be at least 6 characters' });

// Password with confirmation validation
export const passwordWithConfirmSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().default(false),
});

// Register form schema
export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Reset password form schema (email only)
export const resetPasswordSchema = z.object({
  email: emailSchema,
});

// Update password form schema
export const updatePasswordSchema = passwordWithConfirmSchema;

// Type inferences for all schemas
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;
