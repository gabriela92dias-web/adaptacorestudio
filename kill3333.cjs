const { execSync } = require('child_process');

try {
  // on Windows
  const output = execSync('netstat -ano | findstr :3333').toString();
  const lines = output.trim().split('\n');
  if (lines.length > 0) {
    const parts = lines[0].trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && pid !== '0') {
      console.log('Killing PID ' + pid);
      execSync('taskkill /F /PID ' + pid);
    }
  }
} catch (e) {
  console.log('No process on port 3333 found or error killing it.');
}
