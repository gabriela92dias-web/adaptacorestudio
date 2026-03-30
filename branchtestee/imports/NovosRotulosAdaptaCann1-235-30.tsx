

import { imgVector, imgRectangle2 } from "./svg-xedgc";

function Group3() {
  return (
    <div className="absolute contents inset-[0_0.96%_1.92%_0.96%]" data-name="Group">
      <div className="absolute inset-[0_0.96%_1.92%_0.96%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.001px_0px] mask-size-[15.693px_17.654px]" data-name="Rectangle" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={""} />
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[0_0.96%_1.92%_0.96%]" data-name="Group">
      <Group3 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[0_0.96%_1.92%_0.96%]" data-name="Group">
      <Group2 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[0_0.96%_1.92%_0.96%]" data-name="Group">
      <div className="absolute inset-[0_0.96%_1.92%_0.96%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.001px_0px] mask-size-[15.693px_17.654px]" data-name="Rectangle" style={{ maskImage: `url('${imgVector}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={""} />
        </div>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[0_0.96%_1.92%_0.96%]" data-name="Group">
      <Group5 />
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents inset-[0_0.96%_1.92%_0.96%]" data-name="Mask group">
      <Group1 />
      <Group4 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[0_0.96%_1.92%_0.96%]" data-name="Group">
      <div className="absolute inset-[0_0.96%_1.92%_0.96%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_0px] mask-size-[15.693px_17.654px]" data-name="Vector" style={{ maskImage: `url('${imgVector}')` }}>
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.6932 17.6544">
          <path d="M0 0H15.6932V17.6544H0V0Z" fill="var(--fill-0, white)" id="Vector" />
        </svg>
      </div>
      <MaskGroup />
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-[0_0.96%_1.92%_0.96%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[0.13%_0.96%_1.79%_0.96%]" data-name="Group">
      <div className="absolute inset-[0.13%_0.96%_1.79%_0.96%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.001px_0px] mask-size-[15.693px_17.631px]" data-name="Rectangle" style={{ maskImage: `url('${imgRectangle2}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={""} />
        </div>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[0.13%_0.96%_1.79%_0.96%]" data-name="Group">
      <Group9 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[0.13%_0.96%_1.79%_0.96%]" data-name="Group">
      <Group8 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[0.13%_0.96%_1.79%_0.96%]" data-name="Group">
      <div className="absolute inset-[0.13%_0.96%_1.79%_0.96%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.001px_0px] mask-size-[15.693px_17.631px]" data-name="Rectangle" style={{ maskImage: `url('${imgRectangle2}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={""} />
        </div>
      </div>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[0.13%_0.96%_1.79%_0.96%]" data-name="Group">
      <Group11 />
    </div>
  );
}

function MaskGroup1() {
  return (
    <div className="absolute contents inset-[0.13%_0.96%_1.79%_0.96%]" data-name="Mask group">
      <Group7 />
      <Group10 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[0.13%_0.96%_1.79%_0.96%]" data-name="Group">
      <MaskGroup1 />
    </div>
  );
}

function ClipPathGroup1() {
  return (
    <div className="absolute contents inset-[0.13%_0.96%_1.92%_0.96%]" data-name="Clip path group">
      <Group6 />
    </div>
  );
}

export default function NovosRotulosAdaptaCann() {
  return (
    <div className="relative size-full" data-name="NOVOS RÓTULOS ADAPTA-CANN  1">
      <ClipPathGroup />
      <ClipPathGroup1 />
    </div>
  );
}