import React from "react";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

interface ILoadingButtonProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  type?: "button" | "submit" | "reset";
}

const LoadingButton = ({
  children,
  isLoading,
  onClick,
  className = "",
  variant = "default",
  type,
}: ILoadingButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className={className}
      variant={variant}
      type={type}
    >
      {isLoading ? <Loader className="animate-spin h-4 w-4" /> : children}
    </Button>
  );
};

export default LoadingButton;
