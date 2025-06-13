import { Navbar } from "@/components/nav/navbar";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <div className="flex flex-col min-h-screen w-full">
        <Navbar />
        {children}
      </div>
  );
};

export default AuthLayout;
