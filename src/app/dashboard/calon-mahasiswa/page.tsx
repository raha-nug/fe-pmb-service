"use client";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const checkPendaftaran = async () => {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") as string);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL}/api/pendaftaran/${user?.id}/mhs-id`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const pendaftaran = await res.json();
        console.log(pendaftaran.data.id);
        localStorage.setItem("pendaftaranId", pendaftaran.data.id);
        localStorage.setItem("gelombangId", pendaftaran.data.gelombangId);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    checkPendaftaran();
  }, []);

  return (
    <>
      <ShowcaseSection title="">
        {loading ? (
          <p>Loading..</p>
        ) : (
          <h2 className="text-center text-2xl font-extrabold text-slate-700">
            Selamat Datang!
          </h2>
        )}
      </ShowcaseSection>
    </>
  );
}
