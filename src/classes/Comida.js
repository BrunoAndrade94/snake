class Comida {
  constructor(quantidade = 5) {
    this.quantidade = quantidade;
    this.posicao = createVector(0, 0);
    this.tamanho = 20;
    this.comidaGerada = 0;

    this.gerarComidaAleatoria();
  }

  gerarComidaAleatoria() {
    let colunas = floor(LARGURA / this.tamanho);
    let linhas = floor(ALTURA / this.tamanho);

    this.posicao = createVector(floor(random(colunas)), floor(random(linhas)));
  }

  desenhar() {
    fill(200, 22, 220);
    noStroke();
    rect(
      this.posicao.x * this.tamanho,
      this.posicao.y * this.tamanho,
      this.tamanho,
      this.tamanho
    );
  }
}
