// src/data/repositories/EstatalRepository.js

import { db } from '../db.js';

export class EstatalRepository {
  static findAll() {
    return db.find('estatais');
  }
  
  static findById(id) {
    return db.findOne('estatais', { id });
  }
  
  static findBySetor(setor) {
    return db.find('estatais', { setor });
  }
  
  static getEstataisLucrativas() {
    return db.find('estatais', { lucroAnual: { $gte: 10000 } });
  }
  
  static getEstataisDeficitarias() {
    return db.find('estatais', { lucroAnual: { $lt: 0 } });
  }
  
  static atualizarEficiencia(id, novaEficiencia) {
    return db.update('estatais', id, { eficiencia: novaEficiencia });
  }
}