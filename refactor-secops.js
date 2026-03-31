import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.join(__dirname, 'endpoints/coreact');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const functionToReplace = `function toCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function camelizeKeys(obj: any): any {
  if (Array.isArray(obj)) return obj.map(camelizeKeys);
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [toCamel(k), camelizeKeys(v)]));
  }
  return obj;
}`;

walkDir(targetDir, (filePath) => {
  if (filePath.endsWith('_GET.ts') || filePath.endsWith('_POST.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    if (content.includes('function toCamel(str: string)')) {
      content = content.replace(functionToReplace, '');
      
      const depth = filePath.replace(targetDir, '').split(path.sep).length;
      let importPath = "";
      if (depth === 2) importPath = "../../helpers/dataUtils.js";
      else if (depth === 3) importPath = "../../../helpers/dataUtils.js";
      else if (depth === 4) importPath = "../../../../helpers/dataUtils.js";
      else importPath = "../../../helpers/dataUtils.js";

      if (!content.includes('dataUtils.js')) {
        content = content.replace("import superjson from 'superjson';", `import superjson from 'superjson';\nimport { camelizeKeys } from "${importPath}";`);
      }
      changed = true;
    }

    const badCatchRegex = /\} catch \(error: unknown\) \{\s*const msg = error instanceof Error \? error\.message : "Unknown error";\s*return new Response\(superjson\.stringify\(\{ error: msg \}\), \{ status: 400 \}\);\s*\}/g;
    if (badCatchRegex.test(content)) {
      content = content.replace(badCatchRegex, `} catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }`);
      changed = true;
    }

    const badCatchRegex2 = /\} catch \(error: unknown\) \{\s*return new Response\(superjson\.stringify\(\{ error: error instanceof Error \? error\.message : "Unknown error" \}\), \{ status: 400 \}\);\s*\}/g;
     if (badCatchRegex2.test(content)) {
      content = content.replace(badCatchRegex2, `} catch (error: unknown) {
    console.error("Internal Server Error in coreact:", error);
    return new Response(
      superjson.stringify({ error: "Ocorreu um erro interno ao processar a requisição." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }`);
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Refactored: ', filePath);
    }
  }
});
console.log('Refactoring complete.');
