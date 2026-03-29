import React from "react";
import { CriarCampanha } from "../components/brand-studio/criar-campanha";

export default function V8TestPage() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      <CriarCampanha isOpen={true} onClose={() => {}} />
    </div>
  );
}
