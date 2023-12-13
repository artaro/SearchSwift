"use client";
import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { createPopper } from "@popperjs/core";

import CountryItem from "../common/CountryItem";
import mockCountries from "@/mocks/mockSearchData";
import { Country } from "@/types/data";

const SyncSearch: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([...mockCountries]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const refElement = useRef(null);
  const popperElementRef = useRef(null);

  useEffect(() => {
    if (refElement.current && popperElementRef.current) {
      createPopper(refElement.current, popperElementRef.current, {
        placement: "bottom-start",
      });
    }
  }, [refElement, popperElementRef]);

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

  const filteredCountries = searchInput
    ? countries.filter((country) =>
        country.name.toLowerCase().includes(searchInput.toLowerCase())
      )
    : countries;

  const handleContainerBlur = (event: any) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDropdownVisible(false);
    }
  };

  return (
    <div onBlur={handleContainerBlur} tabIndex={-1}>
      <div className="mb-4 font-semibold">SyncSearch Component</div>
      <input
        className="w-full p-2 mb-4 border rounded shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        type="text"
        placeholder="Search..."
        value={searchInput}
        onChange={handleSearchChange}
        ref={refElement}
      />
      {dropdownVisible && (
        <div
          ref={popperElementRef}
          className="z-50 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto"
        >
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <CountryItem
                key={index}
                country={country}
                onCheckboxChange={handleCheckboxChange}
              />
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
