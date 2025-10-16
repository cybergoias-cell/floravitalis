// index.js — backend limpo e funcional p/ floravitalis
// Executar com: node index.js  (ou npm start)
// Requisitos: produtos.json na raiz (cria automático se não existir)

const express = require('express');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const PRODUTOS_PATH = path.join(__dirname, 'produtos.json');

// ---------- Middlewares base (ordem importa) ----------
app.use(cors()); // CORS real habilitado
app.use(express.json({ limit: '2mb' })); // parser de JSON com limite

// ---------- Utils de arquivo (leitura/escrita atômica) ----------
async function ensureFile(filePath, initial = '[]') {
  try {
    await fsp.access(filePath, fs.constants.F_OK);
  } catch {
    await fsp.writeFile(filePath, initial, 'utf8');
  }
}

async function readProdutos() {
  await ensureFile(PRODUTOS_PATH, '[]');
  const data = await fsp.readFile(PRODUTOS_PATH, 'utf8');
  try {
    const parsed = JSON.parse(data || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    // Se o JSON estiver corrompido, faz backup e recomeça
    const backup = `${PRODUTOS_PATH}.${Date.now()}.bak`;
    await fsp.writeFile(backup, data, 'utf8');
    await fsp.writeFile(PRODUTOS_PATH, '[]', 'utf8');
    return [];
  }
}

// simples “mutex” em memória p/ evitar escrita concorrente
let writing = Promise.resolve();
function writeProdutosAtomic(produtos) {
  const json = JSON.stringify(produtos, null, 2);
  writing = writing.then(async () => {
    const tmpPath = `${PRODUTOS_PATH}.tmp`;
    await fsp.writeFile(tmpPath, json, 'utf8');
    await fsp.rename(tmpPath, PRODUTOS_PATH);
  }).catch(() => { /* suprime erro no encadeamento */ });
  return writing;
}

// ---------- Validações ----------
function validateProduto(body, isUpdate = false) {
  const errors = [];
  const { nome, preco, estoque, sku } = body || {};
  if (!isUpdate || nome !== undefined) {
    if (typeof nome !== 'string' || !nome.trim()) errors.push('nome é obrigatório (string).');
  }
  if (!isUpdate || preco !== undefined) {
    const p = Number(preco);
    if (!Number.isFinite(p) || p < 0) errors.push('preco deve ser número >= 0.');
  }
  if (!isUpdate || estoque !== undefined) {
    const e = Number(estoque);
    if (!Number.isInteger(e) || e < 0) errors.push('estoque deve ser inteiro >= 0.');
  }
  if (!isUpdate || sku !== undefined) {
    if (sku !== undefined && (typeof sku !== 'string' || !sku.trim())) {
      errors.push('sku, se informado, deve ser string não vazia.');
    }
  }
  return errors;
}

// ---------- Rotas Produtos (vitrine baseada em array no produtos.json) ----------
app.get('/api/produtos', async (_req, res) => {
  try {
    const produtos = await readProdutos();
    res.json(produtos);
  } catch {
    res.status(500).json({ error: 'Falha ao ler produtos.' });
  }
});

app.post('/api/produtos', async (req, res) => {
  try {
    const errors = validateProduto(req.body, false);
    if (errors.length) return res.status(400).json({ errors });

    const { nome, preco, estoque, sku } = req.body;
    const produtos = await readProdutos();

    // SKU único (se informado)
    if (sku && produtos.some(p => (p.sku || '').toLowerCase() === sku.toLowerCase())) {
      return res.status(409).json({ error: 'SKU já existe.' });
    }

    // Gera ID simples
    const id = produtos.length ? Math.max(...produtos.map(p => Number(p.id) || 0)) + 1 : 1;

    const novo = {
      id,
      nome: String(nome).trim(),
      preco: Number(preco),
      estoque: Number(estoque),
      sku: sku ? String(sku).trim() : undefined,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      ativo: true
    };

    produtos.push(novo);
    await writeProdutosAtomic(produtos);
    res.status(201).json(novo);
  } catch {
    res.status(500).json({ error: 'Falha ao adicionar produto.' });
  }
});

app.put('/api/produtos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });

    const errors = validateProduto(req.body, true);
    if (errors.length) return res.status(400).json({ errors });

    const produtos = await readProdutos();
    const i = produtos.findIndex(p => Number(p.id) === id);
    if (i === -1) return res.status(404).json({ error: 'Produto não encontrado.' });

    const current = produtos[i];
    const next = { ...current, ...req.body, id, atualizadoEm: new Date().toISOString() };

    // SKU único (se alterou)
    if (next.sku) {
      const conflito = produtos.find(p => (p.sku || '').toLowerCase() === next.sku.toLowerCase() && Number(p.id) !== id);
      if (conflito) return res.status(409).json({ error: 'SKU já existe.' });
    }

    produtos[i] = next;
    await writeProdutosAtomic(produtos);
    res.json(next);
  } catch {
    res.status(500).json({ error: 'Falha ao atualizar produto.' });
  }
});

app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'ID inválido.' });

    const produtos = await readProdutos();
    const i = produtos.findIndex(p => Number(p.id) === id);
    if (i === -1) return res.status(404).json({ error: 'Produto não encontrado.' });

    const [removido] = produtos.splice(i, 1);
    await writeProdutosAtomic(produtos);
    res.json({ ok: true, removido });
  } catch {
    res.status(500).json({ error: 'Falha ao remover produto.' });
  }
});

// healthcheck simples
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// ---------- Rota ADMIN modular (mapa por ID/SKU no produtos.json) ----------
const produtosRouter = require('./routes/produtos');
app.use('/api/produtos-admin', produtosRouter); // CRUD de produtos no produtos.json

app.listen(PORT, () => {
  console.log(`API floravitalis ouvindo em http://localhost:${PORT}`);
});
