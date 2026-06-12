import React from "react";

export default function FuturisticBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-[radial-gradient(#ffffff10_0.8px,transparent_1px)] bg-[length:40px_40px] pointer-events-none z-[-1]" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none z-[-1]" />
    </>
  );
}
