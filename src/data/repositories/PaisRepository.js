// src/data/repositories/PaisRepository.js

import { db } from '../db.js';
import { paisesMetadata, agruparPaises } from '../seed/paises.js';

export class PaisRepository {
  static findAll() {
    return db.find('paises');
  }
  
  static findById(id) {
    return db.findOne('paises', { id });
  }
  
  static findByRegiao(regiao) {
    return db.find('paises', { regiao });
  }
  
  static findByAlinhamento(alinhamento) {
    return db.find('paises', { alinhamento });
  }
  
  static findByBloco(blocoId) {
    return db.find('paises', { blocos: blocoId });
  }
  
  static findByRecurso(recurso) {
    return db.find('paises', { recursos: recurso });
  }
  
  static findPaisesEmGuerra() {
    return db.find('paises', { emGuerra: true });
  }
  
  static getPotenciaisMundiais() {
    return db.find('paises', { pib: { $gte: 1000000000000 } }); // > 1 trilhão
  }
  
  static getPaisesEmergentes() {
    const emergentes = ['cn', 'in', 'br', 'ru', 'za', 'sa', 'ae', 'tr', 'id', 'mx'];
    return db.find('paises', { id: { $in: emergentes } });
  }
  
  static getPaisesEstrategicos() {
    const estrategicos = ['us', 'cn', 'ru', 'de', 'fr', 'gb', 'jp', 'in', 'sa'];
    return db.find('paises', { id: { $in: estrategicos } });
  }
  
  static updateRelacao(id, delta) {
    const pais = db.findOne('paises', { id });
    if (!pais) return null;
    
    const novaRelacao = Math.max(0, Math.min(100, (pais.relacao || 50) + delta));
    return db.update('paises', id, { relacao: novaRelacao });
  }
  
  static setRelacao(id, valor) {
    const novaRelacao = Math.max(0, Math.min(100, valor));
    return db.update('paises', id, { relacao: novaRelacao });
  }
  
  static atualizarSoftPower(id, delta) {
    const pais = db.findOne('paises', { id });
    if (!pais) return null;
    
    const novoSoftPower = Math.max(0, Math.min(100, (pais.softPower || 50) + delta));
    return db.update('paises', id, { softPower: novoSoftPower });
  }
  
  static getPaisesPorProximidadeGeografica(regiao) {
    const regioesProximas = {
      'america_sul': ['america_sul', 'america_norte', 'europa'],
      'europa': ['europa', 'africa', 'oriente_medio'],
      'asia': ['asia', 'oriente_medio', 'oceania'],
      'oriente_medio': ['oriente_medio', 'asia', 'africa', 'europa'],
      'africa': ['africa', 'europa', 'oriente_medio'],
      'america_norte': ['america_norte', 'america_sul', 'europa'],
      'oceania': ['oceania', 'asia']
    };
    
    const regioes = regioesProximas[regiao] || [regiao];
    return db.find('paises', { regiao: { $in: regioes } });
  }
  
  static calcularInfluenciaRegional(paisId) {
    const pais = this.findById(paisId);
    if (!pais) return 0;
    
    const paisesRegiao = this.findByRegiao(pais.regiao);
    let influencia = 0;
    
    paisesRegiao.forEach(p => {
      if (p.id !== paisId) {
        // Influência baseada no PIB e soft power
        const pesoPIB = Math.log10(p.pib || 1) / 10;
        const pesoSoftPower = (p.softPower || 0) / 100;
        influencia += pesoPIB * pesoSoftPower;
      }
    });
    
    return Math.min(100, influencia * 20);
  }
  
  static getRivalidades(paisId) {
    const pais = this.findById(paisId);
    if (!pais) return [];
    
    const rivalidades = [];
    
    // Rivalidades baseadas em alinhamento
    switch(pais.alinhamento) {
      case 'ocidente':
        rivalidades.push(...this.findByAlinhamento('anti_imperialista'));
        break;
      case 'anti_imperialista':
        rivalidades.push(...this.findByAlinhamento('ocidente'));
        break;
      case 'brics':
        rivalidades.push(...this.findByAlinhamento('ocidente'));
        break;
    }
    
    // Rivalidades específicas
    const rivaisEspecificos = {
      'us': ['ru', 'cn', 'ir', 've'],
      'cn': ['us', 'in', 'jp'],
      'ru': ['us', 'ua', 'gb'],
      'il': ['ir', 'sa'],
      'in': ['cn', 'pk'],
      'sa': ['ir'],
      'ir': ['us', 'il', 'sa']
    };
    
    if (rivaisEspecificos[paisId]) {
      rivaisEspecificos[paisId].forEach(rivalId => {
        const rival = this.findById(rivalId);
        if (rival) rivalidades.push(rival);
      });
    }
    
    return [...new Set(rivalidades.map(p => p.id))].slice(0, 3);
  }
  
