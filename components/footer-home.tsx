import React from "react";
import Link from "next/link";
import { FaXTwitter, FaInstagram, FaGithub } from "react-icons/fa6";

export default function FooterHome() {
  return (
    <footer className="flex flex-col items-center space-y-10 justify-between w-full max-w-[1100px] mx-auto mt-16">
      <div className="flex flex-wrap items-center justify-center gap-6 md:flex-row md:justify-around">
        <Link
          className="text-slate-600 dark:text-zinc-400 text-base font-normal leading-normal min-w-40 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors"
          href="#"
        >
          About
        </Link>
        <Link
          className="text-slate-600 dark:text-zinc-400 text-base font-normal leading-normal min-w-40 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors"
          href="#"
        >
          Contact
        </Link>
        <Link
          className="text-slate-600 dark:text-zinc-400 text-base font-normal leading-normal min-w-40 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors"
          href="#"
        >
          Privacy Policy
        </Link>
        <Link
          className="text-slate-600 dark:text-zinc-400 text-base font-normal leading-normal min-w-40 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors"
          href="#"
        >
          Terms of Service
        </Link>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="#" className="text-slate-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
          <FaXTwitter className="size-6" />
        </Link>
        <Link href="#" className="text-slate-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
          <FaInstagram className="size-6" />
        </Link>
        <Link href="#" className="text-slate-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
          <FaGithub className="size-6" />
        </Link>
      </div>
      <p className="text-slate-600 dark:text-zinc-400 text-base font-normal leading-normal">
        © 2025 FlavourFul Recipes. All rights reserved.
      </p>
    </footer>
  );
}