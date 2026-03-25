🎨 CONSELHOS TÉCNICOS: Resolver Flickering no GIF (Paleta Global)

1. COLETAR TODAS AS CORES PRIMEIRO
// ❌ Frame-by-frame com paleta local
frames.forEach(imageData => {
  const palette = quantize(imageData, 256);
  addFrame(imageData, palette); // Cada frame = paleta diferente
});

// ✅ Paleta global unificada
const allColors = [];
frames.forEach(imageData => {
  allColors.push(...extractColors(imageData));
});
const globalPalette = quantize(allColors, 256); // UMA paleta pra todos
2. USAR DITHERING CONSISTENTE
// Floyd-Steinberg dithering com MESMA paleta
frames.forEach(imageData => {
  const dithered = applyDithering(imageData, globalPalette);
  addFrame(dithered, globalPalette); // Mesma paleta = sem flickering
});
3. REDUZIR CORES ANTES DA QUANTIZAÇÃO
// Pré-processar SVG pra ter menos cores
- Simplificar gradientes (steps em vez de smooth)
- Reduzir intensidade do feTurbulence
- Usar paleta limitada no design original
4. TESTAR FORMATOS DE COR ALTERNATIVOS
// gifenc suporta:
- 'rgb444' (4096 cores)      // Menos precisão, menos flickering
- 'rgb565' (65536 cores)     // Mais cores, pode melhorar
- 'rgba4444' (4096 + alpha)  // Com transparência
5. AUMENTAR CORES DISPONÍVEIS (se possível)
// GIF = max 256 cores por frame
// Mas você tem 140-150 cores diferentes...
// Solução: Simplificar o design OU usar mais frames com transições suaves
6. DEBUGAR A QUANTIZAÇÃO
// Ver QUANTAS cores únicas cada frame tem
frames.forEach((imageData, i) => {
  const uniqueColors = new Set();
  for (let j = 0; j < imageData.data.length; j += 4) {
    const color = `${imageData.data[j]},${imageData.data[j+1]},${imageData.data[j+2]}`;
    uniqueColors.add(color);
  }
  console.log(`Frame ${i}: ${uniqueColors.size} cores únicas`);
});
🎯 ESTRATÉGIA RECOMENDADA:

Fase 1 - Diagnóstico:

1. Logar quantas cores únicas cada frame tem
2. Ver se há frames com >256 cores (forçando quantização)
3. Identificar quais elementos causam mais variação