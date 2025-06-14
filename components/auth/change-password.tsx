"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingButton from "@/components/loading-button";
import { useFormState } from "react-dom";
import { changePassword } from "@/actions/profile-actions";
import { DeleteAlertDialog } from "@/app/(user)/profile/delete-alert";

const ChangePassword = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [state, action, isPending] = useFormState(changePassword, undefined);

  return (
    <>
      <div className="flex flex-col items-center gap-4 px-4 min-h-14">
        <div className="flex items-center w-full min-h-14 justify-between">
          <p className="text-gray-900 dark:text-zinc-100 text-base font-normal leading-normal flex-1 truncate">
            Change Password
          </p>
          <div className="shrink-0">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white text-sm font-medium leading-normal w-fit transition-colors"
              onClick={() => setIsChangePasswordOpen((prev) => !prev)}
            >
              <span className="truncate">Change</span>
            </button>
          </div>
        </div>
        {isChangePasswordOpen && (
          <form action={action} className="flex flex-col gap-4 w-full max-w-lg">
            {state?.message && (
              <p className="w-full border-green-600 dark:border-green-400 border-2 text-green-700 dark:text-green-300 rounded-md p-3 bg-green-50 dark:bg-green-900/20">
                {state.message}
              </p>
            )}

            {state?.errors?.message && (
              <p className="w-full border-red-600 dark:border-red-400 border-2 text-red-700 dark:text-red-300 rounded-md p-3 bg-red-50 dark:bg-red-900/20">
                {state.errors.message}
              </p>
            )}
            <Label htmlFor="old-password" className="text-gray-900 dark:text-zinc-100">
              Old Password
            </Label>
            <Input 
              type="password" 
              name="old-password" 
              id="old-password" 
              className="border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-zinc-100"
            />
            {state?.errors?.oldPassword && (
              <p className="w-full border-red-600 dark:border-red-400 border-2 text-red-700 dark:text-red-300 rounded-md p-3 bg-red-50 dark:bg-red-900/20">
                {state.errors.oldPassword}
              </p>
            )}
            <Label htmlFor="new-password" className="text-gray-900 dark:text-zinc-100">
              New Password
            </Label>
            <Input 
              type="password" 
              name="new-password" 
              id="new-password" 
              className="border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-zinc-100"
            />
            {state?.errors?.newPassword && (
              <p className="w-full border-red-600 dark:border-red-400 border-2 text-red-700 dark:text-red-300 rounded-md p-3 bg-red-50 dark:bg-red-900/20">
                {state.errors.newPassword}
              </p>
            )}
            <Label htmlFor="new-confirm-password" className="text-gray-900 dark:text-zinc-100">
              Confirm Password
            </Label>
            <Input 
              type="password" 
              name="new-confirm-password" 
              id="new-confirm-password" 
              className="border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-zinc-100"
            />
            {state?.errors?.confirmPassword && (
              <p className="w-full border-red-600 dark:border-red-400 border-2 text-red-700 dark:text-red-300 rounded-md p-3 bg-red-50 dark:bg-red-900/20">
                {state.errors.confirmPassword}
              </p>
            )}
            <LoadingButton 
              type="submit" 
              isLoading={isPending}
              className="bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white"
            >
              Change
            </LoadingButton>
          </form>
        )}
      </div>
      <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
        <p className="text-gray-900 dark:text-zinc-100 text-base font-normal leading-normal flex-1 truncate">
          Verify your email
        </p>
        <div className="shrink-0">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 text-white text-sm font-medium leading-normal bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 w-fit transition-colors">
            <span className="truncate">Verified</span>
          </button>
        </div>
      </div>
      <h2 className="text-gray-900 dark:text-zinc-100 text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Danger Zone
      </h2>
      <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
        <p className="text-gray-900 dark:text-zinc-100 text-base font-normal leading-normal flex-1 truncate">
          Delete Account
        </p>
        <div className="shrink-0">
          <DeleteAlertDialog />
        </div>
      </div>
    </>
  );
};

export default ChangePassword;