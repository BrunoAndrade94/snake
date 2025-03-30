class Cobra {
  constructor(
    genoma = new Genoma(),
    comprimento = COMPRIMENTO_COBRA,
    pixelCobra = PIXEL_COBRA
  ) {
    this.corpo = [];
    this.fitness = 0;
    this.velocidade = 0;
    this.tempoDeVida = 0;
    this.colidiu = false;
    this.genoma = genoma;
    this.vezesQueSeAlimentou = 0;
    this.comprimento = comprimento;
    this.direcao = createVector(0, 1);
    this.pixelCobra = pixelCobra;

    this.posicaoInicial();
  }

  posicaoInicial() {
    // Inicializa a cobra no meio da tela com o comprimento definido
    const posicaoInicialX = Math.floor(random(LARGURA / (2 * this.pixelCobra)));
    const posicaoInicialY = Math.floor(random(ALTURA / (2 * this.pixelCobra)));

    for (let i = 0; i < this.comprimento; i++) {
      this.corpo.push(
        createVector(posicaoInicialX - i * this.direcao.x, posicaoInicialY)
      );
    }
  }

  novaCabeca() {
    return this.corpo[this.corpo.length - 1].copy();
  }

  calcularFitness() {
    const comidaDistancia = this.comidaDistancia(); // Cr
    this.fitness = (1000 / (comidaDistancia + 1)).toFixed();
    // const fitness = this.vezesQueSeAlimentou * 5;
    // const fitness = this.tempoDeVida + this.vezesQueSeAlimentou * 0.1;
    // console.log(fitness);
    return this.fitness;
  }

  comidaDistancia() {
    const dx = COMIDA.posicao.x - this.direcao.x; // Diferença no eixo X
    const dy = COMIDA.posicao.y - this.direcao.y; // Diferença no eixo Y
    return Math.sqrt(dx * dx + dy * dy); // Distância Euclidiana
  }

  moverComIA() {
    const entradas = this.calcularEntradas();
    const saida = this.genoma.processarEntradas(entradas);

    // console.log("Entradas da IA:", entradas);
    // console.log("Saída da IA:", saida);

    const { x: cobraX, y: cobraY } = this.corpo[0];
    const { x: comidaX, y: comidaY } = COMIDA.posicao || { x: 0, y: 0 };

    // // Determina a direção baseada na saída da IA
    if (saida <= -0.5)
      this.mudarDirecao(createVector(0, -1)); // CIMA
    else if (saida <= 0)
      this.mudarDirecao(createVector(0, 1)); // BAIXO
    else if (saida <= 0.5)
      this.mudarDirecao(createVector(-1, 0)); // ESQUERDA
    else this.mudarDirecao(createVector(1, 0)); // DIREITA
  }

  mover() {
    if (this.corpo.length === 0 || this.colidiu) return false;

    this.moverComIA();

    let novaCabeca = this.novaCabeca();
    novaCabeca.add(this.direcao);

    if (this.seColidiuParede(novaCabeca) || this.seColidiuCorpo(novaCabeca)) {
      this.colidiu = true;
      return; // Sai do método
    }

    if (this.seColidiuComida(novaCabeca)) {
      this.comer();
    } else {
      this.corpo.shift();
    }

    this.corpo.push(novaCabeca);
  }

  mudarDirecao(novaDirecao) {
    if (
      novaDirecao.x !== -this.direcao.x &&
      novaDirecao.y !== -this.direcao.y
    ) {
      this.direcao = novaDirecao;
    }
  }

  calcularPontuacao(comida) {
    const { x: cobraX, y: cobraY } = this.corpo[0];
    const { x: comidaX, y: comidaY } = comida;

    // Menor distância até a comida
    const distancia = dist(cobraX, cobraY, comidaX, comidaY);

    // Pontuação baseada na distância (quanto menor, melhor)
    this.pontuacao = 1 / (distancia + 1); // Evita divisão por zero
  }

  calcularEntradas() {
    const entradas = [];

    const { x: cobraX, y: cobraY } = this.corpo[0];
    const { x: comidaX, y: comidaY } = COMIDA.posicao;
    // const { x: comidaX, y: comidaY } = COMIDA.posicao || { x: 0, y: 0 };

    entradas.push(comidaX - cobraX);
    entradas.push(comidaY - cobraY);

    // Obstáculos em cada direção
    entradas.push(this.verificarColisao(createVector(0, -1))); // Obstáculo acima
    entradas.push(this.verificarColisao(createVector(0, 1))); // Obstáculo abaixo
    entradas.push(this.verificarColisao(createVector(-1, 0))); // Obstáculo à esquerda
    entradas.push(this.verificarColisao(createVector(1, 0))); // Obstáculo à direita

    return entradas;
  }

  // calcularEntradas(comida) {
  //   const novaCabeca = this.novaCabeca();
  //   const distancias = {
  //     cima: novaCabeca.y,
  //     baixo: ALTURA / this.pixelCobra - novaCabeca.y - 1,
  //     esquerda: novaCabeca.x,
  //     direita: LARGURA / this.pixelCobra - novaCabeca.x - 1,
  //   };

  //   return [
  //     comida.posicao.x - novaCabeca.x,
  //     comida.posicao.y - novaCabeca.y,
  //     distancias.cima,
  //     distancias.baixo,
  //     distancias.esquerda,
  //     distancias.direita,
  //   ];
  // }

  verificarColisao(direcao) {
    const proximaPosicao = p5.Vector.add(this.corpo[0], direcao);

    // Verifica colisão com bordas do canvas
    if (
      proximaPosicao.x < 0 ||
      proximaPosicao.y < 0 ||
      proximaPosicao.x >= LARGURA ||
      proximaPosicao.y >= ALTURA
    ) {
      return 1; // Há colisão
    }

    // Verifica colisão com o próprio corpo
    for (let i = 1; i < this.corpo.length; i++) {
      if (proximaPosicao.equals(this.corpo[i])) {
        return 1; // Há colisão
      }
    }

    return 0; // Sem colisão
  }

  seColidiuComida(novaCabeca) {
    if (
      novaCabeca.x === COMIDA.posicao.x &&
      novaCabeca.y === COMIDA.posicao.y
    ) {
      return true;
    } else return false;
  }

  seColidiuCorpo(novaCabeca) {
    for (let i = 0; i < this.corpo.length - 1; i++) {
      let seguimento = this.corpo[i];
      if (novaCabeca.x === seguimento.x && novaCabeca.y === seguimento.y) {
        return true;
      }
    }
    return false;
  }

  seColidiuParede(novaCabeca) {
    if (
      novaCabeca.x < 0 ||
      novaCabeca.x >= LARGURA / this.pixelCobra ||
      novaCabeca.y < 0 ||
      novaCabeca.y >= ALTURA / this.pixelCobra
    ) {
      return true;
    }
    return false;
  }

  comer() {
    let novaCabeca = this.novaCabeca();
    let velocidadeAdicional = VELOCIDADE_ADICIONAL;

    novaCabeca.add(this.direcao.copy().mult(velocidadeAdicional));
    this.corpo.push(novaCabeca);
    this.comprimento++;
    COMIDA.gerarComidaAleatoria();
    COMIDA.comidaGerada++;
  }

  desenhar() {
    for (let i = 0; i < this.corpo.length; i++) {
      let seguimento = this.corpo[i];

      if (i === this.corpo.length - 1) fill(255, 0, 0);
      else fill(0, 244, 0);

      noStroke();
      rect(
        seguimento.x * this.pixelCobra,
        seguimento.y * this.pixelCobra,
        this.pixelCobra,
        this.pixelCobra
      );
    }
  }
}
