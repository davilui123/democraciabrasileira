// src/data/db.js

export const database = {
  // Coleções principais
  ministerios: [],
  ministros: [],
  problemasEstruturais: [],
  paises: [],
  blocos: [],
  tratados: [],
  cartasDiplomaticas: [],
  leis: [],
  estatais: [],
  commodities: [],
  stf: [],
  
  // Coleções de jogo (estado)
  jogos: [],
  saves: [],
  
  // Configurações
  config: {}
};

// Métodos auxiliares CRUD
export const db = {
  insert: (collection, data) => {
    if (!database[collection]) {
      database[collection] = [];
    }
    database[collection].push(data);
    return data;
  },
  
  find: (collection, query = {}) => {
    const items = database[collection] || [];
    return items.filter(item => 
      Object.keys(query).every(key => {
        // Para consultas especiais
        if (key.startsWith('$')) {
          const operator = key;
          const value = query[key];
          
          switch(operator) {
            case '$in':
              return value.includes(item.id);
            case '$nin':
              return !value.includes(item.id);
            case '$gt':
              return item[key.slice(2)] > value;
            case '$lt':
              return item[key.slice(2)] < value;
            case '$gte':
              return item[key.slice(3)] >= value;
            case '$lte':
              return item[key.slice(3)] <= value;
            default:
              return true;
          }
        }
        
        // Para arrays (verifica se inclui)
        if (Array.isArray(item[key])) {
          const queryValues = Array.isArray(query[key]) ? query[key] : [query[key]];
          return queryValues.every(val => item[key].includes(val));
        }
        
        // Para objetos aninhados
        if (typeof query[key] === 'object' && !Array.isArray(query[key])) {
          return Object.keys(query[key]).every(subKey => 
            item[key] && item[key][subKey] === query[key][subKey]
          );
        }
        
        // Comparação simples
        return item[key] === query[key];
      })
    );
  },
  
  findOne: (collection, query) => {
    const items = database[collection] || [];
    return items.find(item => 
      Object.keys(query).every(key => {
        if (Array.isArray(item[key])) {
          const queryValues = Array.isArray(query[key]) ? query[key] : [query[key]];
          return queryValues.every(val => item[key].includes(val));
        }
        return item[key] === query[key];
      })
    );
  },
  
  update: (collection, id, updates) => {
    const index = database[collection].findIndex(item => item.id === id);
    if (index !== -1) {
      database[collection][index] = { ...database[collection][index], ...updates };
      return database[collection][index];
    }
    return null;
  },
  
  delete: (collection, id) => {
    const index = database[collection].findIndex(item => item.id === id);
    if (index !== -1) {
      return database[collection].splice(index, 1)[0];
    }
    return null;
  },
  
  count: (collection, query = {}) => {
    return db.find(collection, query).length;
  },
  
  // Métodos de utilidade
  clearCollection: (collection) => {
    database[collection] = [];
  },
  
  getStats: () => {
    return Object.keys(database).reduce((stats, collection) => {
      if (Array.isArray(database[collection])) {
        stats[collection] = database[collection].length;
      }
      return stats;
    }, {});
  }
};