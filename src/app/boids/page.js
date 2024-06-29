import dynamic from 'next/dynamic';

const BoidsSim = dynamic(() => import('@/components/BoidsSim'), { ssr: false });

export default function Page() {
  return <BoidsSim showSettings={true} />;
}

export const metadata = {
  title: 'Boids Simulation',
  description: 'A simple boids simulation',
};
