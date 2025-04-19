"use client"

import { adminState } from "@/store/adminState";
import { useRecoilValue } from "recoil";
import { AccountForm } from "./components/account-form";
import { ApplicationSettingsForm } from "./components/application-settings-form";
import Separator from "@/components/shared/separator";

export default function SettingsPage() {
  const adminData = useRecoilValue(adminState);

  return (
    <div className="space-y-8">
      <div className='from-black to-stone-500 bg-clip-text text-4xl font-medium'>
        Settings
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-medium">Account Settings</h2>
        <AccountForm />
      </div>

      <Separator className="my-8" />
      
      <div className="space-y-4">
        <h2 className="text-2xl font-medium">Application Management</h2>
        <ApplicationSettingsForm />
      </div>
    </div>
  );
}