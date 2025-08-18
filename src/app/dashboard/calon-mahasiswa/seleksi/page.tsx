"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";

interface JadwalSeleksi {
  namaSeleksi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  durasiMenit: number;
}

interface JadwalSesi {
  id: string;
  nomorPeserta: string;
  waktuMulai: string;
  waktuSelesai: string;
  statusUjian: string;
  jadwalSeleksi: JadwalSeleksi;
  skorUjian: number;
}

interface HasilSeleksi {
  statusKelulusan: string;
  programStudiDiterimaId: string;
  catatanAdmin: string;
}

export default function JadwalUjianPage() {
  const [sesi, setSesi] = useState<JadwalSesi | null>(null);
  const [hasil, setHasil] = useState<HasilSeleksi | null>(null);
  const [pendaftaranId, setPendaftaranId] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    const fetchSesi = async () => {
      const token = localStorage.getItem("token");
      const pendaftaranId = localStorage.getItem("pendaftaranId");

      setPendaftaranId(pendaftaranId);

      if (pendaftaranId) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SELEKSI_SERVICE_URL}/api/seleksi/sesi/${pendaftaranId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (res.ok) {
            const json = await res.json();
            setSesi(json.data);

            if (json.data.statusUjian === "SUDAH_DIVALIDASI") {
              const resHasil = await fetch(
                `${process.env.NEXT_PUBLIC_SELEKSI_SERVICE_URL}/api/seleksi/hasil/saya`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              if (resHasil.ok) {
                const hasilSeleksi = await resHasil.json();
                console.log(hasilSeleksi);
                setHasil(hasilSeleksi.data);
              }
            }
          } else {
            setPendaftaranId(null);
            Swal.fire("Gagal", "Gagal mengambil sesi ujian", "error");
          }
        } catch (err) {
          Swal.fire("Error", "Terjadi kesalahan saat mengambil data", "error");
        }
      }
    };
    fetchSesi();
  }, []);

  const handleMulaiUjian = async () => {
    const result = await Swal.fire({
      title: "Mulai Ujian?",
      text: "Setelah memulai, waktu ujian akan berjalan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, mulai!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      router.push("/dashboard/calon-mahasiswa/seleksi/pengerjaan");
    }
  };

  return (
    <>
      <Breadcrumb pageName="Seleksi" />
      {pendaftaranId === null ? (
        <ShowcaseSection title="Informasi">
          <p>Silahkan mendaftar telebih dahulu</p>
        </ShowcaseSection>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ShowcaseSection title="Sesi Ujian Anda">
            {sesi ? (
              <>
                <table className="w-full overflow-hidden rounded-lg border border-gray-300">
                  <tbody>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="bg-gray-50 p-3 py-1 font-bold capitalize text-gray-700">
                        Nomor Peserta
                      </td>
                      <td className="p-3 text-gray-800">{sesi.nomorPeserta}</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="bg-gray-50 p-3 py-1 font-bold capitalize text-gray-700">
                        Seleksi
                      </td>
                      <td className="p-3 text-gray-800">
                        {sesi.jadwalSeleksi.namaSeleksi}
                      </td>
                    </tr>

                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="bg-gray-50 p-3 py-1 font-bold capitalize text-gray-700">
                        Tanggal Mulai
                      </td>
                      <td className="p-3 text-gray-800">
                        {new Date(
                          sesi.jadwalSeleksi.tanggalMulai,
                        ).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="bg-gray-50 p-3 py-1 font-bold capitalize text-gray-700">
                        Tanggal Selesai
                      </td>
                      <td className="p-3 text-gray-800">
                        {new Date(
                          sesi.jadwalSeleksi.tanggalSelesai,
                        ).toLocaleDateString("id-ID")}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="bg-gray-50 p-3 py-1 font-bold capitalize text-gray-700">
                        Durasi
                      </td>
                      <td className="p-3 text-gray-800">
                        {sesi.jadwalSeleksi.durasiMenit} menit
                      </td>
                    </tr>
                    {sesi.waktuMulai && (
                      <>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="bg-gray-50 p-3 py-1 font-bold capitalize text-gray-700">
                            Waktu Mulai
                          </td>
                          <td className="p-3 text-gray-800">
                            {new Date(sesi?.waktuMulai).toLocaleString("ID")}
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="bg-gray-50 p-3 py-1 font-bold capitalize text-gray-700">
                            Waktu Selesai
                          </td>
                          <td className="p-3 text-gray-800">
                            {new Date(sesi?.waktuSelesai).toLocaleString("ID")}
                          </td>
                        </tr>
                      </>
                    )}
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="bg-gray-50 p-3 py-1 font-bold capitalize text-gray-700">
                        Status
                      </td>
                      <td className="p-3 text-gray-800">{sesi.statusUjian}</td>
                    </tr>
                    {sesi.skorUjian && (
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="bg-gray-50 p-3 py-1 font-bold capitalize text-gray-700">
                          Skor Ujian
                        </td>
                        <td className="p-3 text-gray-800">
                          {sesi.skorUjian * 100}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {!sesi.skorUjian && (
                  <div className="mt-4">
                    <Button
                      variant={"primary"}
                      shape={"rounded"}
                      label="Mulai Ujian"
                      onClick={handleMulaiUjian}
                    />
                  </div>
                )}
              </>
            ) : (
              <p>Memuat sesi ujian...</p>
            )}
          </ShowcaseSection>

          {sesi?.statusUjian === "SUDAH_DIVALIDASI" && (
            <ShowcaseSection title="Informasi Kelulusan">
              {hasil?.statusKelulusan ? (
                <table className="w-full border-collapse rounded-lg">
                  <tbody>
                    {[
                      {
                        label: "Status Kelulusan",
                        value: hasil?.statusKelulusan,
                      },
                      {
                        label: "Catatan Admin",
                        value: hasil?.catatanAdmin,
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
              ) : (
                <p>Memuat hasil ujian...</p>
              )}
            </ShowcaseSection>
          )}
        </div>
      )}
    </>
  );
}
