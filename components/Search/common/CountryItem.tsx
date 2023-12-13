import React from "react";
import { Country } from "@/types/data";

interface CountryItemProps {
  country: Country;
  onCheckboxChange: (code: string) => void;
}

const CountryItem: React.FC<CountryItemProps> = ({
  country,
  onCheckboxChange,
}) => {
  return (
    <div className="flex items-center p-2 border-b">
      <div className="flex-grow mr-4">
        <div className="truncate w-[200px]">
          <span className="font-semibold">{country.code}</span>
          <span> - {country.name}</span>
        </div>
      </div>
      <input
        className="form-checkbox h-5 w-5 text-blue-600"
        type="checkbox"
        checked={country.selected}
        onChange={() => onCheckboxChange(country.code)}
      />
    </div>
  );
};

export default CountryItem;
