function O() {
  return <div className="absolute bg-white h-[729.2px] left-0 top-0 w-[1536px]" data-name="o2" />;
}

function Span() {
  return (
    <div className="h-[16.25px] relative shrink-0 w-[8px]" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[16.25px] left-[4.5px] not-italic text-[11.375px] text-center text-white top-[-0.6px] whitespace-nowrap">A</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative rounded-[6.125px] shrink-0 size-[26px]" data-name="Container" style={{ backgroundImage: "linear-gradient(135deg, rgb(51, 65, 85) 0%, rgb(30, 41, 59) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Span />
      </div>
    </div>
  );
}

function Span1() {
  return (
    <div className="flex-[1_0_0] h-[19.5px] min-h-px min-w-px relative" data-name="span">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[61px] not-italic text-[13px] text-center text-white top-[-0.2px] whitespace-nowrap">Adapta Brand Studio</p>
      </div>
    </div>
  );
}

function Div() {
  return (
    <div className="absolute content-stretch flex gap-[6.5px] h-[26px] items-center left-[19.5px] top-[13px] w-[155.156px]" data-name="div">
      <Container />
      <Span1 />
    </div>
  );
}

function MotionDiv() {
  return <div className="absolute bg-[#1e293b] h-[55.958px] left-[-7.39px] opacity-41 rounded-[13421800px] top-[-1.98px] w-[208.765px]" data-name="motion.div" />;
}

function MotionButton() {
  return (
    <div className="absolute bg-[#1e293b] border-2 border-[#e2e8f0] border-solid h-[56px] left-[1318.34px] rounded-[13421800px] shadow-[0px_25px_50px_0px_rgba(0,0,0,0.25)] top-[653.7px] w-[198.156px]" data-name="motion.button">
      <Div />
      <MotionDiv />
    </div>
  );
}

export default function MarketingView() {
  return (
    <div className="bg-white relative size-full" data-name="marketing view">
      <O />
      <MotionButton />
    </div>
  );
}