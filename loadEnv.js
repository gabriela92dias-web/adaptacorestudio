import fs from 'fs'

try {
  // Load env.json if it exists 
  if (fs.existsSync('env.json')) {
    const envConfig = JSON.parse(fs.readFileSync('env.json', 'utf8'));
    Object.keys(envConfig).forEach(key => {
      process.env[key] = process.env[key] || envConfig[key];
    });
  }

  // Load .env if it exists
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        value = value.replace(/(^['"]|['"]$)/g, '').trim();
        process.env[key] = process.env[key] || value;
      }
    });
  }
} catch(e) {
  console.log("Error loading env variables:", e.message);
}