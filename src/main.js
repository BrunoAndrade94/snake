function setup() {
  mainSetup();
}

function draw() {
  mainDraw();
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    COBRA.mudarDirecao(createVector(-1, 0));
  } else if (keyCode === RIGHT_ARROW) {
    COBRA.mudarDirecao(createVector(1, 0));
  } else if (keyCode === UP_ARROW) {
    COBRA.mudarDirecao(createVector(0, -1));
  } else if (keyCode === DOWN_ARROW) {
    COBRA.mudarDirecao(createVector(0, 1));
  }
}
