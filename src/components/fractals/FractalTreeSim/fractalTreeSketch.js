/**
 * @typedef {import('p5')} p5
 */
/**
 * @param {p5} p
 */
export default function fractalTreeSketch(p, args) {
  const parentDiv = document.getElementById('fractal-tree-sim');

  const branchLengthCache = {};
  const strokeWeightCache = {};
  let treeStack = {}
  let currentMaxDepth = 0;
  let freezeAnimation = false;
  let lastAnimationDepth = 0;
  let settingsChanged = true;
  const maxLength = 500;
  const maxDepth = 15;

  const [speedSlider, speedSliderLabel] = createSliderWithLabel('speed', 0, 20, 20, 1, 20, 10);
  const [lengthSlider, lengthSliderLabel] = createSliderWithLabel('length', 0, maxLength, 350, 1, 20, 45);
  const [depthSlider, depthSliderLabel] = createSliderWithLabel('depth', 0, maxDepth, 5, 1, 20, 80);
  const loopCheckbox = p.createCheckbox('loop', false).position(20, 165);
  const freezeTimerInput = p.createInput(0.5, 'number').attribute('min', '0').attribute('step', '0.25').size(50).position(70, 165).hide();
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
        settingsChanged = true
      })
      .parent(angleInputDiv);
    const angleInput = p
      .createInput(angle, 'number')
      .size(60)
      .attribute('min', '-180')
      .attribute('max', '180')
      .input(() => {
        angleSlider.value(angleInput.value());
        settingsChanged = true
      })
      .parent(angleInputDiv);
    const scaleDiv = p.createDiv().addClass(' flex flex-col p-2 h-full').parent(settingsDiv);
    p.createP(`scale ${number}`).parent(scaleDiv);
    const scaleSlider = p
      .createSlider(0, 1, scale, 0.01)
      .size(100)
      .input(() => {
        scaleInput.value(scaleSlider.value());
        settingsChanged = true
      })
      .parent(scaleDiv);
    const scaleInput = p
      .createInput(scale, 'number')
      .size(60)
      .attribute('min', '0')
      .attribute('max', '1')
      .attribute('step', '0.01')
      .input(() => {
        scaleSlider.value(scaleInput.value());
        settingsChanged = true
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

        for (const branch of branches) {
          branch.settingsDiv.hide();
        }
      }
      if (args.loop) loopCheckbox.checked(args.loop);
      if (args.speed) speedSlider.value(args.speed);

      if (args.length) lengthSlider.value(args.length);
      if (args.depth) depthSlider.value(args.depth);
      if (args.waitOnCompletion) freezeTimerInput.value(args.waitOnCompletion)
      for (let i = 0; i <= branches.length; i++) {
        if (args[`branch${i}`] && args[`branch${i}`].angle) branches[i].angleSlider.value(args[`branch${i}`].angle);
        if (args[`branch${i}`] && args[`branch${i}`].scale) branches[i].scaleSlider.value(args[`branch${i}`].scale);
      }
    }

    p.createCanvas(parentDiv.clientWidth, parentDiv.clientHeight);

    //INFO: ALL input events that should result in a rerender need to set `settingsChanged` to `true` 
    depthSlider.input(() => {
      if (currentMaxDepth > depthSlider.value()) currentMaxDepth = depthSlider.value();
      // settingsChanged = true
    });
    lengthSlider.input(() => settingsChanged =  true)
    loopCheckbox.input(() => {
      if (loopCheckbox.checked()) freezeTimerInput.show()
      else freezeTimerInput.hide()
        settingsChanged =  true
    })
  };

  p.draw = () => {
   if (settingsChanged) treeStack = populateTreeStack()
    if (freezeAnimation) return;
    if (currentMaxDepth < depthSlider.value() && p.frameCount % (p.getTargetFrameRate() / speedSlider.value()) === 0) currentMaxDepth++;

    // Do not rerender if depth stayed the same
    if (!settingsChanged && currentMaxDepth === lastAnimationDepth) return;
    p.clear();
    p.translate(p.width / 2, p.height);
    p.strokeWeight(10);
    p.fill(0)
    console.time("drawing tree")
    for(let i = 0; i < depthSlider.value(); i++) {
        p.strokeWeight(p.map(i, 0, depthSlider.value(), 5, 1))
        const nodes = treeStack[i]
      console.log(nodes.length)
        if (nodes.length > 10_000) {
          const firstNode = nodes[0]
          const lastNode = nodes[nodes.length - 1]
          console.time("drawing Shape")
          p.beginShape()
          p.vertex(firstNode.x1, firstNode.y1)
          p.vertex(firstNode.x2, firstNode.y2)
          p.vertex(lastNode.x1, lastNode.y1)
          p.vertex(lastNode.x2, lastNode.y2)
          p.endShape(p.CLOSE)
          console.timeEnd("drawing Shape")
          continue
        }
      for (const node of treeStack[i]) {
        p.line(node.x1, node.y1, node.x2, node.y2)
      }
    }
    console.timeEnd("drawing tree")
    lastAnimationDepth = currentMaxDepth;
    settingsChanged = false
    if (currentMaxDepth >= depthSlider.value()) {
      if (loopCheckbox.checked()) {
        currentMaxDepth = 0;
        const freezeTime = parseFloat(freezeTimerInput.value())
        if (freezeTime > 0) {
          freezeAnimation = true;
          setTimeout(() => {

            freezeAnimation = false;
          }, freezeTime * 1000);
        }
      }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(parentDiv.clientWidth, parentDiv.clientHeight);
  };

  function populateTreeStack() {
    console.time("Calualting tree...")
    const branchData = branches.map((b) => ({
      angle: b.angleSlider.value() * (p.PI/180),
      scale: b.scaleSlider.value(),
    }));

    const maxLength = lengthSlider.value()

    const stack = {}
    stack[0] = [{x1: 0, y1: 0, x2: 0, y2: -maxLength, angle: 0 - 90 * p.PI / 180, length: maxLength}]

    for (let i = 1; i < maxDepth + 1; i++) {
      stack[i] = []
      if (stack[i-1].length > 500000) continue

      for (const node of stack[i-1]) {
        for (const b of branchData) {
          const len = node.length * 0.67 * b.scale
          const x1 = node.x2
          const y1 = node.y2
          const angle = node.angle + b.angle 
          const x2 = x1 + len * Math.cos(angle)
          const y2 = y1 + len * Math.sin(angle)
          stack[i].push({x1: x1, y1: y1, x2: x2, y2: y2, angle: angle, length: len}) 
        }
      }
    }
    console.timeEnd("Calualting tree...")
    return stack
  }

  function branch(len, depth, branchData) {
    if (depth === currentMaxDepth) return;
    if (!branchLengthCache[len]) branchLengthCache[len] = {};
    if (!branchLengthCache[len][depth]) branchLengthCache[len][depth] = len * 0.67;

    if (!strokeWeightCache[maxDepth]) strokeWeightCache[maxDepth] = {}
    if (!strokeWeightCache[maxDepth][len]) strokeWeightCache[maxDepth][len] = p.map(len, 0, maxLength, 1, 5)

    p.strokeWeight(strokeWeightCache[maxDepth][len]);
    p.line(0, 0, 0, -len);
    p.translate(0, -len);

    if (len <= 1.33) return

    const newLength = branchLengthCache[len][depth];
    const newDepth = depth + 1;
    //const opacity = p.map(depth - 1, 0, maxDepth, 255, 0);

    for (const b of branchData) {
      p.push();
      p.rotate(b.angle);
      branch(newLength * b.scale, newDepth, branchData);
      p.pop();
    }
  }
}
