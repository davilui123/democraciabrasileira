// src/data/repositories/MinisterioRepository.js

import { db } from '../db.js';

export class MinisterioRepository {
  static findAll() {
    return db.find('ministerios');
  }
  
  static findById(id) {
    return db.findOne('ministerios', { id });
  }
  
  static findByPasta(pasta) {
    return db.find('ministerios', { pasta });
  }
  
  static findByPrioridade(prioridade) {
    return db.find('ministerios', { prioridadePadrao: prioridade });
  }
  
  static updatePrioridade(id, prioridade) {
    return db.update('ministerios', id, { prioridadePadrao: prioridade });
  }
  
  static getCargosIniciais() {
    return db.find('ministerios').map(ministerio => ({
      id: ministerio.id,
      nome: ministerio.nome,
      pasta: ministerio.pasta,
      vago: true,
      prioridade: ministerio.prioridadePadrao || 'media',
      status: 'normal',
      salario: ministerio.salarioBase || 500,
      demandaAtual: null,
      problemas: [],
      conselhoAtual: null,
      candidatosEspecificos: db.find('ministros', { 
        ministerioBase: ministerio.id,
        disponivel: true 
      })
    }));
  }
}