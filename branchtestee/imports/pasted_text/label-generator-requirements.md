1️⃣ O que ainda falta para reproduzir o rótulo fielmente
1. Grid e proporções fixas

Hoje o sistema parece tratar tudo como elementos soltos.

O rótulo real tem um grid rígido:

Estrutura:

┌───────────────────────────────┐
│  HEADER (logo)                │
├───────────────────────────────┤
│  FAIXA VERDE (nome do produto)│
│                               │
│  SUBTEXTO                     │
│                               │
│  PESO                         │
├───────────────────────┬───────┤
│                       │       │
│      ÁREA PRINCIPAL   │ CARD  │
│                       │INFO   │
│                       │       │
└───────────────────────┴───────┘

O gerador precisa ter zonas fixas.

Hoje parece que ele só joga texto em cima.

2. Escala tipográfica correta

No rótulo real:

Hierarquia clara:

1️⃣ Nome do produto
Flores in natura

2️⃣ subtítulo
Ricas em CBD 0:1

3️⃣ informações secundárias
ingredientes / instruções

4️⃣ peso

No preview da ferramenta:

o título está menor do que deveria

o peso está mal posicionado

a hierarquia tipográfica não está respeitada

Ou seja, falta token de tipografia por função.

3. Alinhamento vertical do peso

No rótulo real:

peso fica centralizado horizontalmente
e alinhado ao rodapé

Hoje ele aparece flutuando.

Precisa virar posição fixa do layout.

4. Card lateral é um componente próprio

Esse bloco branco NÃO é texto simples.

Ele é um componente com:

padding interno

borda arredondada fixa

QR code centralizado

hierarquia de texto

Hoje parece que o sistema só joga texto dentro.

Precisa virar:

component: infoCard

com estrutura fixa.

5. Controle de cores por categoria

Vocês já começaram isso com:

CBD

THC

Híbrida

Mas o sistema ainda precisa controlar:

faixa central
cor do subtítulo
possivelmente cor de ícones

Não só um fundo.

6. Margens reais de impressão

O rótulo real tem respiro nas bordas.

Hoje o preview parece comprimido.

Precisa existir:

safe margin
bleed margin

especialmente porque é exportação para impressão.

7. Dimensão real do canvas

O sistema mostra:

302 × 189 px

Mas o rótulo real é para impressão.

Precisa trabalhar com:

mm ou dpi

não só pixel.

2️⃣ Prompt que você pode mandar pro dev / Cursor

Vou escrever no formato ideal para dev.

PROMPT

Implementar melhorias no Gerador de Rótulos de Flores para reproduzir fielmente o layout oficial da Adapta.

Atualmente o sistema já carrega:

logotipo SVG

fundo padronizado em listras

tipografia Montserrat

alguns componentes visuais

Porém ainda faltam regras estruturais de layout.

1. Implementar grid fixo do rótulo

O layout deve seguir uma estrutura fixa dividida em 3 zonas principais:

HEADER
área superior com logotipo centralizado.

FAIXA PRINCIPAL
faixa horizontal verde que contém:

nome do produto

subtítulo

CORPO
área inferior dividida em duas colunas:

coluna esquerda
conteúdo principal do produto

coluna direita
card informativo com ingredientes e QR code.

Essa estrutura não deve depender da quantidade de texto.

2. Criar hierarquia tipográfica fixa

Definir estilos tipográficos para cada tipo de informação:

productTitle
ex: Flores in natura

productSubtitle
ex: Ricas em CBD 0:1

weightLabel
ex: 2,5 g

infoText
ingredientes e instruções

Esses estilos devem ter tamanhos fixos e não depender do conteúdo inserido.

3. Posicionamento fixo do peso

O peso do produto deve:

ficar centralizado horizontalmente

alinhado ao rodapé da área principal

ter espaçamento consistente da borda inferior

Ele não deve depender do fluxo de texto.

4. Transformar o card lateral em componente

O card branco lateral deve ser um componente estruturado contendo:

título
ingredientes

texto informativo

seção "Siga-nos"

QR code

rodapé institucional

Esse componente deve ter:

padding interno fixo

bordas arredondadas padronizadas

largura fixa dentro do layout

5. Sistema de cores por categoria

As categorias de produto devem controlar automaticamente a cor da faixa central:

CBD
verde

THC
vermelho/rosa

Híbrida
amarelo/dourado

Essas cores devem ser aplicadas via tokens e não via código hardcoded.

6. Área segura de impressão

Adicionar:

bleed area
safe margin

para garantir que a exportação do rótulo funcione corretamente para impressão.

7. Canvas baseado em dimensão real

O canvas do rótulo deve trabalhar com:

mm ou dpi

em vez de apenas pixels.

3️⃣ Uma melhoria MUITO importante que você ainda não pediu

Isso aqui seria ouro para vocês:

Bloqueio de layout

Hoje o editor parece permitir mover coisas.

Para embalagem isso é perigoso.

O ideal seria:

layout locked
apenas conteúdo editável

Assim ninguém destrói o rótulo sem querer.