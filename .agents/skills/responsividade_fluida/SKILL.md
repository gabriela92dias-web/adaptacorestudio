---
name: Responsividade Fluida & Ultrawide (@responsividade_fluida)
description: Técnicas modernas de CSS resgatadas de fóruns e práticas da comunidade ("trincheiras") para suportar desde celulares estreitos até monitores Ultrawide de 34 polegadas. Focado no conforto da leitura e uso de Clamp / CSS Grid.
---

# 🌊 SKILL: Responsividade Fluida & Ultrawide

## 🧠 CONTEXTO E O PROBLEMA DOS MONITORES 34"
Em telas Ultrawide, o principal erro é deixar o `width: 100%` agir livremente. Isso faz os textos esticarem infinitamente, exigindo que o usuário vire o pescoço para ler ("efeito partida de tênis") e os botões sumirem nos cantos da tela. No celular, o problema inverso oprime o layout.

Esta skill reúne as práticas "roubadas" de fóruns modernos e vídeos de especialistas (CSS moderno de 2024/2026) para blindar totalmente o layout contra telas mastodônticas e telas minúsculas sem precisar de dezoito `@media queries`.

## 📐 REGRAS DE OURO (IMPLEMENTAÇÃO)

### 1. O "Cercadinho" (Content Containment)
Nunca deixe a raiz fluir infinitamente. 
Bloqueie o conteúdo principal em um container seguro. Em Ultrawides, é normal sobrar muito espaço negativo nas laterais — e isso é **chic e confortável**.
```css
.main-layout {
  width: 100%;
  max-width: 1440px; /* ou 1600px - o "Cercadinho" */
  margin: 0 auto;    /* Centraliza na tela de 34" */
  padding: clamp(1rem, 5vw, 3rem); /* Afasta da borda suavemente */
}
```

### 2. Conforto de Leitura (Line Length)
Textos de bloco grande (parágrafos longos, bulas, documentação) jamis devem ultrapassar a casa ideal de caracteres.
```css
.article-text, p {
  max-width: 65ch; /* Limita a 65 ou 70 caracteres máximo por linha! */
  margin-inline: auto; /* Centraliza o bloco de texto, se necessário */
}
```

### 3. Fluidez Absoluta com `clamp()`
Aposente as cascatas de Media Customizadas para tamanhos de fonte e margens. Deixe a matemática do browser calcular a proporção.
```css
/* font-size: clamp(MIN, PREFERENCIAL (fluid), MAX) */
h1 {
  font-size: clamp(2rem, 1.5rem + 2.5vw, 4rem); 
  /* No mobile trava em 2rem. No Ultrawide trava em 4rem. No meio, é fluido! */
}

/* Gaps de Grids Fluidos */
.grid-container {
  gap: clamp(1rem, 2vw, 2.5rem);
}
```

### 4. Layouts Auto-Mágicos (Grid + auto-fit)
Para listar cards, dashboards, widgets, etc. Esqueça `@media`. O Grid faz sozinho:
```css
.card-grid {
  display: grid;
  /* Se tiver espaço na tela, põe lado a lado. Se acabar o espaço (mobile), cai pra baixo */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

### 5. Imagens Blindadas
Imagens esticando desproporcionalmente quebram interfaces.
```css
img, video {
  max-width: 100%;
  height: auto;
  object-fit: cover; /* Salva o mundo em banners ultrawide */
}
```

## 🛠️ QUANDO INVOCAR ESTA SKILL
Sempre que estiver criando um módulo novo, um Dashboard ou uma Landing Page dentro da plataforma e precisar definir os Wrappers (Containers principais). Quando a Gabriela disser:
- "Arruma a responsividade pra mim."
- "No meu monitor grande tá ficando bizarro."
- "Deixa confortável pra ler no celular."

**CITE:** `Estou usando as técnicas da skill @responsividade_fluida...`
