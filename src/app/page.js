import dynamic from 'next/dynamic';

const BoidsSim = dynamic(() => import('@/components/BoidsSim'), { ssr: false });
const FractalTreeSim = dynamic(() => import('@/components/fractals/FractalTreeSim'), { ssr: false });
const sims = [
  <BoidsSim key="boids" showSettings={false} />,
  <FractalTreeSim
    key="fractal1"
    args={{ showSettings: false, loop: true, speed: 12, depth: 11, length: 335, waitOnCompletion: 1 }}
  />,
  <FractalTreeSim
    key="fractal2"
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

export default function Home() {
  const randomSim = sims[Math.floor(Math.random() * sims.length)];
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <div className="absolute w-full h-full -z-10">{randomSim}</div>
      <div className="relative -top-[12.5%]">
        <div className="m-4 text-center ">
          <h1 className="mb-1 text-4xl">Algo Sim</h1>
          <span>
            by <a href="https://jonasseifried.com/">Jonas Seifried</a>
          </span>
        </div>
        <p>Some simulations I made for fun :)</p>
      </div>
    </div>
  );
}
