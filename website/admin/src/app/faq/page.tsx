"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FAQRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home/faq");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Redirecting to FAQ management...</p>
    </div>
  );
} 