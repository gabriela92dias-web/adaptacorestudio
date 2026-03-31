---
name: Mockup Perfeito com IA (Sem Alucinação de Brand)
description: Protocolo obrigatório para criar mockups fotográficos de altíssima qualidade. O agente gera apenas cenários e superfícies premium 100% lisas (Blank Canvas), transferindo a aplicação dos vetores fiéis para ferramentas de UI/Design estruturado (Photoshop/Figma), garantindo zero distorção nas formas da marca.
---

# SKILL: Mockup Perfeito com IA (Método Híbrido 70/30)

## GATILHO
Esta skill é ativada quando a Gabriela usar:
- `@mockup`
- `>mockup`
- "cria um mockup de [item]"
- "faz um mockup pra mim"

---

## O PROBLEMA QUE ESTA SKILL RESOLVE (A Regra Soberana)
Modelos de geração de imagem (Difusão) não compreendem matemática vetorial. Se solicitados a desenhar um logotipo por prompt, eles irão "alucinar": inverter letras, derreter curvas e adicionar olhos e formas inexistentes aos mascotes.
Para proteger a regra `AESTHETIC_RULES.md`, o Antigravity **NUNCA DEVE TENTAR GERAR O MASCOTE OU A TYPOGRAFIA DA ADAPTA DIRETAMENTE NA FOTO**.

O Padrão da Indústria (Workflow Híbrido 70/30):
- **70% IA:** Gera a fotografia do ambiente, a iluminação dramática, o desfoque de fundo e o objeto (cartão, pin, tecido, tela) 100% em branco e texturizado.
- **30% Humano/Design:** O humano aplica o arquivo SVG/PNG original inalterado por cima do "Blank Canvas" usando Smart Objects ou Multiply Blend Mode.

---

## SOLUÇÃO 100% AUTOMATIZADA PARA SERIGRAFIA (A RECOMENDADA)
Para aplicações ultrarrealistas em **tecido e serigrafia** respeitando a textura, a Gabriela e o Antigravity descobriram o seguinte padrão auto-suficiente:
- A IA gera o Blank Canvas e converte a imagem base em código numérico protegido (Base64).
- O agente injeta a logo oficial 100% em código (SVG Inline) num HTML invisível, aplica sobreposições em CSS (como `mix-blend-mode: multiply` que faz a costura transparecer perfeitamente) e forja um link `dom-to-image` que aciona automaticamente o download no Google Chrome da Gabriela.
Isso burla o CORS e a necessidade de rodar bibliotecas C++. Sempre priorize criar um **Motor HTML Auto-Executável** que entregue o resultado fotográfico PNG para a usuária sem ela abrir editores se solicitado "terceirização total".

---

## ETAPA 1 — ENGENHARIA DO PROMPT MOCKUP BASE (BLANK CANVAS)

Quando o usuário pedir um mockup de um objeto, você deve montar um prompt em inglês de Fotografia Comercial Fotorrealista que produza um ambiente impecável, mas com a área de estampa **TOTALMENTE LIMPA**.

**Palavras-chave OBRIGATÓRIAS no Prompt:**
- `completely blank, absolute blank surface, zero text, zero logos, no patterns`
- `solid [color] [object] ready for graphic placement`
- `flat clean area, smooth texture`

**Palavras-chave de Cinematografia (Para realismo):**
- `photorealistic candid lifestyle portrait` ou `commercial product macro photography`
- `85mm lens, shallow depth of field, creamy bokeh background`
- `dramatic studio rim lighting, softbox reflections, high-end, 8k resolution`

Exemplo de Prompt Perfeito:
> "A highly aesthetic commercial macro photography shot of a solid blank white coffee mug resting on a minimalist oak wood table. CRITICAL: The surface of the mug MUST be perfectly blank, crisp white, featuring absolutely zero text, zero logos, and zero patterns. Clean flat template space for graphic designers. Warm morning sunlight casting long shadows, creamy bokeh background, 8k, photorealistic."

---

## ETAPA 2 — GERAÇÃO E SALVAMENTO

1. Use a ferramenta `generate_image` com o prompt desenhado na Etapa 1.
2. Nomeie o arquivo com o sufixo `_BASE_em_branco` (ex: `mockup_caneca_BASE_em_branco`).
3. Verifique visualmente (se possível) ou assuma a responsabilidade de que instruiu a máquina a não desenhar logos.

---

## ETAPA 3 — DEVOLUTIVA E INSTRUÇÃO TÉCNICA AO USUÁRIO

Ao entregar a imagem gerada para a Gabriela, **não basta apenas enviar a imagem**. Você deve entregar as coordenadas exatas de como ela fará a colagem (Composite) de forma profissional para parecer realista.

Use o seguinte esqueleto para a resposta:

```text
📸 **Blank Canvas Gerado com Sucesso!**
Enviei o arquivo `[nome_do_arquivo.png]` para a sua pasta.

A IA cuidou dos 70% (Fotografia, luzes, profundidade de campo e tecidos). A superfície está 100% lisa, sem alucinações de marca, aguardando os 30% do Design.

**🛠️ Como aplicar os seus SVGs reais por cima (Composição de Elite):**
1. Abra esse mockup base no **Photoshop** (ou Figma).
2. Cole o seu SVG nativo da pasta `arsenal_materiais`.
3. **[Se for tecido/papel branco]:** Mude o Blend Mode da camada do SVG para **Multiply** (Multiplicação). Isso fará a tinta do logo abraçar as micro-sombras e a textura do material.
4. **[Se for impressão metálica brilhante]:** Aplique um Drop Shadow rígido (distância 1px, spread 100%) branco/dourado e mude o Blend Mode para **Linear Burn** ou **Soft Light**.
5. **Dica Pro (Blend If):** No Photoshop, dê 2 cliques na camada do logo e arraste ligeiramente os sliders de "Underlying Layer (Camada Subjacente)" com o ALT pressionado para fazer as luzes de fundo "vazarem" por cima da sua marca.
```

## CHECKLIST DA SKILL
- [ ] Entendeu que *não deve tentar* forçar a IA a desenhar o logotipo ou mascote nativo
- [ ] Criou o prompt exigindo 'Blank, zero text' fortemente
- [ ] Aplicou os inputs de fotografia profissional (85mm, lighting)
- [ ] Gerou a imagem
- [ ] Entregou o minitutorial de Blend Modes (Multiply, Overlay) para a Gabriela
