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
    this.totalMovimentos = 0;
    this.movimentosDisponiveis = 1000;
    this.colidiu = false;
    this.genoma = genoma;
    this.vezesQueSeAlimentou = 0;
    this.comprimento = comprimento;
    this.direcao = createVector(0, 1);
    this.pixelCobra = pixelCobra;
    this.ultimasPosicoes = [];
    this.tamanhoUltimasPosicoes = 100;

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
    let fitness = this.vezesQueSeAlimentou * 1000;

    // Penaliza loops: quanto mais movimentos por comida, pior
    const eficiencia = this.vezesQueSeAlimentou / (this.totalMovimentos + 1);
    fitness += eficiencia * 500;

    // Penaliza cobras que repetem posições (loops)
    const posicoesUnicas = new Set(
      this.ultimasPosicoes.map((p) => `${p.x},${p.y}`)
    ).size;
    const taxaRepeticao = 1 - posicoesUnicas / this.ultimasPosicoes.length;
    fitness -= taxaRepeticao * 1000;

    return max(fitness, 0); // Evita fitness negativo
  }

  // calcularFitness() {
  //   let fitness = this.vezesQueSeAlimentou * 1000;
  //   fitness += this.tempoDeVida * 0.1;

  //   // Penaliza cobras que ficam girando (muitos movimentos sem comer)
  //   const penalidadeLoop =
  //     this.totalMovimentos / (this.vezesQueSeAlimentou + 1);
  //   fitness -= penalidadeLoop * 500;

  //   return Math.abs(fitness);
  // }

  // calcularFitness() {
  //   const pesoMovimentos = 8;
  //   const pesoDistancia = 1;
  //   const pesoComida = 1000;

  //   const fitness =
  //     this.vezesQueSeAlimentou * pesoComida +
  //     this.totalMovimentos * pesoMovimentos -
  //     this.comidaDistancia() * pesoDistancia;

  //   return Math.abs(fitness);
  // }

  comidaDistancia() {
    const dx = COMIDA.posicao.x - this.direcao.x; // Diferença no eixo X
    const dy = COMIDA.posicao.y - this.direcao.y; // Diferença no eixo Y
    return Math.sqrt(dx * dx + dy * dy); // Distância Euclidiana
  }

  moverComIA() {
    const cabeca = this.corpo[0];
    const dx = COMIDA.posicao.x - cabeca.x;
    const dy = COMIDA.posicao.y - cabeca.y;

    // Se a comida está adjacente, escolhe a direção óbvia
    if (Math.abs(dx) + Math.abs(dy) === 1) {
      const direcao = createVector(dx, dy);
      this.mudarDirecao(direcao);
      return; // Ignora o resto do código
    }

    // Caso 2: Detectou loop -> escolhe aleatoriamente
    if (this.estaEmLoop()) {
      this.mudarDirecao(this.escapeLoop());
      return;
    }

    const entradas = this.calcularEntradas();
    this.genoma.processarEntradas(entradas);

    // Direções possíveis (cima, baixo, esquerda, direita)
    const direcoes = [
      createVector(0, -1), // Cima
      createVector(0, 1), // Baixo
      createVector(-1, 0), // Esquerda
      createVector(1, 0), // Direita
    ];

    // Escolhe a direção com menor colisão e maior aproximação da comida
    let melhorDirecao = this.direcao; // Mantém a atual se não houver melhor
    let melhorPontuacao = -Infinity;

    for (const direcao of direcoes) {
      if (direcao.x === -this.direcao.x && direcao.y === -this.direcao.y)
        continue; // Evita voltar

      const proximaPos = p5.Vector.add(this.corpo[0], direcao);
      const distanciaComida = proximaPos.dist(COMIDA.posicao);
      const colisao = this.verificarColisao(direcao);

      // Pontuação: menor distância + evitar colisões
      // const pontuacao = this.calcularPontuacao();
      const pontuacao = -distanciaComida - colisao * 1000;

      if (pontuacao > melhorPontuacao) {
        melhorPontuacao = pontuacao;
        melhorDirecao = direcao;
      }
    }

    this.mudarDirecao(melhorDirecao);
    this.totalMovimentos++;
    this.movimentosDisponiveis -= 0.9;
  }
  estaEmLoop() {
    // Se a posição atual apareceu mais de X vezes na memória, está em loop
    const posAtual = this.ultimasPosicoes[this.ultimasPosicoes.length - 1];
    const repeticoes = this.ultimasPosicoes.filter((p) =>
      p.equals(posAtual)
    ).length;
    return repeticoes > 3; // Ajuste esse limite conforme necessário
  }

  escapeLoop() {
    // Escolhe uma direção aleatória que não cause colisão
    const direcoes = [
      createVector(0, -1),
      createVector(0, 1),
      createVector(-1, 0),
      createVector(1, 0),
    ];
    const direcoesValidas = direcoes.filter(
      (direcao) =>
        !this.verificarColisao(direcao) &&
        !(direcao.x === -this.direcao.x && direcao.y === -this.direcao.y)
    );
    return direcoesValidas.length > 0
      ? direcoesValidas[floor(random(direcoesValidas.length))]
      : this.direcao; // Se não houver saída, mantém a direção (último recurso)
  }

  mover() {
    if (this.movimentosDisponiveis === 0) this.colidiu = true;
    if (this.corpo.length === 0 || this.colidiu) return false;

    let novaCabeca = this.novaCabeca();
    novaCabeca.add(this.direcao);

    // Adiciona à memória e remove posições antigas
    this.ultimasPosicoes.push(novaCabeca.copy());
    if (this.ultimasPosicoes.length > this.tamanhoMemoria) {
      this.ultimasPosicoes.shift();
    }

    // Verifica se a nova posição já foi visitada recentemente
    if (this.estaEmLoop()) {
      this.mudarDirecao(this.escapeLoop()); // Força sair do loop
    }

    this.moverComIA();

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

  // calcularPontuacao(comida) {
  //   const { x: cobraX, y: cobraY } = this.corpo[0];
  //   const { x: comidaX, y: comidaY } = comida;

  //   // Menor distância até a comida
  //   const distancia = dist(cobraX, cobraY, comidaX, comidaY);

  //   // Pontuação baseada na distância (quanto menor, melhor)
  //   this.pontuacao = 1 / (distancia + 1); // Evita divisão por zero
  // }

  calcularEntradas() {
    // const entradas = [];

    // const { x: cobraX, y: cobraY } = this.corpo[0];
    // const { x: comidaX, y: comidaY } = COMIDA.posicao;
    // // const { x: comidaX, y: comidaY } = COMIDA.posicao || { x: 0, y: 0 };

    // entradas.push(comidaX - cobraX);
    // entradas.push(comidaY - cobraY);

    const entradas = [];
    const cabeca = this.corpo[0];

    // Posição relativa da comida (já existe)
    entradas.push(COMIDA.posicao.x - cabeca.x); // DX
    entradas.push(COMIDA.posicao.y - cabeca.y); // DY

    // Nova: Verifica se a comida está em cada direção adjacente (1 ou 0)
    entradas.push(
      COMIDA.posicao.x === cabeca.x && COMIDA.posicao.y === cabeca.y - 1 ? 1 : 0
    ); // Comida ACIMA
    entradas.push(
      COMIDA.posicao.x === cabeca.x && COMIDA.posicao.y === cabeca.y + 1 ? 1 : 0
    ); // Comida ABAIXO
    entradas.push(
      COMIDA.posicao.x === cabeca.x - 1 && COMIDA.posicao.y === cabeca.y ? 1 : 0
    ); // Comida ESQUERDA
    entradas.push(
      COMIDA.posicao.x === cabeca.x + 1 && COMIDA.posicao.y === cabeca.y ? 1 : 0
    ); // Comida DIREITA

    // Obstáculos em cada direção
    entradas.push(this.verificarColisao(createVector(0, -1))); // Obstáculo acima
    entradas.push(this.verificarColisao(createVector(0, 1))); // Obstáculo abaixo
    entradas.push(this.verificarColisao(createVector(-1, 0))); // Obstáculo à esquerda
    entradas.push(this.verificarColisao(createVector(1, 0))); // Obstáculo à direita

    return entradas;
  }

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
    this.movimentosDisponiveis += 1;
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
