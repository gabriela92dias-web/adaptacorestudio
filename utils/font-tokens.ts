/**
 * ═══════════════════════════════════════════════════════════════
 * ADAPTA PLATFORM - Font Tokens (ADAPTA Design System v2026.1)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Sistema tipográfico ADAPTA unificado - 10 famílias especializadas
 * Integra com CSS custom properties de /src/styles/adapta-tokens.css
 */

export const fonts = {
  // 🎨 Fonte para displays e hero titles (peso médio/bold)
  display: "MuseoModerno, Montserrat, ui-sans-serif, system-ui, sans-serif",
  
  // 📰 Fonte para títulos e headings (peso médio/bold)
  heading: "Montserrat, ui-sans-serif, system-ui, sans-serif",
  
  // 📝 Fonte para textos corporais e parágrafos
  body: "Glacial Indifference, Raleway, ui-sans-serif, system-ui, sans-serif",
  
  // 📖 Fonte editorial para conteúdo long-form
  editorial: "Cormorant Garamond, ui-serif, Georgia, serif",
  
  // ⚡ Fonte energética/chamativa (all caps)
  energetic: "All Caps, Montserrat, sans-serif",
  
  // 🌿 Fonte warm/acolhedora (cursive)
  warm: "Cause, cursive",
  
  // 💪 Fonte bold/impactante
  bold: "SUSE, sans-serif",
  
  // 🗺️ Fonte regional/local
  regional: "Ofissina, sans-serif",
  
  // ✍️ Fonte assinatura/manuscrita
  signature: "Mayonice, cursive",
  
  // 🎨 Fonte artesanal/craft
  crafted: "Fomo, sans-serif",
  
  // 💻 Fonte monoespaçada para códigos e dados técnicos
  mono: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace"
} as const;

export type FontKey = keyof typeof fonts;