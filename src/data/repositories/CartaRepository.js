import { db } from '../db.js';

export class CartaRepository {
  constructor(dbInstance) {
    this.db = dbInstance || db;
  }

  // ==================== CRUD BÁSICO (CORRIGIDO) ====================
  async getAll() {
    // Retorna array direto do seu db customizado
    return this.db.find('cartasDiplomaticas');
  }

  async getById(id) {
    return this.db.findOne('cartasDiplomaticas', { id });
  }

  async create(carta) {
    return this.db.insert('cartasDiplomaticas', carta);
  }

  async update(id, updates) {
    return this.db.update('cartasDiplomaticas', id, updates);
  }

  async delete(id) {
    return this.db.delete('cartasDiplomaticas', id);
  }

  // ==================== QUERIES ESPECÍFICAS (CORRIGIDO) ====================
  async getByNivel(nivel) {
    // Usa o sistema de query objeto do seu db.js
    return this.db.find('cartasDiplomaticas', { nivelNecessario: nivel });
  }

  async getByTipo(tipo) {
    return this.db.find('cartasDiplomaticas', { tipo });
  }

  async getCartasDisponiveis(nivelJogador, cartasDesbloqueadas = []) {
    // Busca todas e filtra via Javascript (seguro e rápido para db local)
    const todas = await this.getAll();
    if (!todas) return [];
    
    return todas.filter(c => 
      c.nivelNecessario <= nivelJogador || cartasDesbloqueadas.includes(c.id)
    );
  }

  // Mantive a lógica de estatísticas pois é cálculo local
  async getEstatisticasDeck(idsDeck) {
    const todas = await this.getAll();
    const cartas = todas.filter(c => idsDeck.includes(c.id));
    
    if (cartas.length === 0) return null;
    
    const estatisticas = {
      pressaoMedia: 0,
      confiancaMedia: 0,
      custoMedio: 0
    };
    
    let somaPressao = 0;
    let somaConfianca = 0;
    let somaCusto = 0;
    
    cartas.forEach(carta => {
      somaPressao += carta.pressao;
      somaConfianca += carta.confianca;
      somaCusto += carta.custo;
    });
    
    estatisticas.pressaoMedia = somaPressao / cartas.length;
    estatisticas.confiancaMedia = somaConfianca / cartas.length;
    estatisticas.custoMedio = somaCusto / cartas.length;
    
    return estatisticas;
  }

  // Mantive a lógica de combos
  async getCombosEfetivos() {
    const combos = [
      {
        nome: "Diplomacia Total",
        cartas: ['banquete_oficial', 'diplomacia_cultural', 'media_strategy'],
        bonus: { confianca: 15, softPower: 20 }
      },
      {
        nome: "Pressão Máxima",
        cartas: ['pressao_politica', 'veto_onu', 'submarino_nuclear'],
        bonus: { pressao: 25, risco: 15 }
      },
      {
        nome: "Green Power",
        cartas: ['trunfo_amazonico', 'alianca_ambiental', 'lider_climatico'],
        bonus: { ambiental: 30, imagemExterna: 25 }
      },
      {
        nome: "Crescimento Econômico",
        cartas: ['acordo_comercial', 'zona_livre_comercio', 'missao_empresarial'],
        bonus: { economia: 20, pib: 0.5 }
      }
    ];
    return combos;
  }
}