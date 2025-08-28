"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [beasiswa, setBeasiswa] = useState<any>(null);
  const [dataFormulir, setDataFormulir] = useState<any>({});
  const [data, setData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const pendaftaranId = localStorage.getItem("pendaftaranId");
    const token = localStorage.getItem("token");

    if (pendaftaranId) {
      const getBeasiswa = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL}/api/beasiswa/aplikasi/${pendaftaranId}/pendaftaran`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const beasiswa = await res.json();
          if (res.ok) {
            setBeasiswa(beasiswa);
            setDataFormulir(beasiswa.data.dataPengajuan);
          }
        } catch (error) {
          console.log(error);
        }
      };

      getBeasiswa();
    }
  }, []);

  if (!dataFormulir) return <p>Memuat data...</p>;

  return (
    <>
      <Breadcrumb pageName="Aplikasi Beasiswa" />

      {beasiswa == null ? (
        <ShowcaseSection title="Informasi" className="!p-7">
          <p>
            Silahkan mendaftar terlebih dahulu pada{" "}
            <Link target="blank" href={"https://docs.google.com/forms/d/e/1FAIpQLScb6a193raegUxfELS3KUoUXmCVkyJIqrczIZo3Wu2xGsSShQ/viewform"} className="underline text-blue-400">link berikut</Link>
          </p>
        </ShowcaseSection>
      ) : (
        <>
          <div className="md-12 mb-6 grid grid-cols-1 gap-6 md:mb-12 md:grid-cols-2 md:gap-12">
            <ShowcaseSection title="Informasi">
              <div className="mb-2 flex gap-2">
                <div className="font-bold text-slate-800">Pendaftaran Id</div>
                <div>:</div>
                <div>{beasiswa?.data?.pendaftaranId}</div>
              </div>

              <div className="mb-2 flex gap-2">
                <div className="font-bold text-slate-800">Status Aplikasi</div>
                <div>:</div>
                <div>{beasiswa?.data?.statusAplikasi}</div>
              </div>
              <div className="mb-2 flex gap-2">
                <div className="font-bold text-slate-800">Catatan Admin</div>
                <div>:</div>
                <div>{beasiswa?.data?.catatanAdmin}</div>
              </div>
              <div className="mb-2 flex gap-2">
                <div className="font-bold text-slate-800">Diajukan Pada</div>
                <div>:</div>
                <div>{beasiswa?.data?.diajukanPada}</div>
              </div>
            </ShowcaseSection>
          </div>
          <ShowcaseSection title="Data Formulir">
            {dataFormulir && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
                  <p className="font-semibold text-slate-800">Nama Lengkap:</p>
                  <p>{dataFormulir.nama}</p>

                  <p className="font-semibold text-slate-800">Tempat Lahir:</p>
                  <p>{dataFormulir.tempat_lahir}</p>

                  <p className="font-semibold text-slate-800">Tanggal Lahir:</p>
                  <p>{dataFormulir.tanggal_lahir}</p>

                  <p className="font-semibold text-slate-800">Jenis Kelamin:</p>
                  <p>{dataFormulir.jenis_kelamin}</p>

                  <p className="font-semibold text-slate-800">Email Aktif:</p>
                  <p>{dataFormulir.email_aktif}</p>

                  <p className="font-semibold text-slate-800">No HP:</p>
                  <p>{dataFormulir.no_tlp}</p>

                  <p className="font-semibold text-slate-800">Agama:</p>
                  <p>{dataFormulir.agama}</p>

                  <p className="font-semibold text-slate-800">No KTP:</p>
                  <p>{dataFormulir.no_ktp}</p>

                  <p className="font-semibold text-slate-800">No KK:</p>
                  <p>{dataFormulir.no_kk}</p>

                  <p className="font-semibold text-slate-800">Alamat:</p>
                  <p>{dataFormulir.alamat}</p>

                  <p className="font-semibold text-slate-800">
                    Desa / Kelurahan:
                  </p>
                  <p>{dataFormulir.desa_kelurahan}</p>

                  <p className="font-semibold text-slate-800">Kecamatan:</p>
                  <p>{dataFormulir.kecamatan}</p>

                  <p className="font-semibold text-slate-800">
                    Kabupaten / Kota:
                  </p>
                  <p>{dataFormulir.kota_kabupaten}</p>

                  <p className="font-semibold text-slate-800">
                    Nama Ayah Kandung:
                  </p>
                  <p>{dataFormulir.nama_ayah_kandung}</p>

                  <p className="font-semibold text-slate-800">
                    Nama Ibu Kandung:
                  </p>
                  <p>{dataFormulir.nama_ibu_kandung}</p>

                  <p className="font-semibold text-slate-800">No HP Ortu:</p>
                  <p>{dataFormulir.no_tlp_ortu}</p>

                  <p className="font-semibold text-slate-800">Asal Sekolah:</p>
                  <p>{dataFormulir.nama_asal_sekolah}</p>

                  <p className="font-semibold text-slate-800">Tahun Lulus:</p>
                  <p>{dataFormulir.tahun_lulus_sma}</p>

                  <p className="font-semibold text-slate-800">NISN:</p>
                  <p>{dataFormulir.nisn}</p>

                  <p className="font-semibold text-slate-800">NPSN:</p>
                  <p>{dataFormulir.npsn}</p>

                  <p className="font-semibold text-slate-800">
                    Nomor Pendaftaran KIPK:
                  </p>
                  <p>{dataFormulir.no_pendaftaran_kipk}</p>

                  <p className="font-semibold text-slate-800">Prodi:</p>
                  <p>{dataFormulir.prodi}</p>

                  <p className="font-semibold text-slate-800">Sistem Kuliah:</p>
                  <p>{dataFormulir.sistem_kuliah}</p>

                  <p className="font-semibold text-slate-800">
                    Rencana Tempat Tinggal:
                  </p>
                  <p>{dataFormulir.rencana_tinggal}</p>

                  <p className="font-semibold text-slate-800">
                    Alat Transportasi:
                  </p>
                  <p>{dataFormulir.alat_transportasi}</p>

                  <p className="font-semibold text-slate-800">Referal:</p>
                  <p>{dataFormulir.pemberi_rekomendasi}</p>

                  <p className="font-semibold text-slate-800">No HP Referal:</p>
                  <p>{dataFormulir.no_hp_pemberi_rekomendasi}</p>

                  <p className="font-semibold text-slate-800">
                    Asal Info STTC:
                  </p>
                  <p>{dataFormulir.asal_info_sttc}</p>

                  <p className="font-semibold text-slate-800">
                    Mengajukan Beasiswa:
                  </p>
                  <p>{dataFormulir.daftar_beasiswa}</p>
                </div>
              </div>
            )}
          </ShowcaseSection>
        </>
      )}
    </>
  );
}
