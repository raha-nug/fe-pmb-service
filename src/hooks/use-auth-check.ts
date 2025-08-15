"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuthCheck() {
  const router = useRouter();

  useEffect(() => {
    const expiredAt = localStorage.getItem("expiredAt");

    if (!expiredAt) {
      router.push("/auth/sign-in");
      return;
    }

    const now = Date.now();
    const exp = parseInt(expiredAt, 10);

    if (isNaN(exp) || now > exp) {
      // Token expired → hapus dan redirect
      localStorage.removeItem("expiredAt");
      router.push("/auth/login");
    }
  }, [router]);
}
