import fs from 'fs';

async function uploadFile() {
  const filePath = 'C:/Users/gabri/.gemini/antigravity/brain/c1c017e7-32e5-461e-a7c0-562465a04ac1/mascote_sticker_1774845672471.png';
  
  if (!fs.existsSync(filePath)) {
    console.log('❌ ARQUIVO NÃO ENCONTRADO: ' + filePath);
    return;
  }

  const fileData = fs.readFileSync(filePath);
  const blob = new Blob([fileData], { type: 'image/png' });
  
  const formData = new FormData();
  formData.append('reqtype', 'fileupload');
  formData.append('fileToUpload', blob, 'mascote.png');

  try {
    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });
    
    const url = await res.text();
    console.log('✅ UPLOAD CONCLUÍDO:', url);
  } catch (err) {
    console.error('❌ ERRO NO UPLOAD:', err);
  }
}

uploadFile();
