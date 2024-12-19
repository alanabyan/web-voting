/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface InputProps {
  label: string;
  icon: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const Input = ({
  label,
  icon,
  name,
  value,
  onChange,
  type = "text",
}: InputProps) => {
  const [isFocus, setIsFocus] = useState(false);

  const handleFocus = () => {
    setIsFocus(true);
  };

  const handleBlur = () => {
    setIsFocus(value !== "");
  };

  return (
    <div className={`input-div mb-4 grid-cols-10 ${isFocus ? "focus" : ""}`}>
      <div className="col-span-1 flex justify-center items-center text-dark-blue transition duration-300">
        <Icon icon={icon} width={25} />
      </div>
      <div className="div col-span-8">
        <h5 className="text-dark-blue">{label}</h5>
        <input
          name={name}
          type={type}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={onChange}
          value={value}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default Input;
