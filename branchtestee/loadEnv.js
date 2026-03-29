import fs from 'fs'
      
try {
  if (fs.existsSync('env.json')) {
    const envConfig = JSON.parse(fs.readFileSync('env.json', 'utf8'));
    Object.keys(envConfig).forEach(key => {
      process.env[key] = process.env[key] || envConfig[key];
    });
  }
} catch(e) {
  console.log("No env.json found or invalid, using environment variables");
}