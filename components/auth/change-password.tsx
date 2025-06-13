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
        <div className="flex items-center  w-full  min-h-14 justify-between">
          <p className="text-white text-base font-normal leading-normal flex-1 truncate">
            Change Password
          </p>
          <div className="shrink-0">
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 bg-[#223649] text-white text-sm font-medium leading-normal w-fit"
              onClick={(e) => setIsChangePasswordOpen((prev) => !prev)}
            >
              <span className="truncate">Change</span>
            </button>
          </div>
        </div>
        {isChangePasswordOpen && (
          <form action={action} className="flex flex-col gap-4 w-full max-w-lg">
            {state?.message && (
              <p className="w-full border-green-700 border-2 text-green-700 rounded-md p-1 bg-green-200">
                {state.message}
              </p>
            )}

            {state?.errors?.message && (
              <p className="w-full border-red-700 border-2 text-red-700 rounded-md p-1 bg-red-200">
                {state.errors.message}
              </p>
            )}
            <Label htmlFor="password">Old Password</Label>
            <Input type="password" name="old-password" id="password" />
            {state?.errors?.oldPassword && (
              <p className="w-full border-red-700 border-2 text-red-700 rounded-md p-1 bg-red-200">
                {state.errors.oldPassword}
              </p>
            )}
            <Label htmlFor="new-password">New Password</Label>
            <Input type="password" name="new-password" id="password" />
            {state?.errors?.newPassword && (
              <p className="w-full border-red-700 border-2 text-red-700 rounded-md p-1 bg-red-200">
                {state.errors.newPassword}
              </p>
            )}
            <Label htmlFor="new-confirm-password">Confirm Password</Label>
            <Input type="password" name="new-confirm-password" id="password" />
            {state?.errors?.confirmPassword && (
              <p className="w-full border-red-700 border-2 text-red-700 rounded-md p-1 bg-red-200">
                {state.errors.confirmPassword}
              </p>
            )}
            <LoadingButton type="submit" isLoading={isPending}>
              Change
            </LoadingButton>
          </form>
        )}
      </div>
      <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
        <p className="text-white text-base font-normal leading-normal flex-1 truncate">
          Verify your email
        </p>
        <div className="shrink-0">
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 text-white text-sm font-medium leading-normal bg-[#223649] w-fit">
            <span className="truncate">Verified </span>
          </button>
        </div>
      </div>
      <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Danger Zone
      </h2>
      <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
        <p className="text-white text-base font-normal leading-normal flex-1 truncate">
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
