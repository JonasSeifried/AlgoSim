'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import boidsSketch from './boidsSketch';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

const BoidsSim = ({ showSettings }) => {
  return (
    <div id="boids-sim" className="relative w-full h-full text-black">
      <P5Wrapper sketch={boidsSketch} args={{ showSettings: showSettings }} />
    </div>
  );
};

export default BoidsSim;
