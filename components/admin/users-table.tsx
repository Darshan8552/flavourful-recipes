import { fetchUsersAction } from "@/actions/admin-action";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";
import UserTableRow from "./user-table-row";
import { AlertCircle, Users } from "lucide-react";
import Pagination from "./admin-pagination";

interface UsersTableProps {
  searchParams?: {
    search?: string;
    role?: string;
    verified?: string;
    page?: string;
  };
}

const UsersTable = async ({ searchParams }: UsersTableProps) => {
  try {
    const result = await fetchUsersAction(searchParams);

    if (!result || !result.users || result.users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-[#ababab] mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            No users found
          </h3>
          <p className="text-[#ababab] text-sm">
            {searchParams?.search ||
            searchParams?.role !== "all" ||
            searchParams?.verified !== "all"
              ? "Try adjusting your search or filters"
              : "No users have been registered yet"}
          </p>
        </div>
      );
    }
    const { users, pagination } = result;

    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-[#505050] bg-[#282828]">
          <div className="flex items-center justify-between p-4 border-b border-[#505050]">
            <h2 className="text-lg font-semibold text-white">
              Users ({pagination.totalUsers})
            </h2>
            <p className="text-sm text-[#ababab]">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-[#505050] hover:bg-[#333333]">
                <TableHead className="text-md font-bold w-[200px] text-[#ababab]">
                  Name
                </TableHead>
                <TableHead className="text-md font-bold w-[300px] text-[#ababab]">
                  Email
                </TableHead>
                <TableHead className="text-md font-bold w-[100px] text-[#ababab]">
                  Role
                </TableHead>
                <TableHead className="text-md font-bold w-[100px] text-[#ababab]">
                  Verified
                </TableHead>
                <TableHead className="text-md font-bold w-[150px] text-[#ababab]">
                  Joined
                </TableHead>
                <TableHead className="text-md font-bold w-[120px] text-[#ababab]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <UserTableRow users={users} />
          </Table>
        </div>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          Error loading users
        </h3>
        <p className="text-[#ababab] text-sm">
          There was a problem loading the users. Please try again.
        </p>
      </div>
    );
  }
};

export default UsersTable;
