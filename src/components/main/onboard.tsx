"use client";

import { useState } from "react";
import { FaCheck, FaChevronDown } from "react-icons/fa6";

interface Props {
  title: string;
  checked: boolean;
  children?: React.ReactNode;
  required?: boolean;
}

export default function OnBoard({ title, checked, children, required }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col p-5 rounded-xl rounded-xl shadow border-1">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 cursor-pointer"
      >
        <div className="flex items-center gap-3 w-full">
          {checked ? (
            <div className="min-w-5 max-w-5 min-h-5 max-h-5 flex items-center justify-center rounded-full bg-green-500">
              <FaCheck size={13} />
            </div>
          ) : (
            <div className="min-w-5 max-w-5 min-h-5 max-h-5 bg-[#000]/40 dark:bg-accent rounded-full"></div>
          )}
          <div className="text-sm font-semibold flex items-center gap-2">
            {title}{" "}
            {required && !checked && (
              <span className="bg-red-500/10 text-red-500 pl-2 pr-2 rounded-full">
                required
              </span>
            )}
          </div>
        </div>
        <FaChevronDown
          className={`${open && "rotate-180"} transition-all`}
          size={13}
        />
      </div>
      {open && <div className="pt-6">{children}</div>}
    </div>
  );
}