  static getAliadosNaturais(paisId) {
    const pais = this.findById(paisId);
    if (!pais) return [];
    
    const aliados = [];
    
    // Aliados por bloco
    pais.blocos.forEach(blocoId => {
      aliados.push(...this.findByBloco(blocoId));
    });
    
    // Aliados por alinhamento
    aliados.push(...this.findByAlinhamento(pais.alinhamento));
    
    // Aliados específicos
    const aliadosEspecificos = {
      'us': ['gb', 'ca', 'au', 'jp', 'kr', 'de', 'fr'],
      'cn': ['ru', 'za', 'br', 'sa', 'ae'],
      'ru': ['cn', 'ir', 've'],
      'br': ['ar', 'uy', 'py', 'pt', 'za', 'cn', 'ru'],
      'ar': ['br', 'uy', 'py'],
      'de': ['fr', 'it', 'es', 'nl', 'be']
    };
    
    if (aliadosEspecificos[paisId]) {
      aliadosEspecificos[paisId].forEach(aliadoId => {
        const aliado = this.findById(aliadoId);
        if (aliado) aliados.push(aliado);
      });
    }
    
    // Remover o próprio país e duplicados
    const aliadosUnicos = [...new Map(aliados.filter(p => p.id !== paisId).map(p => [p.id, p])).values()];
    
    return aliadosUnicos.slice(0, 5);
  }
  
  static gerarPerfilDiplomatico(paisId) {
    const pais = this.findById(paisId);
    if (!pais) return null;
    
    const influencia = this.calcularInfluenciaRegional(paisId);
    const rivais = this.getRivalidades(paisId);
    const aliados = this.getAliadosNaturais(paisId);
    
    // Calcular tendência diplomática
    let tendencia = 'neutra';
    const relacaoBase = pais.relacao || 50;
    
    if (relacaoBase >= 70) tendencia = 'amigavel';
    else if (relacaoBase <= 30) tendencia = 'hostil';
    else if (pais.alinhamento === 'ocidente') tendencia = 'pro-ocidente';
    else if (pais.alinhamento === 'brics') tendencia = 'pro-brics';
    
    // Calcular disposição para tratados
    let disposicaoTratados = 50;
    disposicaoTratados += (pais.relacao - 50) / 2;
    disposicaoTratados += pais.softPower / 10;
    disposicaoTratados = Math.max(10, Math.min(90, disposicaoTratados));
    
    return {
      id: pais.id,
      nome: pais.nome,
      tendencia,
      influenciaRegional: Math.round(influencia),
      disposicaoTratados: Math.round(disposicaoTratados),
      rivaisPrincipais: rivais.slice(0, 3),
      aliadosPrincipais: aliados.slice(0, 3).map(a => a.id),
      pontosPressao: this.identificarPontosPressao(pais),
      oportunidades: this.identificarOportunidades(pais)
    };
  }
  
  static identificarPontosPressao(pais) {
    const pontos = [];
    
    if (pais.emGuerra) pontos.push('conflito_militar');
    if (pais.pib < 50000000000) pontos.push('economia_fraca');
    if (pais.softPower < 40) pontos.push('baixa_influencia');
    if (pais.pressaoAmbiental > 80) pontos.push('pressao_ambiental');
    if (this.getRivalidades(pais.id).length >= 3) pontos.push('multiplos_rivais');
    
    return pontos;
  }
  
  static identificarOportunidades(pais) {
    const oportunidades = [];
    
    if (pais.recursos.includes('petroleo')) oportunidades.push('energia');
    if (pais.recursos.includes('tecnologia')) oportunidades.push('transferencia_tecnologia');
    if (pais.recursos.includes('armas')) oportunidades.push('cooperacao_militar');
    if (pais.blocos.includes('brics')) oportunidades.push('cooperacao_brics');
    if (pais.blocos.includes('mercosul')) oportunidades.push('integracao_regional');
    if (pais.softPower > 70) oportunidades.push('soft_power');
    
    return oportunidades;
  }
  
  static simurarReacaoTratado(paisAlvoId, tratado) {
    const pais = this.findById(paisAlvoId);
    if (!pais) return { reacao: 'neutra', intensidade: 0 };
    
    let reacao = 'neutra';
    let intensidade = 0;
    
    // Baseado na relação atual
    intensidade += (pais.relacao - 50) / 10;
    
    // Baseado em rivalidades compartilhadas
    const rivaisCompartilhados = tratado.reacoes?.rivais || [];
    const rivaisDoPais = this.getRivalidades(paisAlvoId);
    const rivaisEmComum = rivaisCompartilhados.filter(r => rivaisDoPais.includes(r));
    intensidade += rivaisEmComum.length * 5;
    
    // Baseado em aliados compartilhados
    const aliadosCompartilhados = tratado.reacoes?.aliados || [];
    const aliadosDoPais = this.getAliadosNaturais(paisAlvoId).map(a => a.id);
    const aliadosEmComum = aliadosCompartilhados.filter(a => aliadosDoPais.includes(a));
    intensidade += aliadosEmComum.length * 3;
    
    // Determinar reação
    if (intensidade >= 10) reacao = 'muito_positiva';
    else if (intensidade >= 5) reacao = 'positiva';
    else if (intensidade <= -10) reacao = 'muito_negativa';
    else if (intensidade <= -5) reacao = 'negativa';
    
    return { reacao, intensidade: Math.round(intensidade) };
  }
  
  static getMetadata() {
    return paisesMetadata;
  }
  
  static getAgrupamentos() {
    return agruparPaises;
  }
}