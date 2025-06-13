"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchRecipeSuggestions } from "@/actions/recipes-filter-actions";

interface SearchSuggestion {
  id: string;
  title: string;
  description: string;
}

interface SearchProps {
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchProps> = ({ 
  placeholder = "Search recipes...", 
  className = "" 
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  const debouncedSearch = useDebouncedCallback(async (searchTerm: string) => {
    if (searchTerm.trim().length > 0) {
      setIsLoading(true);
      try {
        const results = await searchRecipeSuggestions(searchTerm, 6);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, 300);

  // Handle URL parameter update
  const updateURL = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term.trim()) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    params.delete("page"); // Reset to page 1
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    // Update URL
    updateURL(value);
    
    // Fetch suggestions
    debouncedSearch(value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    const params = new URLSearchParams(searchParams);
    params.set("query", suggestion.title);
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
    
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          // Perform search with current query
          setShowSuggestions(false);
          inputRef.current?.blur();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
    
    inputRef.current?.focus();
  };

  // Handle focus and blur
  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-woodsmoke-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-600 bg-black py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoComplete="off"
        />
        {query && (
          <Button
            onClick={clearSearch}
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-600 bg-black shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-400">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-4 py-3 hover:bg-black focus:bg-black focus:outline-none border-b border-gray-700 last:border-b-0 ${
                    selectedIndex === index ? "bg-[#272727]" : ""
                  }`}
                >
                  <div className="font-medium text-white text-sm line-clamp-1">
                    {suggestion.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                    {suggestion.description}
                  </div>
                </button>
              ))}
              <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-700 bg-[#272727]">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Press Enter to search "{query}"
                </div>
              </div>
            </>
          ) : query.trim() && !isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-400">
              No suggestions found. Press Enter to search.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchInput;