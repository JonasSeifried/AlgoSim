/**
 * @typedef {import('p5')} p5
 */
/**
 * @param {p5} p
 */
export default function fractalTreeSketch(p, args) {
  const parentDiv = document.getElementById('fractal-tree-sim');

  const [speedSlider, speedSliderLabel] = createSliderWithLabel('speed', 0, 20, 4, 1, 20, 10);
  const [lengthSlider, lengthSliderLabel] = createSliderWithLabel('length', 0, 500, 350, 1, 20, 45);
  const [depthSlider, depthSliderLabel] = createSliderWithLabel('depth', 0, 10, 5, 1, 20, 80);
  const [angleSlider, angleSliderLabel] = createSliderWithLabel('angle', 0, 90, 26, 1, 20, 115);
  const [branchSlider, branchSliderLabel] = createSliderWithLabel('branches', 0, 5, 2, 1, 20, 150);
  const loopCheckbox = p.createCheckbox('loop', true).position(20, 185);

  function createSliderWithLabel(label, min, max, value, step, x, y) {
    const sliderLabel = p.createP(label).position(x, y);
    const slider = p.createSlider(min, max, value, step).position(x, y + 15);
    return [slider, sliderLabel];
  }

  let depth = 0;

  p.setup = () => {
    if (args && !args.showSettings) {
      lengthSlider.hide();
      lengthSliderLabel.hide();
      speedSlider.hide();
      speedSliderLabel.hide();
      depthSlider.hide();
      depthSliderLabel.hide();
      angleSlider.hide();
      angleSliderLabel.hide();
      branchSlider.hide();
      branchSliderLabel.hide();
      loopCheckbox.hide();
    }
    p.createCanvas(parentDiv.clientWidth, parentDiv.clientHeight);

    depthSlider.input(() => {
      if (depth > depthSlider.value()) depth = depthSlider.value();
    });
  };

  p.draw = () => {
    p.clear();
    p.translate(p.width / 2, p.height);
    p.angleMode(p.DEGREES);
    branch(lengthSlider.value(), 0, depth);

    if (depth >= depthSlider.value()) {
      if (loopCheckbox.checked()) depth = 0;
      return;
    }
    if (p.frameCount % (p.getTargetFrameRate() / speedSlider.value()) === 0) depth++;
  };

  p.windowResized = () => {
    p.resizeCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
  };

  function branch(len, depth, maxDepth) {
    if (depth === maxDepth) return;
    p.line(0, 0, 0, -len);
    p.translate(0, -len);

    for (let i = 1; i < branchSlider.value() + 1; i++) {
      p.push();
      p.rotate(angleSlider.value() * (i % 2 === 0 ? i - 1 : -i));
      branch(len * 0.67, depth + 1, maxDepth);
      p.pop();
    }
  }
}
