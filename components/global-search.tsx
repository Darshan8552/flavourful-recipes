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

  // Debounced search function for suggestions
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

  // Navigate to search results
  const navigateToSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      const encodedQuery = encodeURIComponent(searchTerm.trim());
      router.push(`/recipes?query=${encodedQuery}&page=1`);
      
      // Reset component state
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
      
      // Call completion callback (for mobile menu)
      onSearchComplete?.();
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    // Fetch suggestions
    debouncedSearch(value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    navigateToSearch(suggestion.title);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      // Use selected suggestion
      handleSuggestionClick(suggestions[selectedIndex]);
    } else {
      // Use current query
      navigateToSearch(query);
    }
  };

  // Handle keyboard navigation
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

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Handle focus
  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle blur
  const handleBlur = (e: React.FocusEvent) => {
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

  // Styling based on variant
  const getInputStyles = () => {
    const baseStyles = "w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-1";
    
    if (variant === "navbar") {
      return `${baseStyles} border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring`;
    }
    
    // Page variant (original dark theme)
    return `${baseStyles} border-gray-600 bg-black text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500`;
  };

  const getSuggestionStyles = () => {
    if (variant === "navbar") {
      return "absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-input bg-popover shadow-lg";
    }
    
    return "absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-gray-600 bg-black shadow-lg";
  };

  const getIconColor = () => {
    return variant === "navbar" ? "text-muted-foreground" : "text-woodsmoke-500";
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
              className={`absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 ${
                variant === "navbar" ? "text-muted-foreground hover:text-foreground" : "text-gray-400 hover:text-white"
              }`}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className={getSuggestionStyles()}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className={`ml-2 text-sm ${variant === "navbar" ? "text-muted-foreground" : "text-gray-400"}`}>
                Searching...
              </span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-4 py-3 hover:bg-accent focus:bg-accent focus:outline-none border-b last:border-b-0 ${
                    selectedIndex === index 
                      ? variant === "navbar" ? "bg-accent" : "bg-[#272727]" 
                      : ""
                  } ${
                    variant === "navbar" 
                      ? "border-border hover:bg-accent" 
                      : "border-gray-700 hover:bg-black"
                  }`}
                >
                  <div className={`font-medium text-sm line-clamp-1 ${
                    variant === "navbar" ? "text-foreground" : "text-white"
                  }`}>
                    {suggestion.title}
                  </div>
                  <div className={`text-xs mt-1 line-clamp-1 ${
                    variant === "navbar" ? "text-muted-foreground" : "text-gray-400"
                  }`}>
                    {suggestion.description}
                  </div>
                </button>
              ))}
              <div className={`px-4 py-2 text-xs border-t ${
                variant === "navbar" 
                  ? "text-muted-foreground border-border bg-muted/50" 
                  : "text-gray-500 border-gray-700 bg-[#272727]"
              }`}>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Press Enter to search &quot;{query}&quot;
                </div>
              </div>
            </>
          ) : query.trim() && !isLoading ? (
            <div className={`px-4 py-3 text-sm ${
              variant === "navbar" ? "text-muted-foreground" : "text-gray-400"
            }`}>
              No suggestions found. Press Enter to search.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;