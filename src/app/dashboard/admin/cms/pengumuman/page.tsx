"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CrudPengumumanPage() {
  const [pengumuman, setPengumuman] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const baseUrl = process.env.NEXT_PUBLIC_OPERASIONAL_SERVICE_URL;

  // Ambil data pengumuman
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/pengumuman`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPengumuman(data.data || []);
    } catch (err) {
      console.error(err);
      MySwal.fire("Error", "Gagal memuat data pengumuman", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tambah/Edit form
  const handleForm = async (mode: "tambah" | "edit", existingData?: any) => {
    const { value: formValues } = await MySwal.fire({
      title: mode === "tambah" ? "Tambah Pengumuman" : "Edit Pengumuman",
      html: `
        <div style="text-align:left; font-size:14px;">
          <label class="block mb-1 font-semibold">Judul</label>
          <input id="judul" type="text" value="${existingData?.judul || ""}" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px"/>

          <label class="block mt-3 mb-1 font-semibold">Isi Konten</label>
          <textarea id="isiKonten" rows="5" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px">${existingData?.isiKonten || ""}</textarea>

          <label class="block mt-3 mb-1 font-semibold">Status Publikasi</label>
          <select id="isPublished" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px">
            <option value="true" ${
              existingData?.isPublished ? "selected" : ""
            }>Dipublikasikan</option>
            <option value="false" ${
              existingData?.isPublished ? "" : "selected"
            }>Belum Dipublikasikan</option>
          </select>

          <label class="block mt-3 mb-1 font-semibold">Tanggal Publikasi</label>
          <input id="tanggalPublikasi" type="datetime-local" value="${
            existingData
              ? new Date(existingData.tanggalPublikasi)
                  .toISOString()
                  .slice(0, 16)
              : new Date().toISOString().slice(0, 16)
          }" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px"/>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
      preConfirm: () => {
        const judul = (
          document.getElementById("judul") as HTMLInputElement
        ).value.trim();
        const isiKonten = (
          document.getElementById("isiKonten") as HTMLTextAreaElement
        ).value.trim();
        const isPublished =
          (document.getElementById("isPublished") as HTMLSelectElement)
            .value === "true";
        const tanggalPublikasiStr = (
          document.getElementById("tanggalPublikasi") as HTMLInputElement
        ).value;

        if (!judul || !isiKonten || !tanggalPublikasiStr) {
          MySwal.showValidationMessage("Semua field wajib diisi");
          return;
        }

        const tanggalPublikasi = new Date(tanggalPublikasiStr).toISOString();

        return { judul, isiKonten, isPublished, tanggalPublikasi };
      },
    });

    if (formValues) {
      try {
        Swal.fire({
          title: "Menyimpan...",
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false,
        });

        // Asumsi adminPembuatId dikirim dari backend, atau kamu bisa tambahkan di sini
        // Contoh:
        // formValues.adminPembuatId = currentAdminId;

        const res = await fetch(
          mode === "tambah"
            ? `${baseUrl}/api/pengumuman`
            : `${baseUrl}/api/pengumuman/${existingData.id}`,
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
            `Pengumuman berhasil ${mode === "tambah" ? "ditambahkan" : "diedit"}`,
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

  // Hapus
  const handleDelete = async (id: string) => {
    const confirm = await MySwal.fire({
      title: "Hapus Pengumuman?",
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
        const res = await fetch(`${baseUrl}/api/pengumuman/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          MySwal.fire("Berhasil", "Pengumuman dihapus", "success");
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
      <Breadcrumb pageName="Pengumuman" />
      <ShowcaseSection title="Data Pengumuman">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              size={"small"}
              variant={"primary"}
              shape={"rounded"}
              label="+ Pengumuman"
              onClick={() => handleForm("tambah")}
            />
          </div>

          {loading ? (
            <p className="italic text-gray-500">Memuat data...</p>
          ) : (
            <table className="w-full overflow-hidden rounded-lg border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Judul</th>
                  <th className="p-3 text-left">Isi Konten</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Tanggal Publikasi</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pengumuman.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.judul}</td>
                    <td className="max-w-xs truncate p-3">{p.isiKonten}</td>
                    <td className="p-3">
                      {p.isPublished ? "Dipublikasikan" : "Belum"}
                    </td>
                    <td className="p-3">
                      {new Date(p.tanggalPublikasi).toLocaleString("id-ID")}
                    </td>
                    <td className="flex justify-center gap-2 p-3">
                      <button
                        onClick={() => handleForm("edit", p)}
                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {pengumuman.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Belum ada data pengumuman
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
