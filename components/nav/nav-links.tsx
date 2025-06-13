"use client";
import { navLinks } from "@/lib/constants/nav-constant";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavLinks = () => {
  const pathname = usePathname();
  return (
    <div className="hidden md:flex md:items-center md:space-x-6">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            pathname === link.href
              ? "text-primary"
              : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          }
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;
