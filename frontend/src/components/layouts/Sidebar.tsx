
import Sidelink from "@/components/layouts/Sidelink";
interface SidelinkProps {
  selected: string;
  handler: (name: string) => void;
}
const Sidebar: React.FC<SidelinkProps> = ({selected, handler}) => {
  const links = [
    { name: "users", icon: "mdi:users" },
    { name: "statistics", icon: "tabler:chart-pie-filled" },
  ];

  return (
    <div className="p-2 glassmorphism rounded-3xl w-2/12 h-96">
      <Sidelink links={links} selected={selected} handler={handler} />
    </div>
  );
};

export default Sidebar;
