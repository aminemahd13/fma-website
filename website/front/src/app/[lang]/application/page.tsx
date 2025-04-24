"use client"

import { ApplicationForm } from "./form/application-form";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";
import { useAuthGuard } from "@/components/hooks/use-auth-guard";
import ProfileSkeleton from "../profile/profile-skeleton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getApplicationsOpenStatus } from "@/api/SettingsApi";
import { Button } from "@/components/shared";

export default function ApplicationPage() {
  const userData = useRecoilValue<any>(userState);
  const router = useRouter();
  const [isApplicationsOpen, setIsApplicationsOpen] = useState<boolean>(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);
  useAuthGuard();

  // Check if applications are open
  useEffect(() => {
    const checkApplicationStatus = async () => {
      try {
        const response = await getApplicationsOpenStatus() as any;
        if (response?.statusCode === 200) {
          setIsApplicationsOpen(response.isOpen);
        } else {
          setIsApplicationsOpen(false);
        }
      } catch (error) {
        console.error("Failed to check application status", error);
        setIsApplicationsOpen(false);
      } finally {
        setIsCheckingStatus(false);
      }
    };
    
    checkApplicationStatus();
  }, []);

  if (!userData) {
    return <ProfileSkeleton />
  }

  // If checking status, show loading
  if (isCheckingStatus) {
    return <ProfileSkeleton />
  }

  // If applications are closed and user doesn't have a non-draft application, show closed message
  if (!isApplicationsOpen && (!userData?.application || userData?.application?.status?.status === 'DRAFT')) {
    return (
      <div className="z-10 w-full px-5 max-w-screen-xl xl:px-0">
        <div className="space-y-6 p-10 pb-16">
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-md">
            <h2 className="text-xl font-semibold">
              Les inscriptions sont désormais closes
            </h2>
            <div className="mt-4">
              <p className="mb-4">Merci pour l&apos;intérêt que vous portez à FMA! Malheureusement les inscriptions sont désormais closes.</p>
              <p className="mb-4">Néanmoins, restez à l&apos;écoute pour ne pas manquer de futures opportunités.</p>
              <Button
                onClick={() => router.push(`/${userData?.locale || 'fr'}/profile/application`)}
                className="mt-2"
              >
                Retour au profil
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Allow users to access the form if:
  // 1. Applications are open OR
  // 2. User has an existing non-draft application
  return (
    <div className="z-10 w-full px-5 max-w-screen-xl xl:px-0">
      <div className="space-y-6 p-10 pb-16">
        <ApplicationForm userData={userData} />
      </div>
    </div>
  )
}