"use client"

import { useRecoilValue } from "recoil";
import { userState } from "@/store/userState";
import { useAuthGuard } from "@/components/hooks/use-auth-guard";
import ProfileSkeleton from "../profile/profile-skeleton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TeamPage() {
  const userData = useRecoilValue<any>(userState);
  const router = useRouter();
  useAuthGuard();
  
  useEffect(() => {
    // Redirect to application page after a short delay with a message
    const timeout = setTimeout(() => {
      router.push(`/${userData?.locale || 'fr'}/profile/application`);
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [router, userData]);

  return (
    <div className="z-10 w-full px-5 max-w-screen-xl xl:px-0">
      <div className="space-y-6 p-10 pb-16">
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <h2 className="text-xl font-semibold mb-2">Changement important</h2>
          <p className="mb-2">
            Les candidatures en équipe ne sont plus requises. Chaque participant peut désormais postuler individuellement.
          </p>
          <p>
            Vous allez être redirigé vers la page des candidatures individuelles dans quelques secondes...
          </p>
        </div>
      </div>
    </div>
  );
}