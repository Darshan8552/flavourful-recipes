"use client";

import { 
  Home, 
  Users, 
  BookOpen, 
  Plus, 
  List, 
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathName = usePathname();
  
  const items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: pathName === "/dashboard",
    },
    {
      title: "User Management",
      url: "/user-management",
      icon: Users,
      isActive: pathName === "/user-management",
    },
    {
      title: "Recipe Management",
      url: "/recipe-management",
      icon: BookOpen,
      isActive: pathName === "/recipe-management",
    },
    {
      title: "Upload Recipe",
      url: "/upload-recipe",
      icon: Plus,
      isActive: pathName === "/upload-recipe",
    },
    {
      title: "Categories",
      url: "/categories",
      icon: List,
      isActive: pathName === "/categories",
    },
    {
      title: "Landing Page",
      url: "/",
      icon: LogOut,
      isActive: pathName === "/",
    },
  ];

  return (
    <div className="flex flex-col w-64 min-h-screen text-white">
      <div className="flex px-6 justify-center flex-col mt-6">
        <h1 className="text-white text-lg font-semibold">
          Recipe Blog Admin
        </h1>
        <p className="text-[#adadad] text-sm ">
          Manage your content
        </p>
      </div>
      <nav className="flex flex-col px-4 py-4 space-y-2 mt-4">
        {items.map((item) => (
          <Link
            href={item.url}
            key={item.title}
            className={`
              flex items-center px-3 py-2 gap-1 rounded-lg text-sm font-semibold transition-colors duration-200
              ${item.isActive 
                ? 'bg-gray-300 text-gray-700' 
                : 'text-gray-300 hover:bg-[#363636] hover:text-white'
              }
              ${item.url === "/" ? "text-red-700" : ""}
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}