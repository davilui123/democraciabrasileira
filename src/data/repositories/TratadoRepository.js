// src/data/repositories/TratadoRepository.js

import { db } from '../db.js';

export class TratadoRepository {
  static getCatalogo() {
    return db.find('tratados');
  }
  
  static getPorPais(paisId) {
    const tratado = db.findOne('tratados', { paisId });
    if (!tratado) {
      return db.findOne('tratados', { id: 'default' });
    }
    return tratado;
  }
  
  static getTratadosAtivos() {
    return db.find('tratados', { ativo: true });
  }
  
  static gerarTratadoParaPais(paisId, dataAtual) {
    const tratadoBase = this.getPorPais(paisId);
    if (!tratadoBase) return null;
    
    return {
      id: `tratado_${paisId}_${Date.now()}`,
      paisId,
      dataAssinatura: dataAtual,
      dataExpiracao: new Date(dataAtual.getFullYear() + tratadoBase.duracao, dataAtual.getMonth(), dataAtual.getDate()),
      ativo: true,
      ...tratadoBase
    };
  }
}