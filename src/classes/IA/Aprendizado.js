// class Aprendizado {
//   constructor(redeNeural) {
//     this.redeNeural = redeNeural;
//   }

//   treinamentoSupervisionado(dadosSimulados, epocas = 1000) {
//     const dados = dadosSimulados.getDados();
//     for (let epoca = 0; epoca < epocas; epoca++) {
//       dados.forEach(({ entrada, saida }) => {
//         this.redeNeural.treinar(entrada, saida);
//       });
//     }
//   }

//   treinarReforco() {
//     let recompensa = 0;
//     while (!COBRA.colidiu) {
//       const entrada = COBRA.calcularEntradas(COMIDA);
//       const saida = this.redeNeural.alimentarEntrada(entrada);

//       COBRA.mudarDirecao(saida);

//       if (COBRA.seColidiuComida()) recompensa += 10;
//       if (COBRA.seColidiuParede() || COBRA.seColidiuCorpo()) recompensa -= 100;

//       this.redeNeural.ajustarPesos(recompensa);
//     }
//   }

//   treinarAlgoritmoGeneticos(populacao, geracoes = 50) {
//     for (let geracao = 0; geracao < geracoes; geracao++) {
//       populacao.forEach((individuo) => {
//         individuo.avaliar();
//       });
//     }
//   }
// }
