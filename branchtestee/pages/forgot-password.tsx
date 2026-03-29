import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { postForgotPassword } from "../endpoints/auth/forgot_password_POST.schema";
import styles from "./login.module.css";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Spinner } from "../components/Spinner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Por favor, digite seu email.");
      return;
    }
    
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const result = await postForgotPassword({ email });
      setMessage(result.message);
    } catch (err: any) {
      setError(err.message || "Erro ao redefinir a senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Esqueci minha senha - Adapta Studio</title>
      </Helmet>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>✦ ADAPTA CORE STUDIO</div>
          <h1 className={styles.title}>Esqueci minha senha</h1>
          <p className={styles.subtitle}>
            Digite seu email abaixo para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && <div style={{ color: 'red', fontSize: '0.875rem' }}>{error}</div>}
          {message && <div style={{ color: 'green', fontSize: '0.875rem', fontWeight: 'bold' }}>{message}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>

          <Button type="submit" disabled={isLoading} style={{ width: '100%', marginTop: '8px' }}>
            {isLoading ? <Spinner size="sm" /> : "Redefinir senha"}
          </Button>
        </form>

        <div className={styles.footer} style={{ marginTop: '24px' }}>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className={styles.link}
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    </div>
  );
}
