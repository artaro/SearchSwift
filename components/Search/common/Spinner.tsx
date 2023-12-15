import React from "react";
import Image from "next/image";
import "./Spinner.css";

const Spinner = () => {
  return (
    <div className="spinner">
      <Image src="/90-spin.svg" alt="Loading..." width={40} height={40} />
    </div>
  );
};

export default Spinner;
