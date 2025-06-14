"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchRecipeSuggestions } from "@/actions/recipes-filter-actions";

interface SearchSuggestion {
  id: string;
  title: string;
  description: string;
}

interface GlobalSearchProps {
  placeholder?: string;
  className?: string;
  variant?: "navbar" | "page";
  onSearchComplete?: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
  placeholder = "Search recipes...", 
  className = "",
  variant = "page",
  onSearchComplete
}) => {
  const router = useRouter();
  
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

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

  const navigateToSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      const encodedQuery = encodeURIComponent(searchTerm.trim());
      router.push(`/recipes?query=${encodedQuery}&page=1`);
      
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
      
      onSearchComplete?.();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    debouncedSearch(value);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    navigateToSearch(suggestion.title);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      handleSuggestionClick(suggestions[selectedIndex]);
    } else {
      navigateToSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        navigateToSearch(query);
      }
      return;
    }

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
        } else {
          navigateToSearch(query);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

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

  const getInputStyles = () => {
    const baseStyles = "w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 transition-colors";
    
    if (variant === "navbar") {
      return `${baseStyles} border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-zinc-100 placeholder:text-slate-600 dark:placeholder:text-zinc-400 focus:border-sky-500 dark:focus:border-sky-400 focus:ring-sky-500/20 dark:focus:ring-sky-400/20`;
    }
    
    return `${baseStyles} border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-black text-gray-900 dark:text-zinc-100 placeholder:text-slate-600 dark:placeholder:text-zinc-400 focus:border-green-600 dark:focus:border-green-400 focus:ring-green-600/20 dark:focus:ring-green-400/20`;
  };

  const getSuggestionStyles = () => {
    if (variant === "navbar") {
      return "absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 shadow-lg";
    }
    
    return "absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-black shadow-lg";
  };

  const getIconColor = () => {
    return "text-slate-600 dark:text-zinc-400";
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${getIconColor()}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={getInputStyles()}
            autoComplete="off"
          />
          {query && (
            <Button
              type="button"
              onClick={clearSearch}
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 text-slate-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className={getSuggestionStyles()}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 dark:border-green-400"></div>
              <span className="ml-2 text-sm text-slate-600 dark:text-zinc-400">
                Searching...
              </span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-neutral-700 focus:bg-gray-100 dark:focus:bg-neutral-700 focus:outline-none border-b border-gray-200 dark:border-neutral-600 last:border-b-0 transition-colors ${
                    selectedIndex === index 
                      ? "bg-gray-100 dark:bg-neutral-700" 
                      : ""
                  }`}
                >
                  <div className="font-medium text-sm line-clamp-1 text-gray-900 dark:text-zinc-100">
                    {suggestion.title}
                  </div>
                  <div className="text-xs mt-1 line-clamp-1 text-slate-600 dark:text-zinc-400">
                    {suggestion.description}
                  </div>
                </button>
              ))}
              <div className="px-4 py-2 text-xs border-t border-gray-200 dark:border-neutral-600 text-slate-600 dark:text-zinc-400 bg-gray-50 dark:bg-neutral-800">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Press Enter to search &quot;{query}&quot;
                </div>
              </div>
            </>
          ) : query.trim() && !isLoading ? (
            <div className="px-4 py-3 text-sm text-slate-600 dark:text-zinc-400">
              No suggestions found. Press Enter to search.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;