import React from "react";
import UsersTable from "@/components/admin/users-table";
import UserSearch from "@/components/admin/user-search";

interface PageProps {
  searchParams: {
    search?: string;
    role?: string;
    verified?: string;
  };
}

const UserManagement = async ({ searchParams }: PageProps) => {
   const params = await searchParams;
  return (
    <section className="flex flex-col gap-4 w-full p-4">
      <div className="flex min-w-72 flex-col gap-3">
        <h1 className="text-white tracking-light text-[32px] font-bold leading-tight">
          Users
        </h1>
        <span className="text-[#ababab] text-sm font-normal leading-normal">
          Manage users and there roles
        </span>
      </div>
      <div className="w-full max-w-2xl">
        <UserSearch />
      </div>
      <div className="mr-2">
          <UsersTable searchParams={params} />
      </div>
    </section>
  );
};

export default UserManagement;
