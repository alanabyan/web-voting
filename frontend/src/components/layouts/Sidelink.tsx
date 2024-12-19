import React from "react";
import { Icon } from "@iconify/react";

interface SidelinkProps {
  links: { name: string; icon: string }[];
  selected: string;
  handler: (name: string) => void;
}

const Sidelink: React.FC<SidelinkProps> = ({ links, selected, handler }) => {
  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md transition duration-300 text-dark-blue bg-cream m-2 w-full";
  const normalLink =
    "flex items-center gap-5 pl-4 bg-dark-blue pt-3 pb-2.5 rounded-lg text-md text-white transition duration-300 hover:text-dark-blue hover:bg-transparent m-2 w-[93%]";

  return (
    <div>
      {links.map((link) => (
        <button
          key={link.name}
          onClick={() => handler(link.name)}
          className={selected === link.name ? activeLink : normalLink}
        >
          <Icon icon={link.icon} width="22" />
          <span className="capitalize">{link.name}</span>
        </button>
      ))}
    </div>
  );
};

export default Sidelink;
