"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompetitionResultsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home/competition-results");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to Competition Results management...</p>
    </div>
  );
} 