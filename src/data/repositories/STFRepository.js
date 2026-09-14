// src/data/repositories/STFRepository.js

import { db } from '../db.js';

export class STFRepository {
  static findAll() {
    return db.find('stf');
  }
  
  static findById(id) {
    return db.findOne('stf', { id });
  }
  
  static findByPerfil(perfil) {
    return db.find('stf', { perfil });
  }
  
  static getMinistrosPorRigor(minRigor) {
    return db.find('stf', { rigor: { $gte: minRigor } });
  }
}