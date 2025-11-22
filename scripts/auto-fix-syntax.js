#!/usr/bin/env node

/**
 * Script de Auto-Correção de Erros de Sintaxe TypeScript
 * Detecta e corrige automaticamente erros comuns de build
 */

const fs = require('fs');
const path = require('path');

// Padrões de erros comuns e suas correções
const errorPatterns = [
  {
    name: 'Duplicação de export',
    pattern: /export\s+export\s+export/g,
    fix: 'export',
    description: 'Remove duplicações da palavra-chave export'
  },
  {
    name: 'Duplicação dupla de export',
    pattern: /export\s+export/g,
    fix: 'export',
    description: 'Remove duplicações duplas da palavra-chave export'
  },
  {
    name: 'Import duplicado',
    pattern: /import\s+import/g,
    fix: 'import',
    description: 'Remove duplicações da palavra-chave import'
  },
  {
    name: 'Const duplicado',
    pattern: /const\s+const/g,
    fix: 'const',
    description: 'Remove duplicações da palavra-chave const'
  },
  {
    name: 'Let duplicado',
    pattern: /let\s+let/g,
    fix: 'let',
    description: 'Remove duplicações da palavra-chave let'
  },
  {
    name: 'Function duplicado',
    pattern: /function\s+function/g,
    fix: 'function',
    description: 'Remove duplicações da palavra-chave function'
  },
  {
    name: 'Type duplicado',
    pattern: /type\s+type/g,
    fix: 'type',
    description: 'Remove duplicações da palavra-chave type'
  },
  {
    name: 'Interface duplicado',
    pattern: /interface\s+interface/g,
    fix: 'interface',
    description: 'Remove duplicações da palavra-chave interface'
  }
];

// Função para escanear e corrigir arquivo
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let fixed = false;
    const fixes = [];

    errorPatterns.forEach(pattern => {
      const matches = content.match(pattern.pattern);
      if (matches && matches.length > 0) {
        content = content.replace(pattern.pattern, pattern.fix);
        fixed = true;
        fixes.push(`  ✓ ${pattern.description} (${matches.length} ocorrências)`);
      }
    });

    if (fixed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`\n✅ Corrigido: ${filePath}`);
      fixes.forEach(fix => console.log(fix));
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    return false;
  }
}

// Função para escanear diretório recursivamente
function scanDirectory(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Ignorar node_modules e .next
        if (item !== 'node_modules' && item !== '.next' && item !== 'dist') {
          scan(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    });
  }
  
  scan(dir);
  return files;
}

// Execução principal
function main() {
  console.log('🔧 Auto-Fix de Sintaxe TypeScript\n');
  console.log('Escaneando arquivos...\n');

  const projectRoot = process.cwd();
  const srcDir = path.join(projectRoot, 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.log('❌ Diretório src/ não encontrado');
    process.exit(1);
  }

  const files = scanDirectory(srcDir);
  console.log(`📁 ${files.length} arquivos encontrados\n`);

  let fixedCount = 0;
  files.forEach(file => {
    if (fixFile(file)) {
      fixedCount++;
    }
  });

  console.log('\n' + '='.repeat(50));
  if (fixedCount > 0) {
    console.log(`\n✅ ${fixedCount} arquivo(s) corrigido(s) com sucesso!`);
    console.log('\n💡 Execute "npm run build" para verificar se os erros foram resolvidos.');
  } else {
    console.log('\n✨ Nenhum erro de sintaxe detectado!');
  }
  console.log('\n' + '='.repeat(50) + '\n');
}

main();
