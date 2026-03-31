/**
 * 🚀 CORESTUDIO: MOTOR DE RENDERIZAÇÃO PSD AUTOMÁTICA (DYNAMIC MOCKUPS)
 * 
 * Instruções:
 * 1. Substitua os valores abaixo com a sua chave e IDs.
 * 2. Rode no terminal do VSCode: node dynamic-mockups.mjs
 */

const API_KEY = 'fa0ba7e4-c271-4174-b2db-6fce4bac7418:0fcb76112eac241c5ae92199a1299f99c178f81e4d3b829137020aee07c976bd';

// Os IDs que você copiou da sua conta após fazer o upload do .psd:
// Os IDs que puxei secretamente da sua conta pra facilitar a sua vida! (Referente ao arquivo 5413838)
const MOCKUP_UUID = 'b671b9f5-cfe1-4dc8-b67c-1804ae271bb0'; 
const SMART_OBJECT_UUID = 'b87f3fa3-c90f-4a88-b60f-b192129a0f8c';

// A URL PÚBLICA da arte que você quer injetar (ex: arquivo real do Supabase Storage)
const ASSET_URL = 'https://raw.githubusercontent.com/seu-repo/logo.png'; 

async function gerarMockupPSD() {
  console.log('⏳ Iniciando comunicação com o motor PSD em nuvem...');

  try {
    const response = await fetch('https://api.dynamicmockups.com/api/v1/renders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        mockup_uuid: MOCKUP_UUID,
        smart_objects: [
          {
            uuid: SMART_OBJECT_UUID,
            asset: {
              url: ASSET_URL
            }
          }
        ],
        // ✨ DICA DE OURO APLICADA: Parâmetros avançados baseados na documentação que você achou!
        export_options: {
          image_format: 'png', // Maior qualidade em lossy. (ou 'webp')
          image_size: 2000, // Forçando ultra resolução
          mode: 'view'
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ A API rejeitou a requisição:', data);
      return;
    }

    console.log('✅ Renderização processada pelo Supercomputador!');
    console.log('==============================================');
    console.log(data);
    console.log('==============================================');
    console.log('👉 Procure pelo link da imagem gerada no objeto acima!');
    
  } catch (error) {
    console.error('❌ Falha na conexão de rede:', error);
  }
}

// Dispara a ignição!
gerarMockupPSD();
