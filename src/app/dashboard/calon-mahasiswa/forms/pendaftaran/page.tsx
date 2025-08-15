"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface dataGelombang {
  gelombangAktif: [];
}

export default function Page() {
  const [pendaftaran, setPendaftaran] = useState<any>({});
  const [dataFormulir, setDataFormulir] = useState<any>({});
  const [pendaftaranId, setPendaftaranId] = useState<any>(null);
  const [data, setData] = useState<dataGelombang>();

  const router = useRouter();

  useEffect(() => {
    const pendaftaranId = localStorage.getItem("pendaftaranId");
    setPendaftaranId(pendaftaranId);
    const token = localStorage.getItem("token");

    if (pendaftaranId) {
      const getPendaftaran = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL}/api/pendaftaran/${pendaftaranId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const pendaftaran = await res.json();
          if (res.ok) {
            setPendaftaran(pendaftaran);
            setDataFormulir(pendaftaran.data.dataFormulir);
          } else {
            setPendaftaranId(null);
          }
        } catch (error) {
          console.log(error);
        }
      };

      getPendaftaran();
    }
    fetch(`${process.env.NEXT_PUBLIC_OPERASIONAL_SERVICE_URL}/api/public`)
      .then((res) => res.json())
      .then((resData) => setData(resData.data))
      .catch((err) => console.error("Gagal memuat data:", err));
  }, []);

  const handlePilihGelombang = (gelombangId: string) => {
    localStorage.setItem("gelombangId", gelombangId);
    router.push("/dashboard/calon-mahasiswa/forms/pendaftaran/data-pribadi");
  };

  if (!data) return <p>Memuat data...</p>;

  return (
    <>
      <Breadcrumb pageName="Pendaftaran" />

      {pendaftaranId === null ? (
        <ShowcaseSection title="Pilih Gelombang">
          {data?.gelombangAktif?.length === 0 ? (
            <p className="text-gray-800">Belum ada gelombang aktif saat ini.</p>
          ) : (
            <ul className="grid gap-4">
              {data.gelombangAktif.map((gelombang: any) => (
                <li
                  key={gelombang.id}
                  className="cursor-pointer rounded-lg border p-6 text-slate-800 hover:bg-gray-50"
                  onClick={() => handlePilihGelombang(gelombang.id)}
                >
                  <h2 className="mb-6 text-xl font-semibold">
                    {gelombang.nama}
                  </h2>
                  <p className="mb-1 text-sm text-gray-600">
                    Tahun Akademik: {gelombang.tahunAkademik}
                  </p>
                  <p className="text-sm text-gray-600">
                    Periode:{" "}
                    {new Date(gelombang.tanggalMulai).toLocaleDateString(
                      "id-ID",
                    )}{" "}
                    -{" "}
                    {new Date(gelombang.tanggalSelesai).toLocaleDateString(
                      "id-ID",
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </ShowcaseSection>
      ) : (
        <>
          <div className="md-12 mb-6 grid grid-cols-1 gap-6 md:mb-12 md:grid-cols-2 md:gap-12">
            <ShowcaseSection title="Informasi">
              <table className="w-full border-collapse rounded-lg">
                <tbody>
                  {[
                    {
                      label: "Nomor Pendaftaran",
                      value: pendaftaran?.data?.nomorPendaftaran,
                    },
                    {
                      label: "Gelombang Id",
                      value: pendaftaran?.data?.gelombangId,
                    },
                    {
                      label: "Status Pendaftaran",
                      value: pendaftaran?.data?.status,
                    },
                    {
                      label: "Catatan Admin",
                      value: pendaftaran?.data?.catatanAdmin,
                    },
                  ].map((item, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                    >
                      <td className="w-1/3 px-4 py-3 font-semibold text-slate-800">
                        {item.label}
                      </td>
                      <td className="w-1 px-2 py-3 text-gray-500">:</td>
                      <td className="px-4 py-3 text-gray-700">
                        {item.value || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ShowcaseSection>
          </div>
          <ShowcaseSection title="Data Formulir">
            {dataFormulir && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {Object.entries(dataFormulir).map(([key, value]) => (
                      <tr
                        key={key}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="bg-gray-50 p-3 font-medium capitalize text-gray-700">
                          {key.replace(/_/g, " ")}
                        </td>
                        <td className="p-3 text-gray-800">
                          {String(value ?? "-")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ShowcaseSection>
        </>
      )}
    </>
  );
}
