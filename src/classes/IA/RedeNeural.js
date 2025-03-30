// class RedeNeural {
//   constructor(
//     tamanhoEntrada,
//     tamanhoSaida,
//     neuroniosOcultos = 12,
//     taxaAprendizado = 0.1
//   ) {
//     this.tamanhoEntrada = tamanhoEntrada;
//     this.tamanhoSaida = tamanhoSaida;
//     this.neuroniosOcultos = neuroniosOcultos;
//     this.taxaAprendizado = taxaAprendizado;

//     // Inicializa pesos e vieses com valores pequenos e aleatórios
//     this.pesosEntradaOculta = Array.from({ length: tamanhoEntrada }, () =>
//       Array.from({ length: neuroniosOcultos }, () => Math.random() * 0.1 - 0.05)
//     );
//     this.pesosOcultaSaida = Array.from({ length: neuroniosOcultos }, () =>
//       Array.from({ length: tamanhoSaida }, () => Math.random() * 0.1 - 0.05)
//     );
//     this.biasOculta = Array.from(
//       { length: neuroniosOcultos },
//       () => Math.random() * 0.1 - 0.05
//     );
//     this.biasSaida = Array.from(
//       { length: tamanhoSaida },
//       () => Math.random() * 0.1 - 0.05
//     );
//   }

//   ativacao(x) {
//     return 1 / (1 + Math.exp(-x)); // Sigmoide
//   }

//   derivadaAtivacao(x) {
//     return x * (1 - x); // Derivada da sigmoide
//   }

//   alimentarEntrada(entradas) {
//     if (entradas.length !== this.tamanhoEntrada) {
//       throw new Error(
//         `Tamanho das entradas (${entradas.length}) não corresponde ao esperado (${this.tamanhoEntrada}).`
//       );
//     }

//     // Calcula a saída da camada oculta
//     this.saidaOculta = this.biasOculta.map((bias, i) => {
//       const soma = entradas.reduce(
//         (acc, entrada, j) => acc + entrada * this.pesosEntradaOculta[j][i],
//         bias
//       );
//       return this.ativacao(soma);
//     });

//     // Calcula a saída final
//     this.saidaFinal = this.biasSaida.map((bias, i) => {
//       const soma = this.saidaOculta.reduce(
//         (acc, saida, j) => acc + saida * this.pesosOcultaSaida[j][i],
//         bias
//       );
//       return this.ativacao(soma);
//     });

//     return this.saidaFinal;
//   }

//   treinar(entradas, saidas, epocas = 10000) {
//     for (let epoca = 0; epoca < epocas; epoca++) {
//       entradas.forEach((entrada, index) => {
//         const saidaEsperada = saidas[index];
//         const saidaCalculada = this.alimentarEntrada(entrada);

//         // Calcula o erro da camada de saída
//         const erroSaida = saidaEsperada.map(
//           (esperado, i) => esperado - saidaCalculada[i]
//         );

//         // Calcula o erro da camada oculta
//         const erroOculta = this.saidaOculta.map(
//           (_, i) =>
//             this.pesosOcultaSaida[i].reduce(
//               (acc, peso, j) => acc + erroSaida[j] * peso,
//               0
//             ) * this.derivadaAtivacao(this.saidaOculta[i])
//         );

//         // Atualiza os pesos e vieses para a camada de saída
//         this.pesosOcultaSaida = this.pesosOcultaSaida.map((pesos, i) =>
//           pesos.map(
//             (peso, j) =>
//               peso + this.taxaAprendizado * erroSaida[j] * this.saidaOculta[i]
//           )
//         );
//         this.biasSaida = this.biasSaida.map(
//           (bias, i) => bias + this.taxaAprendizado * erroSaida[i]
//         );

//         // Atualiza os pesos e vieses para a camada oculta
//         this.pesosEntradaOculta = this.pesosEntradaOculta.map((pesos, i) =>
//           pesos.map(
//             (peso, j) =>
//               peso + this.taxaAprendizado * erroOculta[j] * entrada[i]
//           )
//         );
//         this.biasOculta = this.biasOculta.map(
//           (bias, i) => bias + this.taxaAprendizado * erroOculta[i]
//         );
//       });

//       // Exibe o progresso a cada 1000 épocas (opcional)
//       if (epoca % 1000 === 0) {
//         console.log(
//           `Época ${epoca}: Erro médio = ${this.calcularErroMedio(entradas, saidas)}`
//         );
//       }
//     }
//   }

//   calcularErroMedio(entradas, saidas) {
//     return (
//       entradas.reduce((erroTotal, entrada, index) => {
//         const saidaCalculada = this.alimentarEntrada(entrada);
//         const saidaEsperada = saidas[index];
//         const erro = saidaEsperada.reduce(
//           (erroParcial, esperado, i) =>
//             erroParcial + Math.pow(esperado - saidaCalculada[i], 2),
//           0
//         );
//         return erroTotal + erro;
//       }, 0) / entradas.length
//     );
//   }

//   ajustarPesos(recompensa) {}
// }
