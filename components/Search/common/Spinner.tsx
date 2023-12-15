import React from "react";
import Image from "next/image";
import "@/styles/Spinner.css";

const Spinner = () => {
  return (
    <div className="spinner">
      <Image src="/spin.svg" alt="Loading..." width={24} height={12} />
    </div>
  );
};

export default Spinner;
