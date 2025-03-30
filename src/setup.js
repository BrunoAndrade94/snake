function mainSetup() {
  createCanvas(LARGURA, ALTURA);

  criar();
}

function criar() {
  COMIDA = new Comida();

  COBRA = new Cobra();

  POPULACAO = new Populacao();

  PAINEL = new Painel();
}
