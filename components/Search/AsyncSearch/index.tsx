import React, { ChangeEvent, useState, useRef, useEffect } from "react";
import { Country } from "@/types/data";
import mockCountries from "@/mocks/mockSearchData";
import Spinner from "../common/Spinner";

const AsyncSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState<Country[]>([...mockCountries]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resultElementRef = useRef<HTMLDivElement>(null);

  const simulateAsyncSearch = (query: string) => {
    setIsLoading(true);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setFilteredCountries(
        query
          ? countries.filter((country) =>
              country.name.toLowerCase().includes(query.toLowerCase())
            )
          : []
      );
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    simulateAsyncSearch(query);
    setDropdownVisible(query.length > 0);
  }, [query]);

  const handleCheckboxChange = (code: string) => {
    setCountries((prevCountries) =>
      prevCountries.map((country) =>
        country.code === code
          ? { ...country, selected: !country.selected }
          : country
      )
    );
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!dropdownVisible || countries.length === 0) return;

    const { key } = e;
    if (key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev < countries.length - 1 ? prev + 1 : prev
      );
    } else if (key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (key === "Enter" && focusedIndex !== -1) {
      e.preventDefault();
      handleCheckboxChange(countries[focusedIndex].code);
    }
  };

  const handleContainerBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDropdownVisible(false);
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
      className="relative mb-4"
      onBlur={handleContainerBlur}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <label className="font-semibold">Async Search</label>
      <input
        className="relative w-full p-2 mb-4 border rounded shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        type="text"
        placeholder="Type to begin searching"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {isLoading && (
        <div className="absolute right-2 top-6">
          <Spinner />
        </div>
      )}
      {dropdownVisible && (
        <div
          ref={resultElementRef}
          className="absolute z-50 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto"
        >
          {countries.length > 0 ? (
            countries.map((country, index) => (
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
                    <span className="font-semibold">{country.code} - </span>
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

export default AsyncSearch;
