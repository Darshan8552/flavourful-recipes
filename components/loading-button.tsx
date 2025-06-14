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
      className={`${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      variant={variant}
      type={type}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader className="animate-spin h-4 w-4" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;