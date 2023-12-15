"use client";
import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import mockCountries from "@/mocks/mockSearchData";
import { Country } from "@/types/data";

const SyncSearch: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([...mockCountries]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const refElement = useRef<HTMLInputElement>(null);
  const resultElementRef = useRef<HTMLDivElement>(null);
  const filteredCountries = searchInput
    ? countries.filter((country) =>
        country.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : countries;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setDropdownVisible(true);
  };

  const handleCheckboxChange = (code: string) => {
    setCountries(
      countries.map((country) =>
        country.code === code
          ? { ...country, selected: !country.selected }
          : country
      )
    );
  };

  const handleContainerBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDropdownVisible(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const { key } = e;

    if (key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev < filteredCountries.length - 1 ? prev + 1 : prev
      );
    } else if (key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (key === "Enter" && focusedIndex !== -1) {
      e.preventDefault();
      handleCheckboxChange(filteredCountries[focusedIndex].code);
      // Do not update focusedIndex here
    }
  };

  useEffect(() => {
    if (focusedIndex !== -1 && resultElementRef.current) {
      resultElementRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [focusedIndex]);

  return (
    <div
      onBlur={handleContainerBlur}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="relative mb-4"
    >
      <label className="font-semibold">Sync Search</label>
      <input
        ref={refElement}
        className="w-full p-2 mb-4 border rounded shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        type="text"
        placeholder="Type to begin searching"
        value={searchInput}
        onChange={handleSearchChange}
      />
      {dropdownVisible && (
        <div
          ref={resultElementRef}
          className="absolute z-50 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto"
        >
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <div
                key={index}
                style={{
                  backgroundColor:
                    index === focusedIndex ? "rgba(0,0,0,0.1)" : "",
                }}
                className="flex items-center p-2 border-b cursor-pointer hover:bg-black hover:bg-opacity-10"
              >
                <div className="flex-grow mr-4">
                  <div className="truncate w-[200px]">
                    <span>{country.name}</span>
                  </div>
                </div>
                <input
                  className="form-checkbox h-5 w-5 text-blue-600"
                  type="checkbox"
                  checked={country.selected}
                  onChange={() => handleCheckboxChange(country.code)}
                />
              </div>
            ))
          ) : (
            <div className="text-gray-500 p-2">No results were found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SyncSearch;
