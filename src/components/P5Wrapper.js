'use client';

import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import dynamic from 'next/dynamic';

const P5Wrapper = ({ sketch, args }) => {
  const sketchRef = useRef();

  useEffect(() => {
    const p5Instance = new p5((p) => sketch(p, args), sketchRef.current);
    p5Instance.setup = () => {
      p5Instance.args = args;
      p5Instance.setup();
    };

    return () => {
      p5Instance.remove();
    };
  }, [sketch, args]);

  return <div ref={sketchRef} className="w-full h-full"></div>;
};

export default dynamic(() => Promise.resolve(P5Wrapper), {
  ssr: false,
});
