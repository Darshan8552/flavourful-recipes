"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const UserSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [roleFilter, setRoleFilter] = useState(
    searchParams.get("role") || "all"
  );
  const [verificationFilter, setVerificationFilter] = useState(
    searchParams.get("verified") || "all"
  );

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (roleFilter !== "all") params.set("role", roleFilter);
    if (verificationFilter !== "all")
      params.set("verified", verificationFilter);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : "";

    router.push(`/user-management${newUrl}`, { scroll: false });
  }, [searchQuery, roleFilter, verificationFilter, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setVerificationFilter("all");
  };

  const hasActiveFilters =
    searchQuery || roleFilter !== "all" || verificationFilter !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-4xl">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex-1 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ababab] h-4 w-4" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#303030] placeholder:text-[#ababab] pl-10 pr-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ababab] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Filters */}
      <div className="flex gap-2">
        {/* Role Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`bg-[#303030] border-[#505050] hover:bg-[#404040] ${
                roleFilter !== "all" ? "border-blue-500 text-blue-400" : ""
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Role: {roleFilter === "all" ? "All" : roleFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#303030] border-[#505050]">
            <DropdownMenuItem onClick={() => setRoleFilter("all")}>
              All Roles
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRoleFilter("admin")}>
              Admin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("user")}>
              User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Verification Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`bg-[#303030] border-[#505050] hover:bg-[#404040] ${
                verificationFilter !== "all"
                  ? "border-green-500 text-green-400"
                  : ""
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Verified:{" "}
              {verificationFilter === "all" ? "All" : verificationFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#303030] border-[#505050]">
            <DropdownMenuItem onClick={() => setVerificationFilter("all")}>
              All Users
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setVerificationFilter("true")}>
              Verified
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setVerificationFilter("false")}>
              Unverified
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-[#ababab] hover:text-white hover:bg-[#404040]"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
