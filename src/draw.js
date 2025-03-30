function mainDraw() {
  background(COR_DE_FUNDO);
  frameRate(FRAME_RATE); // Cobra se move 10 vezes por segundo
  DELTA_TIME = deltaTime;

  // COBRA.desenhar();
  // COBRA.mover();
  COMIDA.desenhar();

  POPULACAO.moverEDesenhar();

  PAINEL.desenhar();
}
