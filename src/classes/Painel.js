class Painel {
  constructor() {}

  desenhar() {
    fill(255);
    textSize(25);
    text(`ESTATISTICAS`, 10, 30);

    textSize(25);
    text(`N. INDIVIDUES: ${POPULACAO.totalIndividuos()}`, 10, 60);

    textSize(25);
    text(`N. GERACOES: ${POPULACAO.geracao}`, 10, 90);

    textSize(25);
    text(`N. COMIDAS: ${COMIDA.comidaGerada}`, 10, 120);

    // textSize(25);
    // text(`FIT ATUAL: ${POPULACAO.maiorFit}`, 10, 150);

    textSize(25);
    text(`MOV DISP: ${COBRAS.movimentosDisponiveis}`, 10, 180);

    textSize(25);
    text(`FIT MENOR: ${POPULACAO.menorFit}`, 10, 210);
  }
}
