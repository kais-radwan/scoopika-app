import { IconHome } from "@tabler/icons-react";
import { FaChevronRight } from "react-icons/fa6";

interface Props {
  title: string | React.ReactNode;
  description: string;
  action?: React.ReactNode;
  back?: React.ReactNode;
}

export default function AppHead({ title, description, action, back }: Props) {
  return (
    <div className="flex flex-col gap-3 p-6 border-b-1 border-border/60">
      <div className="w-full flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center gap-2 mb-1">
          {back && back}
          <div className="flex items-center gap-2">
            <IconHome className="opacity-70" size={18} />
            <FaChevronRight className="opacity-70" size={12} />
            <h3 className="font-semibold truncate">{title}</h3>
          </div>
        </div>
        <div className="w-full flex items-center lg:justify-end">
          {action && action}
        </div>
      </div>
      <div className="text-sm opacity-60 truncate">{description}</div>
    </div>
  );
}
