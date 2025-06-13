"use server";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/lib/db/models/user";
import { revalidatePath } from "next/cache";

export async function fetchUsersAction(searchParams?: {
  search?: string;
  role?: string;
  verified?: string;
  page?: string;
}) {
  const page = parseInt(searchParams?.page || '1');
  const limit = 10;
  const skip = (page - 1) * limit;

  const filter: any = {};
  
  if (searchParams?.search) {
    filter.$or = [
      { name: { $regex: searchParams.search, $options: 'i' } },
      { email: { $regex: searchParams.search, $options: 'i' } }
    ];
  }
  
  if (searchParams?.role && searchParams.role !== 'all') {
    filter.role = searchParams.role;
  }
  
  if (searchParams?.verified && searchParams.verified !== 'all') {
    filter.emailVerified = searchParams.verified === 'true';
  }

  const totalUsers = await UserModel.countDocuments(filter);
  const totalPages = Math.ceil(totalUsers / limit);
  
  const rawUsers = await UserModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const users = rawUsers.map(user => ({
  _id: user._id.toString(),
  name: user.name || '',
  email: user.email || '',
  role: user.role || 'user',
  emailVerified: Boolean(user.emailVerified),
  createdAt: user.createdAt ? user.createdAt.toISOString() : undefined,
  updatedAt: user.updatedAt ? user.updatedAt.toISOString() : undefined,
}));

  return {
    users,
    pagination: {
      currentPage: page,
      totalPages,
      totalUsers,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    }
  };
}

export async function changeUserRoleAction(userId: string, role: string) {
  try {
    if (!['user', 'admin'].includes(role)) {
      throw new Error("Invalid role specified");
    }

    await connectToDatabase();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, 
      { role }, 
      { new: true, runValidators: true }
    ).exec();

    if (!updatedUser) {
      throw new Error("User not found");
    }

    revalidatePath("/user-management");

    return { success: true, message: `User role updated to ${role}` };
  } catch (error) {
    console.error("Error changing user role:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to change user role");
  }
}

export async function deleteUserByIdAction(userId: string) {
  try {
    await connectToDatabase();

    const deletedUser = await UserModel.findByIdAndDelete(userId).exec();
    if (!deletedUser) {
      throw new Error("User not found");
    }
    
    revalidatePath("/user-management");
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete user");
  }
}


export async function bulkUpdateUsersAction(userIds: string[], updates: Partial<{ role: string; emailVerified: boolean }>) {
  try {
    await connectToDatabase();
    
    const result = await UserModel.updateMany(
      { _id: { $in: userIds } },
      { $set: updates },
      { runValidators: true }
    );
    
    revalidatePath("/user-management");
    return { 
      success: true,
      message: `${result.modifiedCount} users updated successfully`,
      modifiedCount: result.modifiedCount 
    };
  } catch (error) {
    console.error("Error bulk updating users:", error);
    throw new Error("Failed to bulk update users");
  }
}