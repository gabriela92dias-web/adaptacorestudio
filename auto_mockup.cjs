const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const baseImgPath = 'C:/Users/gabri/.gemini/antigravity/brain/c1c017e7-32e5-461e-a7c0-562465a04ac1/mockup_bone_branco_base_1774923650830.png';
const logoPath = 'C:/Users/gabri/.gemini/antigravity/playground/CORESTUDIO_plataforma-ativa-fullstack_react-ts-node-supabase_ATIVO-RENDER_2026-03/arsenal_materiais/adapta-nuvem.svg';
const desktopPath = path.join(process.env.USERPROFILE, 'Desktop', 'MOCKUPS_ADAPTA_SALVOS');
const outputPath = path.join(desktopPath, 'BONE_NUVEM_VERDINHA_OFICIAL.png');

async function run() {
  try {
    if (!fs.existsSync(desktopPath)) fs.mkdirSync(desktopPath, { recursive: true });

    const baseImg = sharp(baseImgPath);
    const baseMetaData = await baseImg.metadata();
    
    let svgContent = fs.readFileSync(logoPath, 'utf8');
    svgContent = svgContent.replace(/#F1E6F0/gi, '#0b9e59');
    
    const logoWidth = Math.floor(baseMetaData.width * 0.25);
    const top = Math.floor(baseMetaData.height * 0.35);
    const left = Math.floor((baseMetaData.width - logoWidth) / 2);

    const logoBuffer = await sharp(Buffer.from(svgContent))
      .resize(logoWidth)
      .toBuffer();

    await baseImg
      .composite([
        { input: logoBuffer, top: top, left: left, blend: 'multiply' }
      ])
      .toFile(outputPath);

    console.log('SUCCESS');
  } catch (err) {
    console.error('ERROR:', err);
  }
}
run();
