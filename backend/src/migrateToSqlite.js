const { pg, sqlite, connectAll, disconnectAll } = require('./configDB');

function getModels(client) {
  return Object.keys(client).filter(k => {
    try {
      return typeof client[k].findMany === 'function';
    } catch {
      return false;
    }
  });
}

async function copyModel(modelName) {
  console.log(`Copiando ${modelName}...`);
  const rows = await pg[modelName].findMany();
  if (!rows || rows.length === 0) {
    console.log(`Nenhum registro em ${modelName}`);
    return;
  }

  const payload = rows.map(({ id, ...rest }) => rest);

  try {
    await sqlite[modelName].createMany({ data: payload });
    console.log(`Inseridos ${payload.length} registros em ${modelName} (createMany).`);
  } catch (err) {
    console.warn(`createMany falhou em ${modelName}, inserindo um-a-um:`, err.message);
    for (const item of payload) {
      try {
        await sqlite[modelName].create({ data: item });
      } catch (e) {
        console.error(`Falha ao inserir em ${modelName}:`, e.message);
      }
    }
  }
}

(async () => {
  try {
    if (!pg) throw new Error('Prisma Postgres client (pg) não encontrado. Gere o client e verifique paths.');
    if (!sqlite) throw new Error('Prisma Sqlite client (sqlite) não encontrado. Gere o client e verifique paths.');

    await connectAll();
    console.log('Conectados aos DBs');

    const models = getModels(pg);
    console.log('Modelos detectados no Postgres:', models);
    for (const m of models) {
      await copyModel(m);
    }

    console.log('Migração concluída');
  } catch (err) {
    console.error('Erro na migração:', err.message || err);
  } finally {
    await disconnectAll();
  }
})();