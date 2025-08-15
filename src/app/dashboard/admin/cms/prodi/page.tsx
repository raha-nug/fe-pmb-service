"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CrudProgramStudiPage() {
  const [programStudi, setProgramStudi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const baseUrl = process.env.NEXT_PUBLIC_OPERASIONAL_SERVICE_URL;

  // Ambil data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/program-studi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProgramStudi(data.data || []);
    } catch (err) {
      console.error(err);
      MySwal.fire("Error", "Gagal memuat data program studi", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tambah / Edit
  const handleForm = async (mode: "tambah" | "edit", existingData?: any) => {
    const { value: formValues } = await MySwal.fire({
      title: mode === "tambah" ? "Tambah Program Studi" : "Edit Program Studi",
      html: `
        <div style="text-align:left; font-size:14px;">
          <label class="block mb-1 font-semibold">Nama Prodi</label>
          <input id="namaProdi" type="text" value="${existingData?.namaProdi || ""}" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px"/>

          <label class="block mt-3 mb-1 font-semibold">Fakultas</label>
          <input id="fakultas" type="text" value="${existingData?.fakultas || ""}" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px"/>

          <label class="block mt-3 mb-1 font-semibold">Deskripsi</label>
          <textarea id="deskripsi" rows="3" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px">${existingData?.deskripsi || ""}</textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
      preConfirm: () => {
        const namaProdi = (
          document.getElementById("namaProdi") as HTMLInputElement
        ).value.trim();
        const fakultas = (
          document.getElementById("fakultas") as HTMLInputElement
        ).value.trim();
        const deskripsi = (
          document.getElementById("deskripsi") as HTMLTextAreaElement
        ).value.trim();

        if (!namaProdi) {
          MySwal.showValidationMessage("Nama Prodi wajib diisi");
          return;
        }

        return {
          namaProdi,
          fakultas: fakultas || null,
          deskripsi: deskripsi || null,
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

        const res = await fetch(
          mode === "tambah"
            ? `${baseUrl}/api/program-studi`
            : `${baseUrl}/api/program-studi/${existingData.id}`,
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
            `Program studi berhasil ${mode === "tambah" ? "ditambahkan" : "diedit"}`,
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
      title: "Hapus Program Studi?",
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
        const res = await fetch(`${baseUrl}/api/program-studi/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          MySwal.fire("Berhasil", "Program studi dihapus", "success");
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
      <Breadcrumb pageName="Program Studi" />
      <ShowcaseSection title="Data Prodi">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              size={"small"}
              variant={"primary"}
              shape={"rounded"}
              label="+ Prodi"
              onClick={() => handleForm("tambah")}
            />
          </div>

          {loading ? (
            <p className="italic text-gray-500">Memuat data...</p>
          ) : (
            <table className="w-full overflow-hidden rounded-lg border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Nama Prodi</th>
                  <th className="p-3 text-left">Fakultas</th>
                  <th className="p-3 text-left">Deskripsi</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {programStudi.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.namaProdi}</td>
                    <td className="p-3">{p.fakultas || "-"}</td>
                    <td className="p-3">{p.deskripsi || "-"}</td>
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
                {programStudi.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      Belum ada data program studi
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
