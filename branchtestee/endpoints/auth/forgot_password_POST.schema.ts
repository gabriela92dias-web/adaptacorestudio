import { z } from "zod";

export const schema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
});

export type ForgotPasswordFormData = z.infer<typeof schema>;

export async function postForgotPassword(data: ForgotPasswordFormData) {
  const response = await fetch("/_api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao enviar email de redefinição.");
  }
  return await response.json();
}
