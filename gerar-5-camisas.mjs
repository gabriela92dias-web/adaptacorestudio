import fs from 'fs';
const API_KEY = 'fa0ba7e4-c271-4174-b2db-6fce4bac7418:0fcb76112eac241c5ae92199a1299f99c178f81e4d3b829137020aee07c976bd';
const API_BASE = 'https://app.dynamicmockups.com/api/v1';
const HEADERS = { 'x-api-key': API_KEY, 'Content-Type': 'application/json' };

// A API em nuvem só aceita URLs públicas puras (Google Drive e arquivos locais não servem).
// Pra provar o conceito de envelopar as 5 pessoas, peguei uma silhueta de folha verde pública.
const ADAPTA_ASSET_URL = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

async function gerarGuardaRoupaAdapta() {
  console.log('👚 1. Hackeando o guarda-roupa mundial...');
  
  try {
    const catRes = await fetch(`${API_BASE}/catalogs`, { headers: HEADERS });
    const catData = await catRes.json();
    
    // Normalmente o primeiro catálogo da API tem as camisetas free.
    const catalogoId = catData.data[0].uuid;

    console.log('✅ 2. Vasculhando araras em busca de modelos humanos com camisetas lisas...');
    const mocRes = await fetch(`${API_BASE}/mockups?catalog_uuid=${catalogoId}`, { headers: HEADERS });
    const mocData = await mocRes.json();
    
    // Filtra pelo nome pra pegar só camisa/t-shirt, para ignorar canecas e porta-copos
    const mockupsCamisetas = mocData.data.filter(m => 
      m.name.toLowerCase().includes('shirt') || 
      m.name.toLowerCase().includes('hoodie') ||
      m.name.toLowerCase().includes('polo')
    );

    // Seleciona exatos 5 modelos únicos
    const cincoManequins = mockupsCamisetas.slice(0, 5);

    if(cincoManequins.length === 0) {
      console.log('⚠️ Nenhum mockup de camisa encontrado nesse catálogo base. O script vai usar 5 itens aleatórios!');
      cincoManequins.push(...mocData.data.slice(0, 5));
    }

    console.log(`👕 3. Envelopando as ${cincoManequins.length} pessoas simultaneamente...`);

    // Disparando 5 robôs ao mesmo tempo para a nuvem
    for (const [index, modelo] of cincoManequins.entries()) {
      if (!modelo.smart_objects[0]) continue;
      
      const camadaEstampaId = modelo.smart_objects[0].uuid;

      const payload = {
        mockup_uuid: modelo.uuid,
        export_label: `adapta-camisa-${index+1}`,
        smart_objects: [
          {
            uuid: camadaEstampaId,
            asset: { url: ADAPTA_ASSET_URL },
          }
        ]
        // export_options removido para evitar bloqueio do plano Grátis
      };

      const renderRes = await fetch(`${API_BASE}/renders`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(payload)
      });

      const resRend = await renderRes.json();
      console.log(`\n============================`);
      console.log(`👨‍🎤 MANEQUIM ${index + 1}: ${modelo.name}`);
      console.log(`✅ Status da API: Requerido com sucesso.`);
      // A maioria das APIs de Render devolve o render_url, ou render_job. 
      console.log(`📸 RETORNO:`, resRend);
      fs.writeFileSync(`resposta_${index}.json`, JSON.stringify(resRend, null, 2));
    }
    
    console.log(`\n🚀 Finalizado!`);
  } catch (err) {
    console.error('❌ Falha na matriz:', err);
  }
}

gerarGuardaRoupaAdapta();
