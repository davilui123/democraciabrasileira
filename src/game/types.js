// Exemplo da estrutura de um Programa no jogo
const estruturaPrograma = {
  id: "prog_minha_casa",
  nome: "Minha Moradia, Minha Vida",
  
  // 1. Identidade
  area: "infraestrutura", // afeta quais ministérios
  urgencia: "estrutural", // longo prazo
  
  // 2. Público-Alvo (Multiplicadores de Aprovação)
  targetGroups: {
    extrema_pobreza: 2.5, // Impacto muito alto
    baixa_renda: 1.5,
    empresariado: 0.2     // Impacto baixo/nulo
  },
  
  // 3. Alcance e 6. Nível de Investimento
  alcance: "nacional",
  custoMensal: 500000000, // 500 milhões
  
  // 4. Modelo de Execução (Onde mora o perigo)
  modeloExecucao: "parceria_privada", // Mais rápido, risco de corrupção médio
  
  // 5. Financiamento
  fonteRecurso: "endividamento", // Aumenta Dívida Pública, não tira de outros
  
  // 7. Transparência & 10. Riscos
  nivelFiscalizacao: "auditoria_basica",
  riscoCorrupcao: 0.35, // 35% de chance de escândalo ao longo do tempo
  
  // 8. Comunicação
  marketing: "agressivo", // Custa extra, mas aumenta ganho de popularidade imediata
  
  // 9. Prazos
  turnosParaConclusao: 24, // 2 anos (considerando 1 turno = 1 mês)
  progressoAtual: 0,
  
  // 11. Impactos (Calculados a cada turno)
  impactosMensais: {
    popularidade: +0.5,
    pib: +0.02,
    dividaPublica: +0.1
  }
};