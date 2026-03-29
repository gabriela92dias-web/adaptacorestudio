# 🎨 ADAPTA DESIGN TOKENS — AI Agent Quick Apply Guide

## INSTRUÇÕES PARA AGENTE DE IA

Aplicar estes tokens na aplicação seguindo estes passos:

### 1️⃣ CRIAR FICHEIRO DE TOKENS

Cria o ficheiro `/src/styles/adapta-tokens.css` com este conteúdo:

```css
/* ═══════════════════════════════════════════════════════════════
   ADAPTA DESIGN TOKENS — Sistema de Design Completo
   ═══════════════════════════════════════════════════════════════
   Gerado automaticamente a partir do Estojo de Ferramentas
   Última atualização: 14/03/2026
   ═══════════════════════════════════════════════════════════════ */

:root {
  /* ═══ CORES — VENTURA (Verde Institucional) ═══ */
  /* LUZ (Neutral Claro) */
  --adapta-luz-sageMist: #FAFBFA;
  --adapta-luz-hempCanvas: #F7F9F8;
  --adapta-luz-sageWhisper: #EDF1EF;
  --adapta-luz-leafFrost: #D5E2D5;
  --adapta-luz-forestDew: #B5C5BC;

  /* ALMA (Neutral Médio) */
  --adapta-alma-greenSmoke: #8FA89B;
  --adapta-alma-emeraldHaze: #6A8A7A;
  --adapta-alma-deepPine: #455A4F;
  --adapta-alma-forestShadow: #2E3E34;
  --adapta-alma-midnightGarden: #1F2A23;

  /* FIRMEZA (Neutral Escuro) */
  --adapta-firmeza-darkForest: #1A231D;
  --adapta-firmeza-blackEarth: #141A17;
  --adapta-firmeza-deepShadow: #0F1411;
  --adapta-firmeza-voidGreen: #0A0D0B;
  --adapta-firmeza-absolute: #000000;

  /* CANDY (Verde Limão Pastel) */
  --adapta-candy-marshmallow: #F7FBF0;
  --adapta-candy-acucar: #EFF7E0;
  --adapta-candy-baunilha: #E5F2D0;
  --adapta-candy-pistache: #DBEDC2;
  --adapta-candy-chantilly: #D1E8B4;

  /* LEMON (Verde Limão Suave) */
  --adapta-lemon-neblina: #F5F9F2;
  --adapta-lemon-vapor: #EAF3E5;
  --adapta-lemon-citrus: #DFEDD8;
  --adapta-lemon-zeste: #D3E7CA;
  --adapta-lemon-sumo: #C7E1BD;

  /* VENTURA (Verde Institucional) */
  --adapta-ventura-nevoaclara: #E8EFE0;
  --adapta-ventura-fumaca: #D7E3CC;
  --adapta-ventura-bruma: #C1D4B2;
  --adapta-ventura-veu: #A8BF9A;
  --adapta-ventura-sombra: #8CA680;

  /* ENERGIA (Amarelo Quente) ⚠️ NUNCA com verde! */
  --adapta-energia-campoAlto: #FFFAE0;
  --adapta-energia-campoVelado: #FFE7A3;
  --adapta-energia-centro: #FFE2C2;
  --adapta-energia-marcaTexto: #FED376;
  --adapta-energia-denso: #F58E72;

  /* ALEGRIA (Rosa Berry) */
  --adapta-alegria-campoAlto: #FDE2DD;
  --adapta-alegria-campoVelado: #FFC8C2;
  --adapta-alegria-centro: #FFA3B1;
  --adapta-alegria-marcaTexto: #FE86A4;
  --adapta-alegria-denso: #CF6E9B;

  /* SEGURANÇA (Lavanda Roxo) */
  --adapta-seguranca-campoAlto: #F1E6F0;
  --adapta-seguranca-campoVelado: #DEC7DE;
  --adapta-seguranca-centro: #D0AEE0;
  --adapta-seguranca-marcaTexto: #D1B4FE;
  --adapta-seguranca-denso: #9DA0EC;

  /* ═══ TIPOGRAFIA ═══ */
  /* Famílias de fonte */
  --adapta-font-display: MuseoModerno, Montserrat, ui-sans-serif, system-ui, sans-serif;
  --adapta-font-heading: Montserrat, ui-sans-serif, system-ui, sans-serif;
  --adapta-font-body: Glacial Indifference, Raleway, ui-sans-serif, system-ui, sans-serif;
  --adapta-font-editorial: Cormorant Garamond, ui-serif, Georgia, serif;
  --adapta-font-energetic: All Caps, Montserrat, sans-serif;
  --adapta-font-warm: Cause, cursive;
  --adapta-font-bold: SUSE, sans-serif;
  --adapta-font-regional: Ofissina, sans-serif;
  --adapta-font-signature: Mayonice, cursive;
  --adapta-font-crafted: Fomo, sans-serif;

  /* Tamanhos */
  --adapta-size-xs: 0.75rem;
  --adapta-size-sm: 0.875rem;
  --adapta-size-base: 1rem;
  --adapta-size-lg: 1.125rem;
  --adapta-size-xl: 1.25rem;
  --adapta-size-2xl: 1.5rem;
  --adapta-size-3xl: 1.875rem;
  --adapta-size-4xl: 2.25rem;
  --adapta-size-5xl: 3rem;
  --adapta-size-6xl: 3.75rem;
  --adapta-size-7xl: 4.5rem;
  --adapta-size-8xl: 6rem;
  --adapta-size-9xl: 8rem;

  /* Pesos */
  --adapta-weight-thin: 100;
  --adapta-weight-extralight: 200;
  --adapta-weight-light: 300;
  --adapta-weight-regular: 400;
  --adapta-weight-medium: 500;
  --adapta-weight-semibold: 600;
  --adapta-weight-bold: 700;
  --adapta-weight-extrabold: 800;
  --adapta-weight-black: 900;

  /* Espaçamento de letras */
  --adapta-letter-tighter: -0.05em;
  --adapta-letter-tight: -0.025em;
  --adapta-letter-normal: 0;
  --adapta-letter-wide: 0.025em;
  --adapta-letter-wider: 0.05em;
  --adapta-letter-widest: 0.1em;

  /* Altura de linha */
  --adapta-line-none: 1;
  --adapta-line-tight: 1.25;
  --adapta-line-snug: 1.375;
  --adapta-line-normal: 1.5;
  --adapta-line-relaxed: 1.625;
  --adapta-line-loose: 2;
}
```

