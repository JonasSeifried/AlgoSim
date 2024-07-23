'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const BoidsSim = dynamic(() => import('@/components/BoidsSim'), { ssr: false });
const FractalTreeSim = dynamic(() => import('@/components/fractals/FractalTreeSim'), { ssr: false });

const sims = [
  <BoidsSim key="boids" showSettings={false} />,
  <FractalTreeSim
    key="fractalTree1"
    args={{ showSettings: false, loop: true, speed: 12, depth: 12, length: 335, waitOnCompletion: 2, opacity: 0.45 }}
  />,
  <FractalTreeSim
    key="fractalTree2"
    args={{
      showSettings: false,
      loop: true,
      speed: 12,
      depth: 12,
      length: 335,
      waitOnCompletion: 2,
      opacity: 0.45,
      branch1: { angle: -66 },
    }}
  />,
  <FractalTreeSim
    key="fractalTree3"
    args={{
      showSettings: false,
      loop: true,
      speed: 15,
      depth: 6,
      length: 750,
      waitOnCompletion: 5,
      opacity: 0.45,
      branch0: { angle: -125, scale: 1 },
      branch1: { angle: 125, scale: 1 },
      branch2: { angle: -90, scale: 1 },
      branch3: { angle: 90, scale: 1 },
    }}
  />,
  <FractalTreeSim
    key="fractalTree4"
    args={{
      showSettings: false,
      loop: true,
      speed: 15,
      depth: 8,
      length: 310,
      waitOnCompletion: 5,
      opacity: 0.25,
      branch0: { angle: -100, scale: 1 },
      branch1: { angle: 100, scale: 1 },
      branch2: { angle: -5, scale: 1 },
      branch3: { angle: 5, scale: 1 },
    }}
  />,
  <FractalTreeSim
    key="fractalTree5"
    args={{
      showSettings: false,
      loop: true,
      speed: 15,
      depth: 11,
      length: 390,
      waitOnCompletion: 5,
      opacity: 0.25,
      branch0: { angle: -110, scale: 0.85 },
      branch1: { angle: 110, scale: 0.85 },
      branch2: { angle: 0, scale: 0.85 },
      branch3: { angle: 0, scale: 0 },
    }}
  />,
  <FractalTreeSim
    key="fractalTree6"
    args={{
      showSettings: false,
      loop: true,
      speed: 15,
      depth: 10,
      length: 450,
      waitOnCompletion: 5,
      opacity: 0.25,
      branch0: { angle: 40, scale: 0.85 },
      branch1: { angle: -40, scale: 0.85 },
      branch2: { angle: 140, scale: 0.85 },
      branch3: { angle: -140, scale: 0.85 },
    }}
  />,
];

const RandomSim = ({ className }) => {
  const getRandomSim = () => {
    return sims[Math.floor(Math.random() * sims.length)];
  };
  const [randomSim, setRandomSim] = useState(getRandomSim());
  const changeSim = () => {
    setRandomSim((oldSim) => {
      let newSim;
      do {
        newSim = getRandomSim();
      } while (oldSim === newSim);
      return newSim;
    });
  };

  return (
    <div className={className}>
      <div className="relative w-full h-full">
        {randomSim}
        <button onClick={changeSim} className="absolute bottom-10 right-10 hover:scale-110">
          refresh
        </button>
      </div>
    </div>
  );
};

export default RandomSim;
