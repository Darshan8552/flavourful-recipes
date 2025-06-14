import Link from "next/link";
import React from "react";
import { TbAlertTriangle } from "react-icons/tb";
import { Button } from "./ui/button";

const UnAuthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50 dark:bg-black">
      <TbAlertTriangle className="size-40 text-red-600 dark:text-red-500" />
      <h1 className="text-6xl font-semibold text-red-600 dark:text-red-500 mb-4">
        Unauthorized
      </h1>
      <p className="text-slate-600 dark:text-zinc-400 mb-6 text-center max-w-md">
        You don&apos;t have permission to access this page. Please log in or contact support if you believe this is an error.
      </p>
      <Link href="/">
        <Button 
          variant="outline" 
          className="border-gray-300 dark:border-neutral-600 text-gray-900 dark:text-zinc-100 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:border-gray-400 dark:hover:border-neutral-500 transition-colors"
        >
          Return Home
        </Button>
      </Link>
    </div>
  );
};

export default UnAuthorized;