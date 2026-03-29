import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Share() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona para o Timeline com hash para a tab do mLabs
    navigate("/tools/timeline?view=mlabs-integration");
  }, [navigate]);

  return (
    <div className="h-full flex items-center justify-center bg-neutral-950">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-profundo-100 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-400">Redirecionando para mLabs...</p>
      </div>
    </div>
  );
}
