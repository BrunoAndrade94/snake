class Genoma {
  constructor(tamanho = TAMANHO_GENOMA) {
    this.pesos = Array.from({ length: tamanho }, () => random(-1, 1)); // Inicia pesos aleatórios
  }

  // Realiza cruzamento genético entre dois genomas
  cruzar(outroGenoma) {
    const novoGenoma = new Genoma(this.pesos.length);
    for (let i = 0; i < this.pesos.length; i++) {
      // Combina genes (pesos) dos pais
      novoGenoma.pesos[i] =
        random() < 0.5 ? this.pesos[i] : outroGenoma.pesos[i];
    }
    return novoGenoma;
  }

  // Aplica mutação aos pesos do genoma
  mutar(taxaMutacao = TAXA_MUTACAO) {
    for (let i = 0; i < this.pesos.length; i++) {
      if (random() < taxaMutacao) {
        // this.pesos[i] += random(-0.5, 0.5); // Pequena alteração no peso
        const antes = this.pesos[i];
        this.pesos[i] += random(-0.5, 0.5);
        // console.log(
        //   `Peso ${i} mudou de ${antes.toFixed(4)} para ${this.pesos[i].toFixed(4)}`
        // );
      }
    }
  }

  processarEntradas(entradas) {
    let soma = 0;
    // console.log("Entradas:", entradas);

    for (let i = 0; i < this.pesos.length; i++) {
      // console.log(
      //   `Entrada ${i}: ${entradas[i]}, Peso ${i}: ${this.pesos[i].toFixed(4)}`
      // );
      soma += entradas[i] * this.pesos[i];
    }

    const resultado = Math.tanh(soma).toFixed() || 0;
    // console.log("Saída da IA:", resultado);

    return resultado;
  }

  // Alimenta entradas na rede neural (simulada) e retorna uma decisão
  // processarEntradas(entradas) {
  //   let soma = 0;
  //   for (let i = 0; i < this.pesos.length; i++) {
  //     soma += entradas[i] * this.pesos[i];
  //   }
  //   return Math.tanh(soma).toFixed() || 0; // Usa tangente hiperbólica como ativação
  // }
}
