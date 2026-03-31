---
description: Como terceirizar e automatizar 100% a criação de Mockups fotorrealistas sem intervenção no Photoshop
---

// turbo-all

# MOCKUP 100% AUTOMATIZADO (SEM HUMAN-IN-THE-LOOP)

A Gabriela determinou que a colagem manual de SVGs no Photoshop ou Figma toma tempo desnecessário. A diretriz de Arte agora é: **Terceirização Total da Operação Mockup**. Esta rotina instrui o Agente Antigravity a forjar a imagem fotográfica real E aplicar matematicamente o logo, entregando o arquivo PNG final 100% impecável na Área de Trabalho.

## FLUXO DE EXECUÇÃO OBRIGATÓRIO PARA O AGENTE:

Sempre que a Gabriela pedir para aplicar esse workflow (ex: "roda o workflow do mockup automático pra uma sacola de papel"), o Agente deve seguir cegamente os 4 passos abaixo:

### Passo 1: Instalar o Operário de Imagens (Sharp)
O Agente precisa processar pixels sem alucinar vetores. Use o terminal do VSCode para garantir que a biblioteca `sharp` (padrão-ouro da indústria C++) está instalada no repositório temporariamente para fundir imagens.
Comando a ser disparado (use `run_command` na raiz do CoreStudio):
`npm install sharp --no-save`

### Passo 2: Geração do Fundo (Fotografia Blank Canvas)
Use a tool `generate_image` construindo um mega-prompt fotográfico para o objeto pedido, forçando-o a ser branco puro, iluminado como de estúdio e **TOTALMENTE LISO (sem logo algum)** para o estêncil colar bem.
*(Exemplo: Se ela quer uma caneca: "Photorealistic solid soft-white coffee mug on an oak desk, completely blank surface, creamy bokeh, 8k...")*
- Salve essa imagem base. Ex: `mockup_base_temporario.png`.

### Passo 3: Criação do Motor de Fusão Matemática (Script Node.js)
Usando `write_to_file`, crie um arquivo chamado `auto_mockup.js` na raiz do Workspace. Esse script deve fazer o seguinte código Sharp:

\`\`\`javascript
const sharp = require('sharp');
const path = require('path');

// Caminhos calculados dinamicamente via código do agente
const basePath = path.join(__dirname, 'mockup_base_temporario.png');
// O Agente vai varrer a 'arsenal_materiais' e descobrir a logo correta. Ex:
const logoPath = path.join(__dirname, 'arsenal_materiais', 'adapta-logo tema escuro.png'); 

async function run() {
  const baseImg = sharp(basePath);
  const metadata = await baseImg.metadata();
  
  // Como os logos podem variar, reduza/aumente o logotipo na escala correta da foto via código:
  const resizedLogo = await sharp(logoPath)
    .resize({ width: Math.floor(metadata.width * 0.4) }) // 40% da imagem base
    .toBuffer();

  await baseImg.composite([
    { 
      input: resizedLogo,
      gravity: 'center',       // Ou manipule 'top', 'left' de acordo com a cena
      blend: 'multiply'        // Efeito mágico: a tinta do logo absorve toda sombra, tecido e brilho do objeto fotográfico!
    }
  ])
  .toFile(path.join(process.env.USERPROFILE, 'Desktop', 'MOCKUPS_ADAPTA_SALVOS', 'MOCKUP_FINAL_RENDERIZADO.png'));
  
  console.log('Fusão Completa com ZERO alucinação geométrica!');
}

run();
\`\`\`

### Passo 4: Executar o Motor e Limpar a Sujeira
No terminal via `run_command`:
1. Rode: `node auto_mockup.js`
2. Certifique-se de que a execução terminou (aguarde o retorno).
3. Entregue um resumo do trabalho à Diretora de Arte avisando que o arquivo finalizado (*MOCKUP_FINAL_RENDERIZADO.png*) já está renderizado, mesclado (via *Multiply*), impecável e aguardando na Área de Trabalho dela.
