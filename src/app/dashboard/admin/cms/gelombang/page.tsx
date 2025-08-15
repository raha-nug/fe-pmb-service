"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Enum di frontend, sesuaikan dengan backend
const StatusGelombangOptions = [
  { label: "Segera Dibuka", value: "SEGERA_DIBUKA" },
  { label: "Aktif", value: "AKTIF" },
  { label: "Ditutup", value: "DITUTUP" },
];

export default function CrudGelombangPage() {
  const [gelombang, setGelombang] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const baseUrl = process.env.NEXT_PUBLIC_OPERASIONAL_SERVICE_URL;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/gelombang`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGelombang(data.data || []);
    } catch (err) {
      console.error(err);
      MySwal.fire("Error", "Gagal memuat data gelombang", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleForm = async (mode: "tambah" | "edit", existingData?: any) => {
    const defaultStatus = existingData?.status || "SEGERA_DIBUKA";

    const { value: formValues } = await MySwal.fire({
      title: mode === "tambah" ? "Tambah Gelombang" : "Edit Gelombang",
      html: `
        <div style="text-align:left; font-size:14px;">
          <label class="block mb-1 font-semibold">Nama Gelombang</label>
          <input id="nama" type="text" value="${existingData?.nama || ""}" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px"/>

          <label class="block mt-3 mb-1 font-semibold">Tahun Akademik</label>
          <input id="tahunAkademik" type="text" placeholder="contoh: 2024/2025" value="${existingData?.tahunAkademik || ""}" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px"/>

          <label class="block mt-3 mb-1 font-semibold">Tanggal Mulai</label>
          <input id="tanggalMulai" type="datetime-local" value="${
            existingData
              ? new Date(existingData.tanggalMulai).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16) || ""
          }" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px"/>

          <label class="block mt-3 mb-1 font-semibold">Tanggal Selesai</label>
          <input id="tanggalSelesai" type="datetime-local" value="${
            existingData
              ? new Date(existingData.tanggalSelesai).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16) || ""
          }" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px"/>

          <label class="block mt-3 mb-1 font-semibold">Status</label>
          <select id="status" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px">
            ${StatusGelombangOptions.map(
              (opt) =>
                `<option value="${opt.value}" ${
                  opt.value === defaultStatus ? "selected" : ""
                }>${opt.label}</option>`,
            ).join("")}
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
      preConfirm: () => {
        const nama = (
          document.getElementById("nama") as HTMLInputElement
        ).value.trim();
        const tahunAkademik = (
          document.getElementById("tahunAkademik") as HTMLInputElement
        ).value.trim();
        const tanggalMulai = (
          document.getElementById("tanggalMulai") as HTMLInputElement
        ).value;
        const tanggalSelesai = (
          document.getElementById("tanggalSelesai") as HTMLInputElement
        ).value;
        const status = (document.getElementById("status") as HTMLSelectElement)
          .value;

        if (
          !nama ||
          !tahunAkademik ||
          !tanggalMulai ||
          !tanggalSelesai ||
          !status
        ) {
          MySwal.showValidationMessage("Semua field wajib diisi");
          return;
        }

        const dataToReturn = {
          nama,
          tahunAkademik,
          status,
          tanggalMulai: new Date(tanggalMulai).toISOString(),
          tanggalSelesai: new Date(tanggalSelesai).toISOString(),
        };

        return dataToReturn;
      },
    });

    if (formValues) {
      try {
        Swal.fire({
          title: "Menyimpan...",
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false,
        });

        const res = await fetch(
          mode === "tambah"
            ? `${baseUrl}/api/gelombang`
            : `${baseUrl}/api/gelombang/${existingData.id}`,
          {
            method: mode === "tambah" ? "POST" : "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formValues),
          },
        );

        if (res.ok) {
          MySwal.fire(
            "Berhasil",
            `Gelombang berhasil ${mode === "tambah" ? "ditambahkan" : "diedit"}`,
            "success",
          );
          fetchData();
        } else {
          MySwal.fire("Gagal", "Terjadi kesalahan saat menyimpan", "error");
        }
      } catch (err) {
        console.error(err);
        MySwal.fire("Error", "Tidak dapat terhubung ke server", "error");
      }
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await MySwal.fire({
      title: "Hapus Gelombang?",
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
        const res = await fetch(`${baseUrl}/api/gelombang/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          MySwal.fire("Berhasil", "Gelombang dihapus", "success");
          fetchData();
        } else {
          MySwal.fire("Gagal", "Tidak dapat menghapus data", "error");
        }
      } catch (err) {
        console.error(err);
        MySwal.fire("Error", "Tidak dapat terhubung ke server", "error");
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Gelombang" />

      <ShowcaseSection title="Data Gelombang">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              size={"small"}
              variant={"primary"}
              shape={"rounded"}
              label="+ Gelombang"
              onClick={() => handleForm("tambah")}
            />
          </div>

          {loading ? (
            <p className="italic text-gray-500">Memuat data...</p>
          ) : (
            <table className="w-full overflow-hidden rounded-lg border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Nama Gelombang</th>
                  <th className="p-3 text-left">Tahun Akademik</th>
                  <th className="p-3 text-left">Tanggal Mulai</th>
                  <th className="p-3 text-left">Tanggal Selesai</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {gelombang.map((g) => (
                  <tr key={g.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{g.nama}</td>
                    <td className="p-3">{g.tahunAkademik}</td>
                    <td className="p-3">
                      {new Date(g.tanggalMulai).toLocaleDateString("ID")}
                    </td>
                    <td className="p-3">
                      {new Date(g.tanggalSelesai).toLocaleDateString("ID")}
                    </td>
                    <td className="p-3">{g.status}</td>
                    <td className="flex justify-center gap-2 p-3">
                      <button
                        onClick={() => handleForm("edit", g)}
                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(g.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {gelombang.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      Belum ada data gelombang
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </ShowcaseSection>
    </>
  );
}
