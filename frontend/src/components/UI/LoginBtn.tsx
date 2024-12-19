import React from "react";

interface LoginBtnProps {
    text: string;
}

const LoginBtn = ({ text }: LoginBtnProps) => {
  return (
    <button className="mt-5 bg-dark-blue w-full py-3 text-center text-white text-lg rounded-md font-normal loginBtn hover:text-dark-blue hover:bg-white border border-main transition duration-300">
      {text}
    </button>
  );
};

export default LoginBtn;
