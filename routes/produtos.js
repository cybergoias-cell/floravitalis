// routes/produtos.js
const express = require('express');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const router = express.Router();
const PRODUTOS_PATH = path.join(process.cwd(), 'produtos.json');

// ---------- Utilidades de arquivo ----------
async function ensureFile(filePath, initial = '{}') {
  try { await fsp.access(filePath, fs.constants.F_OK); }
  catch { await fsp.writeFile(filePath, initial, 'utf8'); }
}

async function readProdutosObj() {
  await ensureFile(PRODUTOS_PATH, '{}');
  const data = await fsp.readFile(PRODUTOS_PATH, 'utf8');
  try {
    const parsed = JSON.parse(data || '{}');
    return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
  } catch {
    const backup = `${PRODUTOS_PATH}.${Date.now()}.bak`;
    await fsp.writeFile(backup, data, 'utf8');
    await fsp.writeFile(PRODUTOS_PATH, '{}', 'utf8');
    return {};
  }
}

// “fila” simples para evitar corrida de escrita
let writing = Promise.resolve();
function writeProdutosAtomic(obj) {
  const json = JSON.stringify(obj, null, 2);
  writing = writing.then(async () => {
    const tmp = `${PRODUTOS_PATH}.tmp`;
    await fsp.writeFile(tmp, json, 'utf8');
    await fsp.rename(tmp, PRODUTOS_PATH);
  }).catch(() => {});
  return writing;
}

// ---------- Validações ----------
function validateProduto(body, isUpdate = false) {
  const errors = [];
  const { name, price, stock, weight, sku } = body || {};

  if (!isUpdate || name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) errors.push('name é obrigatório (string).');
  }
  if (!isUpdate || price !== undefined) {
    const p = Number(price);
    if (!Number.isFinite(p) || p < 0) errors.push('price deve ser número >= 0.');
  }
  if (!isUpdate || stock !== undefined) {
    const s = Number(stock);
    if (!Number.isInteger(s) || s < 0) errors.push('stock deve ser inteiro >= 0.');
  }
  if (!isUpdate || weight !== undefined) {
    const w = Number(weight);
    if (!Number.isFinite(w) || w < 0) errors.push('weight deve ser número >= 0.');
  }
  if (!isUpdate || sku !== undefined) {
    if (sku !== undefined && (typeof sku !== 'string' || !sku.trim())) {
      errors.push('sku, se informado, deve ser string não vazia.');
    }
  }
  return errors;
}

// ---------- CRUD ADMIN DE PRODUTOS ----------
// Observação: este CRUD trabalha no arquivo produtos.json (mapa por ID/SKU)
// e não interfere nos “produtosLoja” (array de vitrine).

// Listar todos (mapa -> array)
router.get('/', async (_req, res) => {
  try {
    const obj = await readProdutosObj();
    const lista = Object.entries(obj).map(([id, p]) => ({ id, ...p }));
    res.json({ success: true, total: lista.length, produtos: lista });
  } catch {
    res.status(500).json({ error: 'Falha ao ler produtos.' });
  }
});

// Criar produto
router.post('/', async (req, res) => {
  try {
    const errors = validateProduto(req.body, false);
    if (errors.length) return res.status(400).json({ errors });

    const { name, price, stock, weight, sku } = req.body;
    const obj = await readProdutosObj();

    // ID = sku se enviado; senão gera um
    const id = (sku && sku.trim()) || `PROD${Date.now()}`;

    if (obj[id]) return res.status(409).json({ error: 'Já existe produto com este ID/SKU.' });

    obj[id] = {
      nome: name.trim(),
      peso: Number(weight) || 0,
      estoque: Number(stock) || 0,
      price: Number(price)
    };

    await writeProdutosAtomic(obj);
    res.status(201).json({ success: true, id, produto: { id, ...obj[id] } });
  } catch {
    res.status(500).json({ error: 'Falha ao criar produto.' });
  }
});

// Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const errors = validateProduto(req.body, true);
    if (errors.length) return res.status(400).json({ errors });

    const obj = await readProdutosObj();
    if (!obj[id]) return res.status(404).json({ error: 'Produto não encontrado.' });

    const upd = { ...obj[id] };

    if (req.body.name !== undefined)   upd.nome   = String(req.body.name).trim();
    if (req.body.stock !== undefined)  upd.estoque = Number(req.body.stock);
    if (req.body.weight !== undefined) upd.peso    = Number(req.body.weight);
    if (req.body.price !== undefined)  upd.price   = Number(req.body.price);

    obj[id] = upd;
    await writeProdutosAtomic(obj);
    res.json({ success: true, produto: { id, ...upd } });
  } catch {
    res.status(500).json({ error: 'Falha ao atualizar produto.' });
  }
});

// Deletar produto
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const obj = await readProdutosObj();
    if (!obj[id]) return res.status(404).json({ error: 'Produto não encontrado.' });

    const removido = { id, ...obj[id] };
    delete obj[id];
    await writeProdutosAtomic(obj);
    res.json({ success: true, removido });
  } catch {
    res.status(500).json({ error: 'Falha ao remover produto.' });
  }
});

module.exports = router;
