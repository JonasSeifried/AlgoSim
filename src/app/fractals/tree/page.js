import dynamic from 'next/dynamic';

const FractalTreeSim = dynamic(() => import('@/components/fractals/FractalTreeSim'), { ssr: false });

export default function Page() {
  return <FractalTreeSim showSettings={true} />;
}

export const metadata = {
  title: 'Fractal Tree Simulation',
  description: 'A simple fracal tree simulation',
};
