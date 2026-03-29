# Regra Soberana: Estética Monocromática (Adapta Clean)

Contexto: O ecossistema Adapta CoreStudio possui um Design System restrito focado no Minimalismo de Alto Contraste (Clean UI, Monocromático, predominância de Light Mode clássico com contornos muito sutis). 

**ESTA REGRA DEVE SER SEGUIDA CEGAMENTE EM CADA ARQUIVO CSS E TSX MODIFICADO A PARTIR DE AGORA.**

## 🚫 IMPEDIMENTOS ABSOLUTOS DE CORES NOVAS:
Quando for desenvolver uma nova interface, compor um gerador de marketing, ou replicar mockups de referência:
- É ESTRITAMENTE PROIBIDO inserir cores hexadecimais diretas nos arquivos `.css` ou inline contexts que criem novos tons de fundos vibrantes, degrade, laranja, roxo neon, dark neon, ou similares. 
- É ESTRITAMENTE PROIBIDO hardcodar painéis coloridos ou botões neon, mesmo que a imagem de referência fornecida use dezenas de cores extravagantes.

## ✅ AÇÃO OBRIGATÓRIA (Design System Pattern):
1. Use APENAS as **Variáveis CSS Nativas** do container original do CoreStudio:
   - Fundo dos painéis e cards: `var(--bg-primary)` e `var(--bg-secondary)`.
   - Textos: `var(--text-primary)`, `var(--text-secondary)`, e `var(--text-tertiary)`.
   - Bordas para separar seções: `border: 1px solid var(--border);`
   - Sombras leves e limpas para elevação: `box-shadow: var(--shadow-sm);` ou `var(--shadow-md)`.
2. O layout a ser desenvolvido deve se concentrar puramente na ergonomia e na estruturação visual através de paddings harmônicos (`gap`, `padding`), fontes elegantes e contraste cru entre branco, cinza e preto.
3. Se um estado de erro, alerta ou progresso precisar de cor (Ex: Vermelho ou Verde), não use "Glows", use flags sólidos simples em áreas minúsculas e controladas.
