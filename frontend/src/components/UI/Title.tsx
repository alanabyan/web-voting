import React from "react";

interface TitleProps {
    title: string;
}

const Title = ({ title } : TitleProps) => {
  return (
    <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-blue-900 from-50% to-sky-500 text-2xl md:text-4xl font-extrabold uppercase title">
      {title}
    </h1>
  );
};

export default Title;
