"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Plus, Search, Settings, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { navLinks } from "@/lib/constants/nav-constant";
import { signOut } from "@/actions/auth-action";
import { ModeToggle } from "./toggle-mode";
import { IoInvertModeSharp } from "react-icons/io5";
import GlobalSearch from "@/components/global-search";

const NavbarAuth = ({ image }: { image?: string }) => {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/recipes?page=1&query=${encodeURIComponent(searchQuery.trim())}`
      );
      setSearchQuery("");
    }
  };
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };
  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };
  return (
    <div className="flex items-center space-x-4">
      <div className="hidden md:flex md:flex-1 md:justify-center md:px-2">
        <GlobalSearch
          variant="navbar"
          className="w-full max-w-sm"
          placeholder="Search recipes..."
        />
      </div>
      <span className="md:flex hidden">
        <ModeToggle />
      </span>

      <div className="flex items-center space-x-4">
        {loading ? (
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
        ) : session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={image || ""}
                    alt={session.user.name || session.user.email}
                  />
                  <AvatarFallback>
                    {getInitials(session.user.name, session.user.email)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                {session.user.role === "admin" ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/user-upload-recipe"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Upload Recipe
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/user-upload-recipe"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Recipe
                  </Link>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden md:flex md:items-center md:space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        )}

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">FR</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  FlavourFul Recipes
                </span>
              </div>

              <form onSubmit={handleSearch} className="relative px-2">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground " />
                <Input
                  type="search"
                  placeholder="Search recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </form>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-b py-4">
                {session ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 px-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${session.user.email}`}
                          alt={session.user.name || session.user.email}
                        />
                        <AvatarFallback>
                          {getInitials(session.user.name, session.user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                      {session.user.role === "admin" ? (
                        <>
                          <Link
                            href="/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/user-upload-recipe"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Recipe
                          </Link>
                        </>
                      ) : (
                        <Link
                          href="/user-upload-recipe"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Upload Recipe
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-start px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button variant="ghost" asChild className="justify-start">
                      <Link
                        href="/auth/signin"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="justify-start">
                      <Link
                        href="/auth/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              <span className="flex md:hidden w-full items-center justify-between px-2 text-sm text-muted-foreground ">
                <span className="flex items-center gap-2 justify-center">
                  <IoInvertModeSharp className="size-4 self-center" />
                  Toggle Theme
                </span>
                <ModeToggle />
              </span>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default NavbarAuth;
