"use client";

import Image from "next/image";

interface BurgerProps {
  toggle: () => void;
}

export default function Hamburger({ toggle }: BurgerProps) {
  return (
    <div className=" md:hidden">
      <button className="hover:hover:bg-gray-300 rounded-xl" onClick={toggle}>
        <Image src="/assets/hamburgersvg.svg" width={50} height={50} alt="" />
      </button>
    </div>
  );
}
