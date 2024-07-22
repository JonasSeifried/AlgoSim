import dynamic from "next/dynamic";

const RandomSim = dynamic(() => import('@/components/RandomSim'), { ssr: false });

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      <div className="relative -top-[12.5%]">
        <div className="m-4 text-center ">
          <h1 className="mb-1 text-4xl">Algo Sim</h1>
          <span>
            by <a href="https://jonasseifried.com/">Jonas Seifried</a>
          </span>
        </div>
        <p>Some simulations I made for fun :)</p>
      </div>
      <RandomSim className="absolute top-0 z-10 w-full h-full" />
    </div>
  );
}
