"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CrudBankSoal() {
  const [soalList, setSoalList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const baseUrl = process.env.NEXT_PUBLIC_SELEKSI_SERVICE_URL;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/seleksi/bank-soal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSoalList(data.data || []);
    } catch (error) {
      console.error(error);
      MySwal.fire("Error", "Gagal memuat data soal", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleForm = async (mode: "tambah" | "edit", existingData?: any) => {
    const { value: formValues } = await MySwal.fire({
      title: mode === "tambah" ? "Tambah Soal" : "Edit Soal",
      html: `
        <div style="text-align:left; font-size:14px;">
          <label class="block mb-1 font-semibold">Pertanyaan</label>
          <textarea id="pertanyaan" rows="4" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px">${existingData?.pertanyaan || ""}</textarea>

          <label class="block mt-3 mb-1 font-semibold">Pilihan Jawaban (format JSON)</label>
          <textarea id="pilihanJawaban" rows="6" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px">${
            existingData
              ? JSON.stringify(existingData.pilihanJawaban, null, 2)
              : `[
  { "id": "A", "text": "Jawaban A" },
  { "id": "B", "text": "Jawaban B" },
  { "id": "C", "text": "Jawaban C" },
  { "id": "D", "text": "Jawaban D" }
]`
          }</textarea>

          <label class="block mt-3 mb-1 font-semibold">Kunci Jawaban (e.g. "A")</label>
          <input id="kunciJawaban" type="text" maxlength="1" value="${existingData?.kunciJawaban || ""}" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px"/>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
      preConfirm: () => {
        const pertanyaan = (
          document.getElementById("pertanyaan") as HTMLTextAreaElement
        ).value.trim();
        const pilihanJawabanStr = (
          document.getElementById("pilihanJawaban") as HTMLTextAreaElement
        ).value.trim();
        const kunciJawaban = (
          document.getElementById("kunciJawaban") as HTMLInputElement
        ).value
          .trim()
          .toUpperCase();

        if (!pertanyaan || !pilihanJawabanStr || !kunciJawaban) {
          MySwal.showValidationMessage("Semua field wajib diisi");
          return;
        }

        let pilihanJawaban: any[];
        try {
          pilihanJawaban = JSON.parse(pilihanJawabanStr);
          if (!Array.isArray(pilihanJawaban) || pilihanJawaban.length === 0) {
            MySwal.showValidationMessage(
              "Pilihan jawaban harus berupa array JSON yang tidak kosong",
            );
            return;
          }
        } catch (err) {
          MySwal.showValidationMessage(
            "Format JSON pilihan jawaban tidak valid",
          );
          return;
        }

        // Validasi kunci jawaban harus ada dalam pilihan jawaban (key id)
        if (
          !pilihanJawaban.some((item) => item.id.toUpperCase() === kunciJawaban)
        ) {
          MySwal.showValidationMessage(
            "Kunci jawaban harus ada dalam pilihan jawaban",
          );
          return;
        }

        return { pertanyaan, pilihanJawaban, kunciJawaban };
      },
    });

    if (formValues) {
      try {
        Swal.fire({
          title: "Menyimpan...",
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false,
        });

        // Kalau ada adminPembuatId, bisa ditambahkan di sini
        const payload = { ...formValues };

        const res = await fetch(
          mode === "tambah"
            ? `${baseUrl}/api/seleksi/bank-soal`
            : `${baseUrl}/api/seleksi/bank-soal/${existingData.id}`,
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
            `Soal berhasil ${mode === "tambah" ? "ditambahkan" : "diedit"}`,
            "success",
          );
          fetchData();
        } else {
          MySwal.fire(
            "Gagal",
            "Terjadi kesalahan saat menyimpan soal",
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
      title: "Hapus Soal?",
      text: "Data soal yang dihapus tidak dapat dikembalikan",
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

        const res = await fetch(`${baseUrl}/api/seleksi/bank-soal/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          MySwal.fire("Berhasil", "Soal berhasil dihapus", "success");
          fetchData();
        } else {
          MySwal.fire("Gagal", "Gagal menghapus soal", "error");
        }
      } catch (err) {
        console.error(err);
        MySwal.fire("Error", "Tidak dapat terhubung ke server", "error");
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Bank Soal" />
      <ShowcaseSection title="Data Bank Soal">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              size={"small"}
              variant={"primary"}
              shape={"rounded"}
              label="+ Bank Soal"
              onClick={() => handleForm("tambah")}
            />
          </div>

          {loading ? (
            <p className="italic text-gray-500">Memuat data soal...</p>
          ) : (
            <table className="w-full overflow-hidden rounded-lg border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Pertanyaan</th>
                  <th className="p-3 text-left">Pilihan Jawaban</th>
                  <th className="p-3 text-left">Kunci Jawaban</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {soalList.map((soal) => (
                  <tr key={soal.id} className="border-t hover:bg-gray-50">
                    <td className="max-w-xs truncate p-3">{soal.pertanyaan}</td>
                    <td className="max-w-xs truncate p-3">
                      {JSON.stringify(soal.pilihanJawaban)}
                    </td>
                    <td className="p-3">{soal.kunciJawaban}</td>
                    <td className="flex justify-center gap-2 p-3">
                      <button
                        onClick={() => handleForm("edit", soal)}
                        className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(soal.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {soalList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      Belum ada soal tersedia
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
