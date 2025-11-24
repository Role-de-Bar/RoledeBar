const path = require('path');
require('dotenv').config();

let PgPrisma = null;
let SqlitePrisma = null;

try {
  PgPrisma = require(path.join(__dirname, '..', 'generated', 'postgres-client')).PrismaClient;
} catch (e) {
  try { PgPrisma = require('@prisma/client').PrismaClient; } catch { PgPrisma = null; }
}

try {
  SqlitePrisma = require(path.join(__dirname, '..', 'generated', 'sqlite-client')).PrismaClient;
} catch (e) {
  SqlitePrisma = null;
}

const pg = PgPrisma ? new PgPrisma() : null;
const sqlite = SqlitePrisma ? new SqlitePrisma() : null;

let pgConnected = false;
let sqliteConnected = false;

async function connectAll() {
  // tenta conectar sqlite primeiro (prioridade)
  if (sqlite) {
    try {
      await sqlite.$connect();
      sqliteConnected = true;
      console.log('SQLite conectado');
    } catch (err) {
      sqliteConnected = false;
      console.warn('Não foi possível conectar ao SQLite:', err.message || err);
    }
  } else {
    console.warn('Cliente SQLite não encontrado (generated/sqlite-client)');
  }

  // só tenta Postgres se não puxarmos SKIP_POSTGRES=1
  if (process.env.SKIP_POSTGRES !== '1') {
    if (pg) {
      try {
        await pg.$connect();
        pgConnected = true;
        console.log('Postgres conectado');
      } catch (err) {
        pgConnected = false;
        console.warn('Não foi possível conectar ao Postgres:', err.message || err);
      }
    } else {
      console.warn('Cliente Postgres não encontrado (generated/postgres-client ou @prisma/client)');
    }
  } else {
    console.log('SKIP_POSTGRES=1 — pulando conexão com Postgres');
  }
}

async function disconnectAll() {
  try {
    if (pg && pgConnected) await pg.$disconnect();
    if (sqlite && sqliteConnected) await sqlite.$disconnect();
  } catch (err) {
    console.error('Erro ao desconectar DBs:', err.message || err);
  }
}

function isPgConnected() { return pgConnected; }
function isSqliteConnected() { return sqliteConnected; }

module.exports = {
  pg,
  sqlite,
  connectAll,
  disconnectAll,
  isPgConnected,
  isSqliteConnected,
};