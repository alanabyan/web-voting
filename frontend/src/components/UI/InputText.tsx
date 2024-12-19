import React, { ChangeEvent, KeyboardEvent, ForwardedRef } from "react";

interface InputTextProps {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  innerRef?: ForwardedRef<HTMLInputElement>;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputText: React.FC<InputTextProps> = ({
  name,
  label,
  placeholder,
  type,
  innerRef,
  value,
  onChange,
}) => {
  return (
    <div className="form-control w-full my-2">
      <label className="label">
        <span className="label-text text-dark-blue transition duration-300 text-base capitalize">
          {label}
        </span>
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        ref={innerRef}
        value={value}
        onChange={onChange}
        className="input input-bordered w-full bg-dark-blue transition duration-300"
        onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />
    </div>
  );
};

export default InputText;
