/**
 * @typedef {import('p5')} p5
 */
/**
 * @param {p5} p
 */
export default function fractalTreeSketch(p, args) {
  const parentDiv = document.getElementById('fractal-tree-sim');

  const [lengthSlider, lengthSliderLabel] = createSliderWithLabel('length', 0, 200, 100, 1, 20, 10);
  const [speedSlider, speedSliderLabel] = createSliderWithLabel('speed', 0, 10, 5, 0.1, 20, 45);

  function createSliderWithLabel(label, min, max, value, step, x, y) {
    const sliderLabel = p.createP(label).position(x, y);
    const slider = p.createSlider(min, max, value, step).position(x, y + 15);
    return [slider, sliderLabel];
  }

  p.setup = () => {
    if (args && !args.showSettings) {
      lengthSlider.hide();
      lengthSliderLabel.hide();
      speedSlider.hide();
      speedSliderLabel.hide();
      separationSlider.hide();
      separationSliderLabel.hide();
      alignmentSlider.hide();
      alignmentSliderLabel.hide();
      cohesionSlider.hide();
      cohesionSliderLabel.hide();
      perceptionRadiusSlider.hide();
      perceptionRadiusSliderLabel.hide();
      showBoidsSightCheckbox.hide();
    }
    p.createCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
  };

  p.draw = () => {
    p.clear();
    p.translate(p.width / 2, p.height);
    p.stroke(255);
    p.line(0, 0, 0, lengthSlider.value());
  };

  p.windowResized = () => {
    p.resizeCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
  };
}
