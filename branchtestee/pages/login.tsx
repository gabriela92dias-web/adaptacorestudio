import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Navigate } from "react-router-dom";
import { PasswordLoginForm } from "../components/PasswordLoginForm";
import { PasswordRegisterForm } from "../components/PasswordRegisterForm";
import { useAuth } from "../helpers/useAuth";
import styles from "./login.module.css";

export default function LoginPage() {
  const { authState } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  if (authState.type === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.container}>
      <Helmet>
        <title>{isRegistering ? "Criar conta" : "Entrar"} - Adapta Studio</title>
        <meta name="description" content="Faça login ou cadastre-se no Adapta Core Studio" />
      </Helmet>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>✦ ADAPTA CORE STUDIO</div>
          <h1 className={styles.title}>
            {isRegistering ? "Criar conta" : "Bem-vindo de volta"}
          </h1>
          <p className={styles.subtitle}>
            {isRegistering
              ? "Preencha os dados abaixo para criar sua conta."
              : "Por favor, insira suas credenciais para acessar sua conta."}
          </p>
        </div>

        {isRegistering ? <PasswordRegisterForm /> : <PasswordLoginForm />}

        <div className={styles.footer}>
          <span className={styles.footerText}>
            {isRegistering ? "Já tem uma conta? " : "Não tem uma conta? "}
          </span>
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className={styles.link}
          >
            {isRegistering ? "Entrar" : "Cadastre-se"}
          </button>
        </div>
      </div>
    </div>
  );
}