const fs = require('fs');
const txt = fs.readFileSync('C:/Users/gabri/Desktop/cores/arquivocor310226.svg', 'utf-8');
const matches = txt.match(/#[a-fA-F0-9]{6}/g) || [];
console.log(Array.from(new Set(matches)));
