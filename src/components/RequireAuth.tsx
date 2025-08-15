"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RequireAuthProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function RequireAuth({
  children,
  allowedRoles,
}: RequireAuthProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiredAt = localStorage.getItem("expiredAt");
    const user = JSON.parse(localStorage.getItem("user") as string);
    const role = user.role

    // Cek login
    if (!token || !expiredAt || Date.now() > Number(expiredAt)) {
      localStorage.clear();
      router.replace("/auth/sign-in");
      return;
    }

    // Cek role
    if (allowedRoles && !allowedRoles.includes(role || "")) {
      router.replace("/forbidden"); // bikin halaman forbidden
      return;
    }

    setIsChecking(false);
  }, [router, allowedRoles]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
