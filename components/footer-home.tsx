import React from "react";
import Link from "next/link";
import { FaXTwitter, FaInstagram, FaGithub } from "react-icons/fa6";

export default function FooterHome() {
  return (
    <footer className="flex flex-col items-center space-y-10 justify-between w-full max-w-[1100px] mx-auto mt-16">
      <div className="flex flex-wrap items-center justify-center gap-6 md:flex-row md:justify-around">
        <Link
          className="text-[#a5b6a0] text-base font-normal leading-normal min-w-40"
          href="#"
        >
          About
        </Link>
        <Link
          className="text-[#a5b6a0] text-base font-normal leading-normal min-w-40"
          href="#"
        >
          Contact
        </Link>
        <Link
          className="text-[#a5b6a0] text-base font-normal leading-normal min-w-40"
          href="#"
        >
          Privacy Policy
        </Link>
        <Link
          className="text-[#a5b6a0] text-base font-normal leading-normal min-w-40"
          href="#"
        >
          Terms of Service
        </Link>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="#">
          <div
            className="text-[#a5b6a0]"
            data-icon="TwitterLogo"
            data-size="24px"
            data-weight="regular"
          >
            <FaXTwitter className="size-6" />
          </div>
        </Link>
        <Link href="#">
          <div
            className="text-[#a5b6a0]"
            data-icon="InstagramLogo"
            data-size="24px"
            data-weight="regular"
          >
            <FaInstagram className="size-6" />
          </div>
        </Link>
        <a href="#">
          <div
            className="text-[#a5b6a0]"
            data-icon="FacebookLogo"
            data-size="24px"
            data-weight="regular"
          >
            <FaGithub className="size-6" />
          </div>
        </a>
      </div>
      <p className="text-[#a5b6a0] text-base font-normal leading-normal">
        © 2025 FlavourFul Recipes. All rights reserved.
      </p>
    </footer>
  );
}
