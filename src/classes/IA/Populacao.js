class Populacao {
  constructor(
    tamanhoPopulacao = POPULACAO_INICIAL,
    taxaMutacao = TAXA_DE_MUTACAO
  ) {
    this.cobras = [];
    this.taxaMutacao = taxaMutacao;
    this.tamanhoPopulacao = tamanhoPopulacao;
    this.geracao = 1;
    this.maiorFit = 0;
    this.menorFit = 0;

    this.criarPopulacaoInicial();
  }

  totalIndividuos() {
    return this.cobras.filter((cobra) => !cobra.colidiu).length;
  }

  quemComeuMais() {
    return this.cobras.filter(
      (a, b) => b.vezesQueSeAlimentou - a.vezesQueSeAlimentou
    );
  }

  criarPopulacaoInicial() {
    // Cria a população inicial
    for (let i = 0; i < this.tamanhoPopulacao; i++) {
      this.cobras.push(new Cobra());
    }
  }

  // Avalia a aptidão de cada cobra
  avaliarAptidao() {
    this.cobras.forEach((cobra) => {
      cobra.fitness = cobra.calcularFitness();
    });
  }

  moverEDesenhar() {
    if (this.cobras.length === 0) return;

    this.desenharCobras();
    this.moverCobras();
  }

  moverCobras() {
    this.cobras.forEach((cobra) => {
      if (!cobra.colidiu) {
        cobra.mover();
      }
    });

    if (this.totalIndividuos() === 0) this.proximaGeracao();
  }

  desenharCobras() {
    this.cobras.forEach((cobra) => {
      cobra.desenhar();
    });
  }

  // Seleção natural com base no fitness
  selecionarPais() {
    // Implementa torneio ou roleta viciada
    let somaFitness = this.cobras.reduce(
      (soma, cobra) => soma + cobra.fitness,
      0
    );
    let escolha = random(somaFitness);
    let soma = 0;

    for (let cobra of this.cobras) {
      soma += cobra.fitness;
      if (soma >= escolha) return cobra;
    }
  }

  // Cria a próxima geração
  proximaGeracao() {
    if (this.cobras.length === 0) return;

    this.avaliarAptidao();
    const melhor = this.cobras.sort((a, b) => b.fitness - a.fitness);
    // const melhor = this.cobras.sort(
    //   (a, b) => b.vezesQueSeAlimentou - a.vezesQueSeAlimentou
    // );
    // console.log(melhor);

    this.maiorFit = melhor[0].fitness;
    this.menorFit = melhor[melhor.length - 1].fitness;
    const novaPopulacao = [];

    // Mantém os melhores indivíduos para a próxima geração (elitismo)
    novaPopulacao.push(melhor[0]); // Mantenha o melhor indivíduo (elitismo)
    // novaPopulacao.push(this.cobras[1]); // Opcional: mantenha os 2 melhores

    for (let i = 0; i < this.cobras.length - 1; i++) {
      // const mae = melhor[0];
      // const pai = melhor[1];
      const pai = this.selecionarPais();
      const mae = this.selecionarPais();
      const filhoGenoma = pai.genoma.cruzar(mae.genoma);
      filhoGenoma.mutar(this.taxaMutacao);
      novaPopulacao.push(new Cobra(filhoGenoma));
      console.log(filhoGenoma);
    }

    this.cobras = novaPopulacao;
    this.geracao++;
    COMIDA.comidaGerada = 1;
    COMIDA.gerarComidaAleatoria();
  }
}
