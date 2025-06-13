import Link from "next/link";
import React from "react";
import { TbAlertTriangle } from "react-icons/tb";
import { Button } from "./ui/button";

const UnAuthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <TbAlertTriangle className="size-40 stroke-destructive/70" />
      <h1 className="text-6xl font-semibold text-destructive/70 mb-4">
        UnAuthorized
      </h1>
      <Link href="/" className=" hover:underline text-woodsmoke-200 ">
        <Button variant="ghost" className="hover:cursor-pointer">Home</Button>
      </Link>
    </div>
  );
};

export default UnAuthorized;
