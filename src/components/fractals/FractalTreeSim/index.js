'use client';

import React from 'react';
import P5Wrapper from '@/components/P5Wrapper';
import fractalTreeSketch from './fractalTreeSketch';

const FractalTreeSim = ({ showSettings }) => {
  return (
    <div id="fractal-tree-sim" className="relative w-full h-full text-black">
      <P5Wrapper sketch={fractalTreeSketch} args={{ showSettings: showSettings }} />
    </div>
  );
};

export default FractalTreeSim;
