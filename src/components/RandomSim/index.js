'use client';
import { useState } from 'react'; 
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



const RandomSim = ({ className }) => {

  const getRandomSim = () => { return sims[Math.floor(Math.random() * sims.length)] }

  const [randomSim, setRandomSim] = useState(getRandomSim());
    const changeSim = () => {
      setRandomSim(oldSim => {
      let newSim;
      do {
        newSim = getRandomSim()
      }
        while(oldSim === newSim)
      return newSim;
    }
      )
    }

    return <div className={className}>
      <div className='relative w-full h-full'>
        {randomSim}
        <button onClick={changeSim} className="absolute bottom-10 right-10 hover:scale-110">refresh</button>
      </div>
    </div>
}

export default RandomSim
