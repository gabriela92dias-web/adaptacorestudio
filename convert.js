import fs from 'fs';

const input = fs.readFileSync('db-fixed.sql', 'utf8');
const lines = input.split('\n');
const output = [];

let copyTable = null;
let copyColumns = null;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  // Match COPY public.tablename (col1, col2) FROM stdin;
  const copyMatch = line.match(/^COPY\s+(.+?)\s+\((.+?)\)\s+FROM\s+stdin;/i);
  if (copyMatch) {
    copyTable = copyMatch[1];
    copyColumns = copyMatch[2];
    continue;
  }

  if (copyTable) {
    if (line.trim() === '\\.') {
      copyTable = null;
      copyColumns = null;
      continue;
    }

    if (line.trim() === '') continue;

    const values = line.split('\t').map(val => {
      // Remove trailing CR exactly
      val = val.replace(/\r$/, '');
      if (val === '\\N') return 'NULL';
      const escapedVal = val.replace(/'/g, "''").replace(/\\"/g, '"');
      return `'${escapedVal}'`;
    });

    output.push(`INSERT INTO ${copyTable} (${copyColumns}) VALUES (${values.join(', ')});`);
  } else {
    // Comentar comandos restritos
    if (line.startsWith('\\unrestrict')) {
      line = '-- ' + line;
    }
    if (line.startsWith('\\restrict')) {
      line = '-- ' + line;
    }

    // Injetar DROP TABLE IF EXISTS antes de CREATE TABLE
    const tableMatch = line.match(/^CREATE TABLE (public\.\w+)/i);
    if (tableMatch) {
      output.push(`DROP TABLE IF EXISTS ${tableMatch[1]} CASCADE;`);
    }

    // Injetar DROP TYPE IF EXISTS antes de CREATE TYPE
    const typeMatch = line.match(/^CREATE TYPE (public\.\w+) AS ENUM/i);
    if (typeMatch) {
      output.push(`DROP TYPE IF EXISTS ${typeMatch[1]} CASCADE;`);
    }
    
    // Injetar DROP SEQUENCE IF EXISTS para evitar erros com sequencias tbm
    const seqMatch = line.match(/^CREATE SEQUENCE (public\.\w+)/i);
    if (seqMatch) {
      output.push(`DROP SEQUENCE IF EXISTS ${seqMatch[1]} CASCADE;`);
    }

    output.push(line);
  }
}

fs.writeFileSync('db-inserts.sql', output.join('\n'));
console.log('Concluído com DROP statements de segurança!');
