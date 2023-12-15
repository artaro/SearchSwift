import React from "react";

interface SearchInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
}

const SearchInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: SearchInputProps) => {
  return (
    <>
      <label className="font-semibold" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="relative w-full p-2 mb-4 border rounded shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </>
  );
};

export default SearchInput;
