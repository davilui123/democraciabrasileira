// src/data/seed/init.js

// Importar todos os seeds
import { ministeriosSeed } from './ministerios.js';
import { ministrosSeed } from './ministros.js';
import { problemasSeed } from './problemas.js';
import { paisesSeed } from './paises.js';
import { blocosSeed } from './blocos.js';
import { tratadosSeed } from './tratados.js';
import { cartasDiplomaticasSeed } from './cartasDiplomaticas.js';
import { leisSeed } from './leis.js';
import { estataisSeed } from './estatais.js';
import { commoditiesSeed } from './commodities.js';
import { stfSeed } from './stf.js';

// Função principal para popular o banco de dados
export const seedDatabase = async (db) => {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Verificar se o db tem as tabelas necessárias
    const tabelas = [
      'ministerios', 'ministros', 'problemas', 'paises',
      'blocos', 'tratados', 'cartasDiplomaticas', 'leis',
      'estatais', 'commodities', 'stf'
    ];

    for (const tabela of tabelas) {
      if (!db[tabela]) {
        console.error(`❌ Tabela ${tabela} não encontrada no banco de dados`);
        return false;
      }
    }

    // Limpar tabelas existentes (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Limpando tabelas existentes...');
      await Promise.all(tabelas.map(tabela => db[tabela].clear()));
    }

    // Inserir dados
    console.log('📝 Inserindo dados...');
    
    const resultados = await Promise.allSettled([
      db.ministerios.bulkAdd(ministeriosSeed),
      db.ministros.bulkAdd(ministrosSeed),
      db.problemas.bulkAdd(problemasSeed),
      db.paises.bulkAdd(paisesSeed),
      db.blocos.bulkAdd(blocosSeed),
      db.tratados.bulkAdd(tratadosSeed),
      db.cartasDiplomaticas.bulkAdd(cartasDiplomaticasSeed),
      db.leis.bulkAdd(leisSeed),
      db.estatais.bulkAdd(estataisSeed),
      db.commodities.bulkAdd(commoditiesSeed),
      db.stf.bulkAdd(stfSeed)
    ]);

    // Verificar resultados
    let sucessos = 0;
    let falhas = 0;
    
    resultados.forEach((result, index) => {
      const nomeTabela = tabelas[index] || `Tabela ${index}`;
      if (result.status === 'fulfilled') {
        console.log(`✅ ${nomeTabela}: ${result.value?.length || 'OK'}`);
        sucessos++;
      } else {
        console.error(`❌ ${nomeTabela}: ${result.reason?.message || 'Erro desconhecido'}`);
        falhas++;
      }
    });

    console.log(`📊 Resumo: ${sucessos} sucessos, ${falhas} falhas`);

    if (falhas > 0) {
      console.error('⚠️ Seed completado com falhas. Alguns dados podem não ter sido inseridos.');
      return false;
    }

    console.log('✅ Seed concluído com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    return false;
  }
};

// Função para verificar se o seed é necessário
export const verificarSeedNecessario = async (db) => {
  try {
    // Verificar se alguma tabela está vazia
    const tabelas = ['ministerios', 'paises', 'cartasDiplomaticas', 'leis'];
    const contagens = await Promise.all(
      tabelas.map(tabela => db[tabela].count())
    );

    const vazias = contagens.filter(count => count === 0).length;
    return vazias > 0;
  } catch (error) {
    console.error('Erro ao verificar seed:', error);
    return true; // Se houver erro, assume que precisa de seed
  }
};

// Função para seed parcial (por tabela)
export const seedTabela = async (db, tabela, dados) => {
  try {
    await db[tabela].clear();
    await db[tabela].bulkAdd(dados);
    console.log(`✅ Tabela ${tabela} semeada com ${dados.length} registros`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao semear tabela ${tabela}:`, error);
    return false;
  }
};

// Funções individuais por tabela
export const seedMinisterios = (db) => seedTabela(db, 'ministerios', ministeriosSeed);
export const seedMinistros = (db) => seedTabela(db, 'ministros', ministrosSeed);
export const seedProblemas = (db) => seedTabela(db, 'problemas', problemasSeed);
export const seedPaises = (db) => seedTabela(db, 'paises', paisesSeed);
export const seedBlocos = (db) => seedTabela(db, 'blocos', blocosSeed);
export const seedTratados = (db) => seedTabela(db, 'tratados', tratadosSeed);
export const seedCartasDiplomaticas = (db) => seedTabela(db, 'cartasDiplomaticas', cartasDiplomaticasSeed);
export const seedLeis = (db) => seedTabela(db, 'leis', leisSeed);
export const seedEstatais = (db) => seedTabela(db, 'estatais', estataisSeed);
export const seedCommodities = (db) => seedTabela(db, 'commodities', commoditiesSeed);
export const seedSTF = (db) => seedTabela(db, 'stf', stfSeed);

// Exportar todos os seeds
export {
  ministeriosSeed,
  ministrosSeed,
  problemasSeed,
  paisesSeed,
  blocosSeed,
  tratadosSeed,
  cartasDiplomaticasSeed,
  leisSeed,
  estataisSeed,
  commoditiesSeed,
  stfSeed
};

// Exportar um objeto com todas as funções de seed
export const seeds = {
  ministerios: ministeriosSeed,
  ministros: ministrosSeed,
  problemas: problemasSeed,
  paises: paisesSeed,
  blocos: blocosSeed,
  tratados: tratadosSeed,
  cartasDiplomaticas: cartasDiplomaticasSeed,
  leis: leisSeed,
  estatais: estataisSeed,
  commodities: commoditiesSeed,
  stf: stfSeed,
  
  // Funções
  seedAll: seedDatabase,
  seedMinisterios,
  seedMinistros,
  seedProblemas,
  seedPaises,
  seedBlocos,
  seedTratados,
  seedCartasDiplomaticas,
  seedLeis,
  seedEstatais,
  seedCommodities,
  seedSTF,
  verificarSeedNecessario
};

// Export default para compatibilidade
export default {
  seedDatabase,
  verificarSeedNecessario,
  seeds,
  ministeriosSeed,
  ministrosSeed,
  problemasSeed,
  paisesSeed,
  blocosSeed,
  tratadosSeed,
  cartasDiplomaticasSeed,
  leisSeed,
  estataisSeed,
  commoditiesSeed,
  stfSeed
};