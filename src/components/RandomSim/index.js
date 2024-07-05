'use client';

import dynamic from 'next/dynamic';

const BoidsSim = dynamic(() => import('@/components/BoidsSim'), { ssr: false });
const FractalTreeSim = dynamic(() => import('@/components/fractals/FractalTreeSim'), { ssr: false });

const sims = [
  <BoidsSim key="boids" showSettings={false} />,
  <FractalTreeSim
    key="fractalTree1"
    args={{ showSettings: false, loop: true, speed: 12, depth: 11, length: 335, waitOnCompletion: 1 }}
  />,
  <FractalTreeSim
    key="fractalTree2"
    args={{
      showSettings: false,
      loop: true,
      speed: 12,
      depth: 11,
      length: 335,
      waitOnCompletion: 1,
      branch1: { angle: -66 },
    }}
  />,
];



const RandomSim = () => {
  
    const randomSim = sims[Math.floor(Math.random() * sims.length)]

    return <div className="absolute w-full h-full -z-10">
        {randomSim}
        </div>
}

export default RandomSim