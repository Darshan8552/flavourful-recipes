"use client";
import React, { useState } from "react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  MoreHorizontal,
  Shield,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  changeUserRoleAction,
  deleteUserByIdAction,
} from "@/actions/admin-action";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type User = {
  _id: string;
  name?: string;
  email: string;
  role: string;
  emailVerified?: boolean;
  createdAt?: string;
};

interface UserTableRowProps {
  users: User[];
}

const UserTableRow = ({ users }: UserTableRowProps) => {
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { role?: boolean; delete?: boolean };
  }>({});

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], role: true },
    }));

    try {
      await changeUserRoleAction(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error("Error changing user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], role: false },
      }));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], delete: true },
    }));

    try {
      await deleteUserByIdAction(userId);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], delete: false },
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <TableBody>
      {users.map((user: User) => (
        <TableRow
          key={user._id}
          className="border-[#505050] hover:bg-[#333333] transition-colors"
        >
          <TableCell className="font-medium text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span>{user.name || "Unknown User"}</span>
            </div>
          </TableCell>

          <TableCell className="text-[#ababab]">{user.email}</TableCell>

          <TableCell className="w-[100px]">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-full focus:outline-none focus:ring-1 hover:ring-1 rounded-lg py-2 px-3 active:ring-1 flex items-center gap-2 bg-[#404040] hover:bg-[#505050] transition-colors"
                disabled={loadingStates[user._id]?.role}
              >
                {user.role === "admin" ? (
                  <Shield className="h-4 w-4 text-orange-400" />
                ) : (
                  <User className="h-4 w-4 text-blue-400" />
                )}
                <span className="capitalize text-white">
                  {loadingStates[user._id]?.role ? "Updating..." : user.role}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#303030] border-[#505050]">
                <DropdownMenuItem
                  onClick={() => handleRoleChange(user._id, "admin")}
                  disabled={
                    user.role === "admin" || loadingStates[user._id]?.role
                  }
                  className="focus:bg-[#404040] text-white"
                >
                  <Shield className="h-4 w-4 mr-2 text-orange-400" />
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRoleChange(user._id, "user")}
                  disabled={
                    user.role === "user" || loadingStates[user._id]?.role
                  }
                  className="focus:bg-[#404040] text-white"
                >
                  <User className="h-4 w-4 mr-2 text-blue-400" />
                  User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>

          <TableCell>
            <div className="flex items-center gap-2">
              {user.emailVerified ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-400">Yes</span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-400">No</span>
                </>
              )}
            </div>
          </TableCell>

          <TableCell className="text-[#ababab]">
            {user.createdAt ? formatDate(user.createdAt) : "Unknown"}
          </TableCell>

          <TableCell>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                    disabled={loadingStates[user._id]?.delete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#282828] border-[#505050]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                      Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[#ababab]">
                      This action cannot be undone. This will permanently delete
                      the user account for <strong>{user.name}</strong> (
                      {user.email}).
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-[#404040] border-[#505050] text-white hover:bg-[#505050]">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={loadingStates[user._id]?.delete}
                    >
                      {loadingStates[user._id]?.delete
                        ? "Deleting..."
                        : "Delete User"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#303030] border-[#505050]">
                  <DropdownMenuItem className="focus:bg-[#404040] text-white">
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-[#404040] text-white">
                    Send Message
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#505050]" />
                  <DropdownMenuItem className="focus:bg-[#404040] text-white">
                    View Activity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default UserTableRow;
