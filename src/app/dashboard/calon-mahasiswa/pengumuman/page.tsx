"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useRouter } from "next/navigation";
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
  const [data, setData] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  const baseUrl = process.env.NEXT_PUBLIC_OPERASIONAL_SERVICE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/api/pengumuman`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const publikasi = (res.data || [])
          .filter((p: Pengumuman) => p.isPublished)
          .sort(
            (a: Pengumuman, b: Pengumuman) =>
              new Date(b.tanggalPublikasi).getTime() -
              new Date(a.tanggalPublikasi).getTime(),
          );
        setData(publikasi);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire("Error", "Gagal memuat pengumuman", "error");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Breadcrumb pageName="Pengumuman" />
      <ShowcaseSection title="Pengumuman">
        {loading ? (
          <p className="italic text-gray-500">Memuat pengumuman...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-800">
            Belum ada pengumuman yang dipublikasikan.
          </p>
        ) : (
          <ul className="space-y-4">
            {data.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-50 cursor-pointer"
                onClick={()=>{
                  router.push(`/dashboard/calon-mahasiswa/pengumuman/${item.id}`)
                }}
              >
                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                  {item.judul}
                </h2>
                <p className="mb-3 text-sm text-gray-500">
                  Dipublikasikan:{" "}
                  {new Date(item.tanggalPublikasi).toLocaleDateString("id-ID")}
                </p>
                <p className="whitespace-pre-line text-gray-700">
                  {item.isiKonten}
                </p>
              </li>
            ))}
          </ul>
        )}
      </ShowcaseSection>
    </>
  );
}
