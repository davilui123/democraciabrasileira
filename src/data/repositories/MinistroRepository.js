// src/data/repositories/MinistroRepository.js

import { db } from '../db.js';

export class MinistroRepository {
  static findAll() {
    return db.find('ministros');
  }
  
  static findById(id) {
    return db.findOne('ministros', { id });
  }
  
  static findByMinisterio(ministerioId) {
    return db.find('ministros', { ministerioBase: ministerioId, disponivel: true });
  }
  
  static findByPerfil(perfil) {
    return db.find('ministros', { perfil });
  }
  
  static createCandidatosEspecificos(ministerioId) {
    // Fase 4.2R: não existem mais candidatos genéricos gerados por perfil.
    // Toda nomeação vem do elenco ficcional persistente do jogo.
    return db.find('ministros', { ministerioBase: ministerioId, disponivel: true });
  }
  
  static marcarComoIndisponivel(id) {
    return db.update('ministros', id, { disponivel: false });
  }
}