"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Swal from "sweetalert2";

interface Pengumuman {
  id: string;
  judul: string;
  isiKonten: string;
  isPublished: boolean;
  tanggalPublikasi: string;
}

export default function PengumumanPage() {
  const [data, setData] = useState<Pengumuman>();
  const [loading, setLoading] = useState(true);
  const params = useParams();

  const baseUrl = process.env.NEXT_PUBLIC_OPERASIONAL_SERVICE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/api/pengumuman/${params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire("Error", "Gagal memuat pengumuman", "error");
        setLoading(false);
      });
  }, []);

  console.log(data);

  return (
    <>
      <Breadcrumb pageName="Pengumuman" />
      <ShowcaseSection title="Pengumuman">
        {loading ? (
          <p className="italic text-gray-500">Memuat pengumuman...</p>
        ) : (
          <>
            <h2 className="mb-2 text-lg font-semibold text-gray-800">
              {data?.judul}
            </h2>
            <p className="mb-3 text-sm text-gray-500">
              Dipublikasikan:{" "}
              {new Date(data?.tanggalPublikasi || "").toLocaleDateString(
                "id-ID",
              )}
            </p>
            <p className="whitespace-pre-line text-gray-700">
              {data?.isiKonten}
            </p>
          </>
        )}
      </ShowcaseSection>
    </>
  );
}
