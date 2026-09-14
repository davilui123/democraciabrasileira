// src/data/repositories/LeiRepository.js

import { db } from '../db.js';
import { leisMetadata } from '../seed/leis.js';

export class LeiRepository {
  static findAll() {
    return db.find('leis');
  }
  
  static findById(id) {
    return db.findOne('leis', { id });
  }
  
  static findByCategoria(categoria) {
    return db.find('leis', { categoria });
  }
  
  static findByCustoPolitico(min, max) {
    return db.find('leis', { 
      custoPolitico: { $gte: min, $lte: max }
    });
  }
  
  static getLeisPrioritarias() {
    return db.find('leis', { custoPolitico: { $gte: 50 } });
  }
  
  static getLeisPopulares() {
    return db.find('leis', lei => 
      (lei.efeitos.popularidade > 0) || 
      (lei.efeitos.popularidade && lei.efeitos.popularidade > 5)
    );
  }
  
  static getLeisControversas() {
    return db.find('leis', { custoPolitico: { $gte: 60 } });
  }
  
  static getLeisPorComplexidade(complexidade) {
    return db.find('leis', { complexidade });
  }
  
  static getLeisRapidas() {
    return db.find('leis', { tempoTramitacao: { $lte: 4 } });
  }
  
  static getLeisPorGrupoApoio(grupo) {
    return db.find('leis', lei => lei.apoio.includes(grupo));
  }
  
  static getLeisPorGrupoOposicao(grupo) {
    return db.find('leis', lei => lei.oposicao.includes(grupo));
  }
  
  static getLeisComEfeito(effetKey) {
    return db.find('leis', lei => lei.efeitos && lei.efeitos[effetKey] !== undefined);
  }
  
  static getMetadata() {
    return leisMetadata;
  }
  
  static calcularTempoTramitacao(custoPolitico, complexidade) {
    const baseTempo = {
      'baixa': 3,
      'media': 6,
      'alta': 9
    };
    
    const complexidadeMultiplier = baseTempo[complexidade] || 6;
    const custoMultiplier = Math.floor(custoPolitico / 20);
    
    return Math.max(2, Math.min(15, complexidadeMultiplier + custoMultiplier));
  }
  
  static simularApoio(leiId, partidos) {
    const lei = this.findById(leiId);
    if (!lei) return 0;
    
    let apoioTotal = 0;
    let oposicaoTotal = 0;
    
    partidos.forEach(partido => {
      const partidoNome = partido.nome || partido.sigla;
      
      // Verificar se o partido está na lista de apoio
      const apoia = lei.apoio.some(grupo => 
        partidoNome.includes(grupo) || 
        partido.sigla === grupo || 
        partido.id === grupo
      );
      
      // Verificar se o partido está na lista de oposição
      const seOpoe = lei.oposicao.some(grupo => 
        partidoNome.includes(grupo) || 
        partido.sigla === grupo || 
        partido.id === grupo
      );
      
      if (apoia) {
        apoioTotal += partido.cadeiras || 0;
      } else if (seOpoe) {
        oposicaoTotal += partido.cadeiras || 0;
      } else {
        // Partido neutro - chance de apoio baseada no custo político
        const chanceNeutro = 100 - lei.custoPolitico;
        if (Math.random() * 100 < chanceNeutro) {
          apoioTotal += Math.floor((partido.cadeiras || 0) * 0.5);
        } else {
          oposicaoTotal += Math.floor((partido.cadeiras || 0) * 0.5);
        }
      }
    });
    
    const totalCadeiras = partidos.reduce((sum, p) => sum + (p.cadeiras || 0), 0);
    const apoioPercentual = totalCadeiras > 0 ? (apoioTotal / totalCadeiras) * 100 : 0;
    
    return {
      apoio: apoioTotal,
      oposicao: oposicaoTotal,
      neutro: totalCadeiras - apoioTotal - oposicaoTotal,
      percentual: apoioPercentual,
      necessarios: Math.ceil(totalCadeiras * 0.5) + 1, // Maioria simples
      suficientes: apoioTotal >= Math.ceil(totalCadeiras * 0.5) + 1
    };
  }
  
  static calcularImpactoEconomico(leiId, economiaAtual) {
    const lei = this.findById(leiId);
    if (!lei || !lei.efeitos) return economiaAtual;
    
    const novaEconomia = { ...economiaAtual };
    
    // Aplicar efeitos da lei
    if (lei.efeitos.pib) novaEconomia.pib *= (1 + lei.efeitos.pib / 100);
    if (lei.efeitos.inflacao) novaEconomia.inflacao += lei.efeitos.inflacao;
    if (lei.efeitos.selic) novaEconomia.selic += lei.efeitos.selic;
    if (lei.efeitos.dolar) novaEconomia.dolar += lei.efeitos.dolar;
    if (lei.efeitos.riscoPais) novaEconomia.riscoPais += lei.efeitos.riscoPais;
    if (lei.efeitos.confiancaMercado) novaEconomia.confiancaMercado += lei.efeitos.confiancaMercado;
    
    // Limites
    novaEconomia.inflacao = Math.max(0, novaEconomia.inflacao);
    novaEconomia.selic = Math.max(0, novaEconomia.selic);
    novaEconomia.riscoPais = Math.max(0, Math.min(1000, novaEconomia.riscoPais));
    novaEconomia.confiancaMercado = Math.max(0, Math.min(100, novaEconomia.confiancaMercado));
    
    return novaEconomia;
  }
  
  static calcularImpactoOrcamento(leiId, orcamentoAtual) {
    const lei = this.findById(leiId);
    if (!lei || !lei.efeitos) return orcamentoAtual;
    
    let novoOrcamento = orcamentoAtual;
    
    if (lei.efeitos.arrecadacao) {
      novoOrcamento += lei.efeitos.arrecadacao;
    }
    
    if (lei.efeitos.gastos) {
      novoOrcamento += lei.efeitos.gastos; // Note: gastos é negativo
    }
    
    return Math.max(0, novoOrcamento);
  }
  
  static gerarResumoLei(leiId) {
    const lei = this.findById(leiId);
    if (!lei) return null;
    
    const pontosPositivos = [];
    const pontosNegativos = [];
    
    // Analisar efeitos
    if (lei.efeitos) {
      Object.entries(lei.efeitos).forEach(([key, value]) => {
        if (value > 0) {
          pontosPositivos.push(`${key}: +${value}`);
        } else if (value < 0) {
          pontosNegativos.push(`${key}: ${value}`);
        }
      });
    }
    
    // Analisar apoio/oposição
    const gruposApoio = lei.apoio.join(', ');
    const gruposOposicao = lei.oposicao.join(', ');
    
    return {
      titulo: lei.titulo,
      categoria: lei.categoria,
      descricao: lei.descricao,
      custoPolitico: lei.custoPolitico,
      complexidade: lei.complexidade,
      tempoEstimado: lei.tempoTramitacao,
      pontosPositivos,
      pontosNegativos,
      gruposApoio,
      gruposOposicao,
      recomendacao: lei.custoPolitico <= 30 ? 'RECOMENDADA' : 
                    lei.custoPolitico <= 50 ? 'CAUTELA' : 
                    'ALTO RISCO'
    };
  }
}