### 2️⃣ IMPORTAR NO APP

No ficheiro `/src/app/App.tsx`, adiciona este import no topo:

```typescript
import '../styles/adapta-tokens.css';
```

### 3️⃣ APLICAR NA APLICAÇÃO

**Opção A — Substituir cores hardcoded:**

Procura por cores hexadecimais (`#`) e substitui por variáveis CSS:

```tsx
// ❌ ANTES
<div style={{ backgroundColor: '#F7F9F8' }}>

// ✅ DEPOIS  
<div style={{ backgroundColor: 'var(--adapta-luz-hempCanvas)' }}>
```

**Opção B — Aplicar tokens semânticos (recomendado):**

Define tokens semânticos no teu CSS:

```css
:root {
  /* Brand */
  --color-primary: var(--adapta-ventura-bruma);
  --color-secondary: var(--adapta-alma-emeraldHaze);
  --color-ink: var(--adapta-alma-deepPine);
  
  /* Backgrounds */
  --bg-page: var(--adapta-luz-hempCanvas);
  --bg-card: #FFFFFF;
  --bg-hover: var(--adapta-luz-sageWhisper);
  
  /* Text */
  --text-primary: var(--adapta-alma-deepPine);
  --text-secondary: var(--adapta-alma-greenSmoke);
  --text-muted: var(--adapta-alma-emeraldHaze);
  
  /* Borders */
  --border-default: var(--adapta-luz-leafFrost);
  --border-subtle: var(--adapta-luz-sageWhisper);
}
```

### 4️⃣ PALETA COMPLETA

**TIER CORE (Verde Institucional):**
- `ventura` — 5 tons (nevoaclara, fumaca, bruma, veu, sombra)
- `candy` — 5 tons
- `lemon` — 5 tons

**TIER NEUTRALS:**
- `luz` — 5 tons (claro)
- `alma` — 5 tons (médio)
- `firmeza` — 5 tons (escuro)

**TIER PALETTE (Personalidade):**
- `energia` — 5 tons (amarelo) ⚠️ **NUNCA misturar com verde!**
- `alegria` — 5 tons (rosa)
- `seguranca` — 5 tons (lavanda)

### 5️⃣ REGRAS CRÍTICAS DA MARCA ADAPTA

❌ **PROIBIDO:**
- Verde + Amarelo juntos (só na Copa!)
- Gradientes com cores complementares
- Usar Tier Palette como cores primárias de UI

✅ **OBRIGATÓRIO:**
- Gradientes sempre macios e aveludados
- Verde Ventura como cor principal
- Verificar contraste WCAG em texto

### 6️⃣ EXEMPLOS PRÁTICOS

**Card com design Adapta:**
```tsx
<div style={{
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '1rem',
  border: '2px solid var(--adapta-luz-leafFrost)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
}}>
  <h2 style={{
    fontFamily: 'var(--adapta-font-heading)',
    fontSize: 'var(--adapta-size-2xl)',
    fontWeight: 'var(--adapta-weight-bold)',
    color: 'var(--adapta-alma-deepPine)',
    marginBottom: '1rem'
  }}>
    Título
  </h2>
  <p style={{
    fontFamily: 'var(--adapta-font-body)',
    fontSize: 'var(--adapta-size-base)',
    color: 'var(--adapta-alma-greenSmoke)',
    lineHeight: 'var(--adapta-line-relaxed)'
  }}>
    Texto do corpo
  </p>
</div>
```

**Botão primário:**
```tsx
<button style={{
  backgroundColor: 'var(--adapta-ventura-bruma)',
  color: 'var(--adapta-alma-deepPine)',
  fontFamily: 'var(--adapta-font-heading)',
  fontSize: 'var(--adapta-size-base)',
  fontWeight: 'var(--adapta-weight-semibold)',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}}>
  Ação Principal
</button>
```

### 7️⃣ ATALHO RÁPIDO — Classes Utility (opcional)

Cria classes de utilidade no CSS:

```css
/* Texto */
.text-primary { color: var(--adapta-alma-deepPine); }
.text-secondary { color: var(--adapta-alma-greenSmoke); }
.text-muted { color: var(--adapta-alma-emeraldHaze); }

/* Backgrounds */
.bg-primary { background-color: var(--adapta-ventura-bruma); }
.bg-page { background-color: var(--adapta-luz-hempCanvas); }
.bg-card { background-color: white; }

/* Borders */
.border-default { border-color: var(--adapta-luz-leafFrost); }
.rounded-adapta { border-radius: 1rem; }

/* Typography */
.font-heading { font-family: var(--adapta-font-heading); }
.font-body { font-family: var(--adapta-font-body); }
```

---

## 📊 RESUMO DOS TOKENS

**Total de cores:** 45 cores  
**Total de espectros:** 9 espectros  
**Fontes:** 10 famílias tipográficas

**Pronto para usar!** 🚀
