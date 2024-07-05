/**
 * @typedef {import('p5')} p5
 */
/**
 * @param {p5} p
 */
export default function fractalTreeSketch(p, args) {
  const parentDiv = document.getElementById('fractal-tree-sim');

  let branchLengthCache = {};
  let maxDepth;
  let currentMaxDepth = 0;
  let freezeAnimation = false;
  let lastAnimationDepth = 0;
  const maxLength = 500;

  const [speedSlider, speedSliderLabel] = createSliderWithLabel('speed', 0, 20, 20, 1, 20, 10);
  const [lengthSlider, lengthSliderLabel] = createSliderWithLabel('length', 0, maxLength, 350, 1, 20, 45);
  const [depthSlider, depthSliderLabel] = createSliderWithLabel('depth', 0, 15, 5, 1, 20, 80);
  const loopCheckbox = p.createCheckbox('loop', false).position(20, 185);
  const branch0 = createBranchSettings(1, 45, 1, 20, 240);
  const branch1 = createBranchSettings(2, -45, 1, 20, 320);
  const branch2 = createBranchSettings(3, 90, 0, 20, 400);
  const branch3 = createBranchSettings(4, -90, 0, 20, 480);
  const branches = [branch0, branch1, branch2, branch3];

  function createSliderWithLabel(label, min, max, value, step, x, y) {
    const sliderLabel = p.createP(label).position(x, y);
    const slider = p.createSlider(min, max, value, step).position(x, y + 15);
    return [slider, sliderLabel];
  }

  function createBranchSettings(number, angle, scale, x, y) {
    const settingsDiv = p.createDiv().position(x, y);
    settingsDiv.addClass('flex items-center gap-2 border-2 shadow-xl border-gray border-solid');
    const angleDiv = p.createDiv().parent(settingsDiv);
    angleDiv.addClass('flex flex-col p-2');
    p.createP(`angle ${number}`).parent(angleDiv);
    const angleInputDiv = p.createDiv().addClass('flex items-center gap-2').parent(angleDiv);
    const angleSlider = p
      .createSlider(-180, 180, angle, 1)
      .size(100)
      .input(() => {
        angleInput.value(angleSlider.value());
      })
      .parent(angleInputDiv);
    const angleInput = p
      .createInput(angle, 'number')
      .size(60)
      .attribute('min', '-180')
      .attribute('max', '180')
      .input(() => {
        angleSlider.value(angleInput.value());
      })
      .parent(angleInputDiv);
    const scaleDiv = p.createDiv().addClass(' flex flex-col p-2 h-full').parent(settingsDiv);
    p.createP(`scale ${number}`).parent(scaleDiv);
    const scaleSlider = p
      .createSlider(0, 1, scale, 0.1)
      .size(100)
      .input(() => {
        scaleInput.value(scaleSlider.value());
      })
      .parent(scaleDiv);
    const scaleInput = p
      .createInput(scale, 'number')
      .size(60)
      .attribute('min', '0')
      .attribute('max', '1')
      .input(() => {
        scaleSlider.value(scaleInput.value());
      })
      .parent(scaleDiv);

    return { settingsDiv, angleSlider, scaleSlider };
  }

  p.setup = () => {
    if (args) {
      if (!args.showSettings) {
        lengthSlider.hide();
        lengthSliderLabel.hide();
        speedSlider.hide();
        speedSliderLabel.hide();
        depthSlider.hide();
        depthSliderLabel.hide();

        loopCheckbox.hide();

        for (let branch of branches) {
          branch.settingsDiv.hide();
        }
      }
      if (args.loop) loopCheckbox.checked(args.loop);
      if (args.speed) speedSlider.value(args.speed);
      if (args.length) lengthSlider.value(args.length);
      if (args.depth) depthSlider.value(args.depth);
      for (let i = 0; i <= branches.length; i++) {
        if (args[`branch${i}`] && args[`branch${i}`].angle) branches[i].angleSlider.value(args[`branch${i}`].angle);
        if (args[`branch${i}`] && args[`branch${i}`].scale) branches[i].scaleSlider.value(args[`branch${i}`].scale);
      }
    }

    p.frameRate(60);
    p.createCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
    maxDepth = depthSlider.value();
    depthSlider.input(() => {
      if (currentMaxDepth > depthSlider.value()) currentMaxDepth = depthSlider.value();
      maxDepth = depthSlider.value();
    });
  };

  p.draw = () => {
    if (p.frameCount % (p.getTargetFrameRate() / speedSlider.value()) === 0) currentMaxDepth++;

    if (freezeAnimation) return;
    if (currentMaxDepth === lastAnimationDepth) return;
    p.clear();
    p.translate(p.width / 2, p.height);
    p.angleMode(p.DEGREES);
    p.strokeWeight(10);
    branch(lengthSlider.value(), 0);
    lastAnimationDepth = currentMaxDepth;

    if (currentMaxDepth >= depthSlider.value()) {
      if (loopCheckbox.checked()) {
        if (args && args.waitOnCompletion) {
          freezeAnimation = true;
          setTimeout(() => {
            currentMaxDepth = 0;
            freezeAnimation = false;
          }, args.waitOnCompletion * 1000);
          return;
        }
        currentMaxDepth = 0;
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
  };

  function branch(len, depth) {
    if (depth === currentMaxDepth || len < 1) return;

    if (!branchLengthCache[len]) {
      branchLengthCache[len] = {};
    }
    if (!branchLengthCache[len][depth]) {
      branchLengthCache[len][depth] = len * 0.67;
    }
    p.strokeWeight(p.map(len, 0, maxLength, 1, 5));
    p.line(0, 0, 0, -len);
    p.translate(0, -len);

    const newLength = branchLengthCache[len][depth];
    const newDepth = depth + 1;
    //const opacity = p.map(depth - 1, 0, maxDepth, 255, 0);
    const branchData = branches.map((b) => ({
      angle: b.angleSlider.value(),
      scale: b.scaleSlider.value(),
    }));

    for (let b of branchData) {
      p.push();
      p.rotate(b.angle);
      branch(newLength * b.scale, newDepth);
      p.pop();
    }
  }
}
