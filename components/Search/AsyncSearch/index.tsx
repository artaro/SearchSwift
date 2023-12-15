import React, { useState, useRef, useEffect } from "react";
import mockCountries from "@/mocks/mockSearchData";
import { Country } from "@/types/data";
import useKeyboardNavigation from "@/hooks/useKeyboardNavigation";
import SearchInput from "../common/SearchInput";
import Spinner from "../common/Spinner";
import "@/styles/ScrollBar.css";

const AsyncSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState<Country[]>([...mockCountries]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resultElementRef = useRef<HTMLDivElement>(null);

  const { focusedIndex, handleKeyDown } = useKeyboardNavigation({
    itemCount: filteredCountries.length,
    isDropdownVisible: dropdownVisible,
    onEnter: (index: number) => {
      handleCheckboxChange(filteredCountries[index].code);
    },
    onEscape: () => {
      setDropdownVisible(false);
    },
  });

  const simulateAsyncSearch = (query: string) => {
    setIsLoading(true);
    setInputDisabled(true);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setFilteredCountries(
        query
          ? countries.filter((country) =>
              country.name.toLowerCase().includes(query.toLowerCase())
            )
          : countries
      );
      setIsLoading(false);
      setInputDisabled(false);
    }, 600);
  };

  useEffect(() => {
    simulateAsyncSearch(query);
    setDropdownVisible(query.length > 0);
  }, [query]);

  const handleCheckboxChange = (code: string) => {
    setFilteredCountries(
      filteredCountries.map((country) =>
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

  useEffect(() => {
    if (focusedIndex !== -1 && resultElementRef.current) {
      const focusedElement = resultElementRef.current.children[focusedIndex];
      focusedElement.scrollIntoView({
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
      <div className="relative">
        <SearchInput
          id="async-search"
          label="Async Search"
          placeholder="Type to begin searching"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {isLoading && (
        <div className="absolute right-2 top-8">
          <Spinner />
        </div>
      )}
      {dropdownVisible && (
        <div
          ref={resultElementRef}
          className="absolute z-50 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto hide-scrollbar"
        >
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <div
                key={index}
                style={{
                  backgroundColor:
                    index === focusedIndex ? "rgba(0,0,0,0.1)" : "",
                }}
                className="flex w-80 items-center p-2 border-b cursor-pointer hover:bg-black hover:bg-opacity-10"
              >
                <div className="flex-grow mr-4">
                  <div className="truncate w-60">
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
            <div className="w-80 text-gray-500 p-2">No results were found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AsyncSearch;
