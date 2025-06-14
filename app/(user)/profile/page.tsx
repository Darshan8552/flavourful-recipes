import { getProfileImage } from "@/actions/profile-actions";
import ChangePassword from "@/components/auth/change-password";
import { getSession } from "@/lib/auth/auth";
import Image from "next/image";
import React from "react";

const ProfilePage = async () => {
  const session = await getSession();
  const profile = await getProfileImage(session?.user.id as string);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gray-50 dark:bg-black group/design-root overflow-x-hidden">
      <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <p className="text-gray-900 dark:text-zinc-100 tracking-light text-[32px] font-bold leading-tight">
                Profile
              </p>
              <p className="text-slate-600 dark:text-zinc-400 text-sm font-normal leading-normal">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-neutral-800 p-6 border border-gray-300 dark:border-neutral-600">
              <div className="flex flex-[2_2_0px] flex-col gap-4 space-y-5">
                <div className="flex flex-col gap-5">
                  <p className="text-gray-900 dark:text-zinc-100 text-xl font-bold leading-tight">
                    {profile?.name || session?.user.name}
                  </p>
                  <p className="text-slate-600 dark:text-zinc-400 text-md font-normal leading-normal">
                    {profile?.email || session?.user.email}
                  </p>
                </div>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white pr-2 gap-1 text-sm font-medium leading-normal w-fit transition-colors">
                  <div className="text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18px"
                      height="18px"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                    </svg>
                  </div>
                  <span className="truncate">Edit Profile</span>
                </button>
              </div>
              <div className="relative w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1">
                <Image
                  src={profile?.image || ""}
                  alt="Profile Image"
                  fill
                  className="rounded-xl object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <h2 className="text-gray-900 dark:text-zinc-100 text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Account Details
          </h2>
          <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
            <div className="col-span-2 grid grid-cols-subgrid border-t border-gray-300 dark:border-neutral-600 py-5">
              <p className="text-slate-600 dark:text-zinc-400 text-sm font-normal leading-normal">
                Role
              </p>
              <p className="text-gray-900 dark:text-zinc-100 text-sm font-normal leading-normal">
                {profile?.role === "admin" ? "Admin" : "User"}
              </p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-t border-gray-300 dark:border-neutral-600 py-5">
              <p className="text-slate-600 dark:text-zinc-400 text-sm font-normal leading-normal">
                Joined on
              </p>
              <p className="text-gray-900 dark:text-zinc-100 text-sm font-normal leading-normal">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-t border-gray-300 dark:border-neutral-600 py-5">
              <p className="text-slate-600 dark:text-zinc-400 text-sm font-normal leading-normal">
                Status
              </p>
              <p className="text-gray-900 dark:text-zinc-100 text-sm font-normal leading-normal">
                {profile?.emailVerified ? "Verified" : "Unverified"}
              </p>
            </div>
          </div>
          <h2 className="text-gray-900 dark:text-zinc-100 text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
            Security
          </h2>
          <ChangePassword />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
