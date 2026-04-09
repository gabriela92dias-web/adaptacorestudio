import fs from 'fs'
import path from 'path'

// 1. Lê o arquivo .env padrão (suportado em todos os ambientes: Codespaces, Render, local)
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.substring(0, eqIdx).trim();
          const value = trimmed.substring(eqIdx + 1).trim();
          process.env[key] = process.env[key] || value;
        }
      }
    });
    console.log('[loadEnv] .env carregado com sucesso.');
  }
} catch(e) {
  console.log('[loadEnv] Nenhum .env encontrado, usando variáveis de ambiente do sistema.');
}

// 2. Fallback: env.json (legado — usado no Render antigo)
try {
  if (fs.existsSync('env.json')) {
    const envConfig = JSON.parse(fs.readFileSync('env.json', 'utf8'));
    Object.keys(envConfig).forEach(key => {
      process.env[key] = process.env[key] || envConfig[key];
    });
    console.log('[loadEnv] env.json carregado como fallback.');
  }
} catch(e) {
  console.log('[loadEnv] Nenhum env.json encontrado ou inválido.');
}