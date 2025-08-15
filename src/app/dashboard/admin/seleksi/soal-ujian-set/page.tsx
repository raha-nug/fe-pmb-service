"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CrudSoalUjianSet() {
  const [setList, setSetList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const baseUrl = process.env.NEXT_PUBLIC_SELEKSI_SERVICE_URL;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/seleksi/soal-set`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSetList(data.data || []);
    } catch (error) {
      console.error(error);
      MySwal.fire("Error", "Gagal memuat data set soal", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleForm = async (mode: "tambah" | "edit", existingData?: any) => {
    const { value: formValues } = await MySwal.fire({
      title: mode === "tambah" ? "Tambah Set Soal" : "Edit Set Soal",
      html: `
        <div style="text-align:left; font-size:14px;">
          <label class="block mb-1 font-semibold">Nama Set</label>
          <input id="namaSet" type="text" value="${existingData?.namaSet || ""}" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px" />

          <label class="block mt-3 mb-1 font-semibold">Deskripsi</label>
          <textarea id="deskripsi" rows="4" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px">${existingData?.deskripsi || ""}</textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
      preConfirm: () => {
        const namaSet = (
          document.getElementById("namaSet") as HTMLInputElement
        ).value.trim();
        const deskripsi = (
          document.getElementById("deskripsi") as HTMLTextAreaElement
        ).value.trim();

        if (!namaSet) {
          MySwal.showValidationMessage("Nama set wajib diisi");
          return;
        }

        return { namaSet, deskripsi };
      },
    });

    if (formValues) {
      try {
        Swal.fire({
          title: "Menyimpan...",
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false,
        });

        const payload = { ...formValues };

        const res = await fetch(
          mode === "tambah"
            ? `${baseUrl}/api/seleksi/soal-set`
            : `${baseUrl}/api/seleksi/soal-set/${existingData.id}`,
          {
            method: mode === "tambah" ? "POST" : "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          },
        );

        if (res.ok) {
          MySwal.fire(
            "Berhasil",
            `Set soal berhasil ${mode === "tambah" ? "ditambahkan" : "diedit"}`,
            "success",
          );
          fetchData();
        } else {
          MySwal.fire(
            "Gagal",
            "Terjadi kesalahan saat menyimpan set soal",
            "error",
          );
        }
      } catch (err) {
        console.error(err);
        MySwal.fire("Error", "Tidak dapat terhubung ke server", "error");
      }
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await MySwal.fire({
      title: "Hapus Set Soal?",
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

        const res = await fetch(`${baseUrl}/api/seleksi/soal-set/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          MySwal.fire("Berhasil", "Set soal berhasil dihapus", "success");
          fetchData();
        } else {
          MySwal.fire("Gagal", "Gagal menghapus set soal", "error");
        }
      } catch (err) {
        console.error(err);
        MySwal.fire("Error", "Tidak dapat terhubung ke server", "error");
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Soal Ujian Set" />
      <ShowcaseSection title="Data Soal Ujian Set">
        <div className="space-y-4 p-6">
          <div className="flex justify-end">
            <Button
              size={"small"}
              variant={"primary"}
              shape={"rounded"}
              label="+ Soal Set"
              onClick={() => handleForm("tambah")}
            />
          </div>

          {loading ? (
            <p className="italic text-gray-500">Memuat data set soal...</p>
          ) : (
            <table className="w-full overflow-hidden rounded-lg border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Nama Set</th>
                  <th className="p-3 text-left">Deskripsi</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {setList.map((set) => (
                  <tr key={set.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{set.namaSet}</td>
                    <td className="max-w-lg truncate p-3">{set.deskripsi}</td>
                    <td className="flex justify-center gap-2 p-3">
                      <button
                        onClick={() => handleForm("edit", set)}
                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(set.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Hapus
                      </button>
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/admin/seleksi/soal-ujian-set/${set.id}`,
                          )
                        }
                        className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                      >
                        Tambah Soal
                      </button>
                    </td>
                  </tr>
                ))}
                {setList.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-gray-500">
                      Belum ada set soal tersedia
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
