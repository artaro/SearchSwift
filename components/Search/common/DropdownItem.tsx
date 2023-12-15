import React from "react";
import { Country } from "@/types/data";

interface DropdownItemProps {
  data: Country;
  onCheckboxChange: (code: string) => void;
  focused: boolean;
  showCode?: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  data,
  onCheckboxChange,
  showCode,
  focused,
}) => {
  const focusClass = focused ? "bg-gray-200" : "";

  return (
    <div className={`flex items-center p-2 border-b ${focusClass}`}>
      <div className="flex-grow mr-4">
        <div className="truncate w-[200px]">
          {showCode && <span className="font-semibold">{data.code} - </span>}
          <span>{data.name}</span>
        </div>
      </div>
      <input
        className="form-checkbox h-5 w-5 text-blue-600"
        type="checkbox"
        checked={data.selected}
        onChange={() => onCheckboxChange(data.code)}
      />
    </div>
  );
};

export default DropdownItem;
