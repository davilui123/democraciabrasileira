// src/data/repositories/ProblemaRepository.js

import { db } from '../db.js';
import { problemasMetadata, agruparProblemas, interdependenciaProblemas } from '../seed/problemas.js';

export class ProblemaRepository {
  static findAll() {
    return db.find('problemasEstruturais');
  }
  
  static findById(id) {
    return db.findOne('problemasEstruturais', { id });
  }
  
  static findByMinisterio(ministerioId) {
    return db.find('problemasEstruturais', { ministerioId });
  }
  
  static findByMinisterioEOrigem(ministerioId, origem) {
    return db.find('problemasEstruturais', { ministerioId, origem });
  }
  
  static findByCategoria(categoria) {
    return db.find('problemasEstruturais', { categoria });
  }
  
  static findByTendencia(tendencia) {
    return db.find('problemasEstruturais', { tendencia });
  }
  
  static getProblemaEstrutural(ministerioId, origem) {
    const problemas = this.findByMinisterioEOrigem(ministerioId, origem);
    
    if (!problemas || problemas.length === 0) return null;
    
    const problemaBase = problemas[Math.floor(Math.random() * problemas.length)];
    
    // Clonar para evitar referência
    const problemaClonado = JSON.parse(JSON.stringify(problemaBase));
    
    return {
      ...problemaClonado,
      nivelAtual: 1,
      turnosNoNivel: 0,
      velocidadeMaturacao: 1.0,
      fatoresAceleracao: [],
      dataCriacao: Date.now(),
      interdependencias: interdependenciaProblemas.getProblemasRelacionados(problemaClonado.id)
    };
  }
  
  static getEstagiosProblema() {
    return {
      SUSSURRO_INTERNO: 1,
      ALERTA_TECNICO: 2,
      PRESSAO_POLITICA: 3,
      CRISE_PUBLICA: 4
    };
  }
  
  static getProblemasCriticos() {
    return db.find('problemasEstruturais', { id: { $in: problemasMetadata.problemasCriticos } });
  }
  
  static getProblemasPorSeveridade(minSeveridade) {
    // Severidade baseada no nível máximo de impacto
    return db.find('problemasEstruturais').filter(problema => {
      const nivel4 = problema.estagios.find(e => e.nivel === 4);
      if (!nivel4 || !nivel4.impacto) return false;
      
      const impactos = Object.values(nivel4.impacto).filter(v => v < 0);
      const severidade = Math.abs(Math.min(...impactos, 0));
      
      return severidade >= minSeveridade;
    });
  }
  
  static calcularCustoResolucaoTotal(ministerioId, nivel = 3) {
    const problemas = this.findByMinisterio(ministerioId);
    let custoTotal = 0;
    
    problemas.forEach(problema => {
      const estagio = problema.estagios.find(e => e.nivel === nivel);
      if (estagio && estagio.custoResolucao) {
        custoTotal += estagio.custoResolucao;
      }
    });
    
    return custoTotal;
  }
  
  static simularEfeitoDomino(problemaId) {
    const problema = this.findById(problemaId);
    if (!problema) return [];
    
    const efeitos = [];
    const problemasRelacionados = interdependenciaProblemas.getProblemasRelacionados(problemaId);
    
    problemasRelacionados.forEach(relId => {
      const rel = this.findById(relId);
      if (rel) {
        efeitos.push({
          problema: rel.titulo,
          efeito: 'Acelerado',
          fator: 1.3
        });
      }
    });
    
    return efeitos;
  }
  
  static gerarRelatorioMinisterio(ministerioId) {
    const problemas = this.findByMinisterio(ministerioId);
    
    if (problemas.length === 0) return null;
    
    let custoResolucaoTotal = 0;
    let problemasCriticos = 0;
    let problemasCrescendo = 0;
    
    problemas.forEach(p => {
      const custoNivel3 = p.estagios.find(e => e.nivel === 3)?.custoResolucao || 0;
      const custoNivel4 = p.estagios.find(e => e.nivel === 4)?.custoResolucao || 0;
      custoResolucaoTotal += Math.min(custoNivel3, custoNivel4);
      
      if (p.tendencia === 'crescente') problemasCrescendo++;
      if (problemasMetadata.problemasCriticos.includes(p.id)) problemasCriticos++;
    });
    
    const riscoTotal = Math.min(100, 
      (problemasCrescendo / problemas.length) * 50 + 
      (problemasCriticos / problemas.length) * 50
    );
    
    return {
      ministerioId,
      totalProblemas: problemas.length,
      problemasCriticos,
      problemasCrescendo,
      custoResolucaoEstimado: custoResolucaoTotal,
      riscoTotal: Math.round(riscoTotal),
      prioridade: riscoTotal > 70 ? 'ALTA' : riscoTotal > 40 ? 'MÉDIA' : 'BAIXA',
      recomendacao: this.gerarRecomendacao(problemas)
    };
  }
  
  static gerarRecomendacao(problemas) {
    const problemasCrescendo = problemas.filter(p => p.tendencia === 'crescente');
    const problemasCriticos = problemas.filter(p => problemasMetadata.problemasCriticos.includes(p.id));
    
    if (problemasCriticos.length > 0) {
      return 'Intervenção imediata necessária. Problemas críticos exigem atenção prioritária.';
    } else if (problemasCrescendo.length > problemas.length / 2) {
      return 'Situação se deteriorando. Ação preventiva recomendada antes que problemas atinjam nível crítico.';
    } else {
      return 'Situação estável. Manter monitoramento e ações de manutenção.';
    }
  }
  
  static getMetadata() {
    return problemasMetadata;
  }
  
  static getAgrupamentos() {
    return agruparProblemas;
  }
  
  static getInterdependencias() {
    return interdependenciaProblemas;
  }
  
  // Novo: Gerar problema específico por ID
  static gerarProblemaPorId(id) {
    const problemaBase = this.findById(id);
    if (!problemaBase) return null;
    
    // Clonar para evitar referência
    const problemaClonado = JSON.parse(JSON.stringify(problemaBase));
    
    return {
      ...problemaClonado,
      nivelAtual: 1,
      turnosNoNivel: 0,
      velocidadeMaturacao: 1.0,
      fatoresAceleracao: [],
      dataCriacao: Date.now(),
      interdependencias: interdependenciaProblemas.getProblemasRelacionados(problemaClonado.id)
    };
  }
  
  // Novo: Calcular impacto político de um problema
  static calcularImpactoPolitico(problemaId, nivel) {
    const problema = this.findById(problemaId);
    if (!problema) return { popularidade: 0, capitalPolitico: 0, outros: {} };
    
    const estagio = problema.estagios.find(e => e.nivel === nivel);
    if (!estagio || !estagio.impacto) return { popularidade: 0, capitalPolitico: 0, outros: {} };
    
    return estagio.impacto;
  }
  
  // Novo: Verificar se um problema está próximo de se tornar visível
  static estaProximoVisibilidade(problema) {
    if (!problema || typeof problema.nivelAtual !== 'number') return false;
    
    const estagioAtual = problema.estagios.find(e => e.nivel === problema.nivelAtual);
    if (!estagioAtual) return false;
    
    // Se já é visível ou se está no nível 2 (próximo de se tornar visível no nível 3)
    return estagioAtual.visivel || problema.nivelAtual === 2;
  }
}