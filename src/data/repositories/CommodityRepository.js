// src/data/repositories/CommodityRepository.js

import { db } from '../db.js';

export class CommodityRepository {
  static findAll() {
    return db.find('commodities');
  }
  
  static findById(id) {
    return db.findOne('commodities', { id });
  }
  
  static atualizarPreco(id, novoPreco) {
    return db.update('commodities', id, { preco: novoPreco });
  }
  
  static simularVariacao() {
    const commodities = db.find('commodities');
    return commodities.map(commodity => {
      const variacao = (Math.random() * 2 - 1) * commodity.volatilidade;
      const novoPreco = Math.max(1, commodity.preco + variacao);
      
      return {
        ...commodity,
        preco: parseFloat(novoPreco.toFixed(2))
      };
    });
  }
}