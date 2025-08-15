"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface Gelombang {
  id: string;
  nama: string;
}

interface SoalUjianSet {
  id: string;
  namaSet: string;
}

interface JadwalSeleksi {
  id: string;
  gelombangId: string;
  namaSeleksi: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  durasiMenit: number;
  soalUjianSetId?: string | null;
}

export default function CrudJadwalSeleksi() {
  const [jadwalList, setJadwalList] = useState<JadwalSeleksi[]>([]);
  const [gelombangList, setGelombangList] = useState<Gelombang[]>([]);
  const [soalSetList, setSoalSetList] = useState<SoalUjianSet[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const baseUrl = process.env.NEXT_PUBLIC_SELEKSI_SERVICE_URL;
  const urlOperasional = process.env.NEXT_PUBLIC_OPERASIONAL_SERVICE_URL;

  const fetchData = async () => {
    try {
      setLoading(true);
      // Ambil jadwal
      const resJadwal = await fetch(`${baseUrl}/api/seleksi/jadwal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataJadwal = await resJadwal.json();

      // Ambil gelombang
      const resGelombang = await fetch(`${urlOperasional}/api/gelombang`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataGelombang = await resGelombang.json();

      // Ambil soal set
      const resSoalSet = await fetch(`${baseUrl}/api/seleksi/soal-set`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataSoalSet = await resSoalSet.json();

      setJadwalList(dataJadwal.data || []);
      setGelombangList(dataGelombang.data || []);
      setSoalSetList(dataSoalSet.data || []);
    } catch (error) {
      console.error(error);
      MySwal.fire("Error", "Gagal memuat data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tambah / Edit Jadwal
  const handleForm = async (
    mode: "tambah" | "edit",
    existingData?: JadwalSeleksi,
  ) => {
    const gelombangOptions = gelombangList
      .map(
        (g) =>
          `<option value="${g.id}" ${existingData?.gelombangId === g.id ? "selected" : ""}>${g.nama}</option>`,
      )
      .join("");
    const soalSetOptions = soalSetList
      .map(
        (s) =>
          `<option value="${s.id}" ${existingData?.soalUjianSetId === s.id ? "selected" : ""}>${s.namaSet}</option>`,
      )
      .join("");

    const { value: formValues } = await MySwal.fire({
      title:
        mode === "tambah" ? "Tambah Jadwal Seleksi" : "Edit Jadwal Seleksi",
      html: `
        <div style="text-align:left; font-size:14px;">
          <label class="block mb-1 font-semibold">Gelombang</label>
          <select id="gelombang" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px">
            ${gelombangOptions}
          </select>

          <label class="block mt-3 mb-1 font-semibold">Nama Seleksi</label>
          <input id="namaSeleksi" type="text" value="${existingData?.namaSeleksi || ""}" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px" />

          <label class="block mt-3 mb-1 font-semibold">Tanggal Mulai</label>
          <input id="tanggalMulai" type="date" value="${existingData?.tanggalMulai?.slice(0, 10) || ""}" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px" />

          <label class="block mt-3 mb-1 font-semibold">Tanggal Selesai</label>
          <input id="tanggalSelesai" type="date" value="${existingData?.tanggalSelesai?.slice(0, 10) || ""}" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px" />

          <label class="block mt-3 mb-1 font-semibold">Durasi (menit)</label>
          <input id="durasi" type="number" min="1" value="${existingData?.durasiMenit || 60}" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px" />

          <label class="block mt-3 mb-1 font-semibold">Set Soal (opsional)</label>
          <select id="soalSet" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px">
            <option value="">-- Pilih Set Soal --</option>
            ${soalSetOptions}
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
      preConfirm: () => {
        const gelombangId = (
          document.getElementById("gelombang") as HTMLSelectElement
        ).value;
        const namaSeleksi = (
          document.getElementById("namaSeleksi") as HTMLInputElement
        ).value.trim();
        const tanggalMulai = (
          document.getElementById("tanggalMulai") as HTMLInputElement
        ).value;
        const tanggalSelesai = (
          document.getElementById("tanggalSelesai") as HTMLInputElement
        ).value;
        const durasiMenitStr = (
          document.getElementById("durasi") as HTMLInputElement
        ).value;
        const soalSetId = (
          document.getElementById("soalSet") as HTMLSelectElement
        ).value;

        if (
          !gelombangId ||
          !namaSeleksi ||
          !tanggalMulai ||
          !tanggalSelesai ||
          !durasiMenitStr
        ) {
          MySwal.showValidationMessage(
            "Semua field kecuali Set Soal wajib diisi",
          );
          return;
        }

        const durasiMenit = Number(durasiMenitStr);
        if (durasiMenit <= 0) {
          MySwal.showValidationMessage("Durasi harus lebih dari 0");
          return;
        }

        const tanggalMulaiISO = new Date(tanggalMulai).toISOString();
        const tanggalSelesaiISO = new Date(tanggalSelesai).toISOString();

        return {
          gelombangId,
          namaSeleksi,
          tanggalMulai: tanggalMulaiISO,
          tanggalSelesai: tanggalSelesaiISO,
          durasiMenit,
          soalUjianSetId: soalSetId || null,
        };
      },
    });

    if (formValues) {
      try {
        Swal.fire({
          title: "Menyimpan...",
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false,
        });

        const url =
          mode === "tambah"
            ? `${baseUrl}/api/seleksi/jadwal`
            : `${baseUrl}/api/seleksi/jadwal/${existingData?.id}`;

        const method = mode === "tambah" ? "POST" : "PUT";

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formValues),
        });

        if (res.ok) {
          MySwal.fire(
            "Berhasil",
            `Jadwal seleksi berhasil ${mode === "tambah" ? "ditambahkan" : "diedit"}`,
            "success",
          );
          fetchData();
        } else {
          const err = await res.json();
          MySwal.fire(
            "Gagal",
            err.message || "Terjadi kesalahan saat menyimpan",
            "error",
          );
        }
      } catch (err) {
        console.error(err);
        MySwal.fire("Error", "Tidak dapat terhubung ke server", "error");
      }
    }
  };

  // Hapus jadwal seleksi
  const handleDelete = async (id: string) => {
    const confirm = await MySwal.fire({
      title: "Hapus Jadwal Seleksi?",
      text: "Data yang dihapus tidak dapat dikembalikan",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
    });

    if (confirm.isConfirmed) {
      try {
        Swal.fire({
          title: "Menghapus...",
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false,
        });

        const res = await fetch(`${baseUrl}/api/seleksi/jadwal/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          MySwal.fire("Berhasil", "Jadwal seleksi berhasil dihapus", "success");
          fetchData();
        } else {
          const err = await res.json();
          MySwal.fire(
            "Gagal",
            err.message || "Gagal menghapus jadwal seleksi",
            "error",
          );
        }
      } catch (err) {
        console.error(err);
        MySwal.fire("Error", "Tidak dapat terhubung ke server", "error");
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Jadwal Seleksi" />
      <ShowcaseSection title="Data Jadwal Seleksi">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              size={"small"}
              variant={"primary"}
              shape={"rounded"}
              label="+ Jadwal"
              onClick={() => handleForm("tambah")}
            />
          </div>

          {loading ? (
            <p className="italic text-gray-500">Memuat data...</p>
          ) : jadwalList.length === 0 ? (
            <p className="text-center italic text-gray-500">
              Belum ada jadwal seleksi
            </p>
          ) : (
            <table className="w-full overflow-hidden rounded-lg border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Gelombang</th>
                  <th className="p-3 text-left">Nama Seleksi</th>
                  <th className="p-3 text-left">Tanggal Mulai</th>
                  <th className="p-3 text-left">Tanggal Selesai</th>
                  <th className="p-3 text-left">Durasi (menit)</th>
                  <th className="p-3 text-left">Set Soal</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jadwalList.map((jadwal) => {
                  const gelombang = gelombangList.find(
                    (g) => g.id === jadwal.gelombangId,
                  );
                  const soalSet = soalSetList.find(
                    (s) => s.id === jadwal.soalUjianSetId,
                  );
                  return (
                    <tr key={jadwal.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{gelombang?.nama || "-"}</td>
                      <td className="p-3">{jadwal.namaSeleksi}</td>
                      <td className="p-3">
                        {jadwal.tanggalMulai.slice(0, 10)}
                      </td>
                      <td className="p-3">
                        {jadwal.tanggalSelesai.slice(0, 10)}
                      </td>
                      <td className="p-3">{jadwal.durasiMenit}</td>
                      <td className="p-3">{soalSet?.namaSet || "-"}</td>
                      <td className="flex justify-center gap-2 p-3">
                        <button
                          onClick={() => handleForm("edit", jadwal)}
                          className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(jadwal.id)}
                          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </ShowcaseSection>
    </>
  );
}
