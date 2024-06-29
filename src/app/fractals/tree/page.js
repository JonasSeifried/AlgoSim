import FractalTreeSim from '@/components/fractals/FractalTreeSim';

export default function Page() {
  return <FractalTreeSim showSettings={true} />;
}

export const metadata = {
  title: 'Fractal Tree Simulation',
  description: 'A simple fracal tree simulation',
};
