"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface ProgramStudi {
  id: string;
  namaProdi: string;
}

interface Pendaftar {
  id: string;
  nama: string;
  email_aktif: string;
  nik: string;
}

interface Sesi {
  id: string;
  jadwalSeleksiId: string;
  pendaftaranId: string;
  calonMahasiswaId: string;
  nomorPeserta: string;
  statusUjian: string;
  skorUjian: number;
  waktuMulai: string;
  waktuSelesai: string;
  pendaftar?: Pendaftar;
}

export default function ValidasiSesiPage() {
  const [sesiList, setSesiList] = useState<Sesi[]>([]);
  const [programStudiList, setProgramStudiList] = useState<ProgramStudi[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const baseUrl = process.env.NEXT_PUBLIC_SELEKSI_SERVICE_URL;
  const urlOperasional = process.env.NEXT_PUBLIC_OPERASIONAL_SERVICE_URL;
  const urlPendaftaran = process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL;

  const fetchData = async () => {
    try {
      setLoading(true);

      // ambil sesi
      const resSesi = await fetch(`${baseUrl}/api/seleksi/sesi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataSesi = await resSesi.json();

      // ambil program studi
      const resProdi = await fetch(`${urlOperasional}/api/program-studi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataProdi = await resProdi.json();

      // ambil pendaftar untuk setiap sesi
      const sesiDenganPendaftar: Sesi[] = await Promise.all(
        (dataSesi.data || []).map(async (item: Sesi) => {
          try {
            const resPendaftar = await fetch(
              `${urlPendaftaran}/api/pendaftaran/${item.pendaftaranId}`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            const dataPendaftar = await resPendaftar.json();
            return {
              ...item,
              pendaftar: dataPendaftar.data.dataFormulir || null,
            };
          } catch {
            return { ...item, pendaftar: undefined };
          }
        }),
      );

      setSesiList(sesiDenganPendaftar);
      setProgramStudiList(dataProdi.data || []);
    } catch (err) {
      console.error(err);
      MySwal.fire("Error", "Gagal memuat data sesi", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleValidasi = async (sesi: Sesi) => {
    const { value: formValues } = await MySwal.fire({
      title: "Validasi Sesi",
      html: `
      <div style="text-align:left; font-size:14px;">
        <label class="block mb-1 font-semibold">Status Kelulusan</label>
        <select id="status" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px">
          <option value="LULUS">LULUS</option>
          <option value="TIDAK_LULUS">TIDAK LULUS</option>
          <option value="CADANGAN">CADANGAN</option>
        </select>

        <label class="block mt-3 mb-1 font-semibold">Program Studi Diterima</label>
        <select id="prodi" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px">
          <option value="">-- Pilih Program Studi --</option>
          ${programStudiList
            .map((p) => `<option value="${p.id}">${p.namaProdi}</option>`)
            .join("")}
        </select>

        <label class="block mt-3 mb-1 font-semibold">Catatan Admin</label>
        <textarea id="catatan" rows="4" placeholder="Catatan Admin" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px"></textarea>
      </div>
    `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          statusKelulusan: (
            document.getElementById("status") as HTMLSelectElement
          ).value,
          programStudiDiterimaId: (
            document.getElementById("prodi") as HTMLSelectElement
          ).value,
          catatanAdmin: (
            document.getElementById("catatan") as HTMLTextAreaElement
          ).value,
        };
      },
    });

    if (!formValues) return;

    try {
      Swal.fire({
        title: "Memvalidasi...",
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
      });

      const res = await fetch(`${baseUrl}/api/seleksi/hasil-seleksi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pendaftaranId: sesi.pendaftaranId,
          calonMahasiswaId: sesi.calonMahasiswaId,
          statusKelulusan: formValues.statusKelulusan,
          programStudiDiterimaId: formValues.programStudiDiterimaId || null,
          catatanAdmin: formValues.catatanAdmin,
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan hasil seleksi");

      MySwal.fire("Sukses", "Hasil seleksi berhasil disimpan", "success");
    } catch (err) {
      console.error(err);
      MySwal.fire("Error", "Gagal memproses validasi", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Validasi Seleksi" />
      <ShowcaseSection title="Data Validasi Seleksi">
        <div className="space-y-4">
          {loading ? (
            <p>Memuat...</p>
          ) : (
            <table className="w-full overflow-hidden rounded-lg border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-start">Nomor Peserta</th>
                  <th className="p-4 text-start">Nama</th>
                  <th className="p-4 text-start">Email</th>
                  <th className="p-4 text-start">Skor Ujian</th>
                  <th className="p-4 text-start">Status Ujian</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sesiList.map((sesi) => (
                  <tr key={sesi.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 text-start">{sesi.nomorPeserta}</td>
                    <td className="p-4 text-start">
                      {sesi.pendaftar?.nama || "-"}
                    </td>
                    <td className="p-4 text-start">
                      {sesi.pendaftar?.email_aktif || "-"}
                    </td>
                    <td className="p-4 text-start">
                      {sesi.skorUjian * 100 || "-"}
                    </td>
                    <td className="p-4 text-start">{sesi.statusUjian}</td>
                    <td className="p-4 text-center">
                      {sesi.statusUjian !== "SUDAH_DIVALIDASI" && (
                        <button
                          onClick={() => handleValidasi(sesi)}
                          className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                        >
                          Validasi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </ShowcaseSection>
    </>
  );
}
