import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
  useForm,
} from "./Form";
import { Input } from "./Input";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { useAuth } from "../helpers/useAuth";
import {
  schema,
} from "../endpoints/auth/register_with_password_POST.schema";
import styles from "./PasswordRegisterForm.module.css";

export type RegisterFormData = z.infer<typeof schema>;

interface PasswordRegisterFormProps {
  className?: string;
  defaultValues?: Partial<RegisterFormData>;
}

export const PasswordRegisterForm: React.FC<PasswordRegisterFormProps> = ({
  className,
  defaultValues,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    schema,
    defaultValues: defaultValues || {
      email: "",
      password: "",
      displayName: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await signUp(data.email, data.password, data.displayName);
      if (error) throw new Error(error.message);
      
      console.log("Registration successful for:", data.email);
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);

      if (err instanceof Error) {
        const errorMessage = err.message;

        if (errorMessage.includes("Email already in use")) {
          setError(
            "Este email já está registrado. Tente fazer login."
          );
        } else if (errorMessage.toLowerCase().includes("display name")) {
          setError("Forneça um nome válido que não esteja vazio.");
        } else if (
          errorMessage.includes("display") ||
          errorMessage.includes("name")
        ) {
          setError("Verifique seu nome: " + errorMessage);
        } else {
          setError(errorMessage || "Falha no registro. Tente novamente.");
        }
      } else {
        console.log("Unknown error type:", err);
        setError("Falha no registro. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <form
        onSubmit={form.handleSubmit((data) =>
          handleSubmit(data as z.infer<typeof schema>)
        )}
        className={`${styles.form} ${className || ""}`}
      >
        <FormItem name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input
              placeholder="seu@email.com"
              value={form.values.email || ""}
              onChange={(e) =>
                form.setValues((prev: any) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>

        <FormItem name="displayName">
          <FormLabel>Nome</FormLabel>
          <FormControl>
            <Input
              id="register-display-name"
              placeholder="Seu nome"
              value={form.values.displayName || ""}
              onChange={(e) =>
                form.setValues((prev: any) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
            />
          </FormControl>
          <FormDescription>
            Espaços, emojis e caracteres especiais são permitidos
          </FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem name="password">
          <FormLabel>Senha</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder="••••••••"
              value={form.values.password || ""}
              onChange={(e) =>
                form.setValues((prev: any) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </FormControl>
          <FormDescription>
            Mínimo de 8 caracteres
          </FormDescription>
          <FormMessage />
        </FormItem>

        <Button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" /> Criando conta...
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>
    </Form>
  );
};
