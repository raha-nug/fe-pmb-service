"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";

const MySwal = withReactContent(Swal);

interface BankSoalType {
  id: string;
  pertanyaan: string;
}

interface SoalUjianSetItemType {
  id: string;
  bankSoalId: string;
  bankSoal: BankSoalType;
}

export default function CrudSoalUjianSetItem() {
  const params = useParams();
  const soalUjianSetId = params?.soalUjianSetId || ""; // pastikan route punya param soalUjianSetId

  const [items, setItems] = useState<SoalUjianSetItemType[]>([]);
  const [availableSoal, setAvailableSoal] = useState<BankSoalType[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const baseUrl = process.env.NEXT_PUBLIC_SELEKSI_SERVICE_URL;

  // Fetch soal yang sudah masuk ke set
  const fetchItems = async () => {
    if (!soalUjianSetId) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${baseUrl}/api/seleksi/soal-set/${soalUjianSetId}/items`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      console.error(err);
      MySwal.fire("Error", "Gagal memuat data soal dalam set", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch soal yang belum masuk ke set (available)
  const fetchAvailableSoal = async () => {
    if (!soalUjianSetId) return;
    try {
      const res = await fetch(`${baseUrl}/api/seleksi/bank-soal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const available = (data.data || []).filter(
        (soal: BankSoalType) =>
          !items.some((item) => item.bankSoalId === soal.id),
      );
      setAvailableSoal(available);
    } catch (err) {
      console.error(err);
      MySwal.fire("Error", "Gagal memuat daftar soal tersedia", "error");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [soalUjianSetId]);

  useEffect(() => {
    fetchAvailableSoal();
  }, [items]);

  // Tambah soal ke set
  const handleTambahSoal = async () => {
    if (availableSoal.length === 0) {
      MySwal.fire("Info", "Tidak ada soal tersedia untuk ditambahkan", "info");
      return;
    }

    const optionsHtml = availableSoal
      .map(
        (soal) =>
          `<option value="${soal.id}">${soal.pertanyaan.slice(0, 50)}...</option>`,
      )
      .join("");

    const { value: selectedSoalId } = await MySwal.fire({
      title: "Tambah Soal ke Set Soal",
      html: `
        <select id="selectSoal" style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #ccc;font-size:14px;">
          ${optionsHtml}
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Tambah",
      cancelButtonText: "Batal",
      preConfirm: () => {
        const select = document.getElementById(
          "selectSoal",
        ) as HTMLSelectElement;
        return select.value;
      },
    });

    if (selectedSoalId) {
      try {
        Swal.fire({
          title: "Menambah soal...",
          didOpen: () => Swal.showLoading(),
          allowOutsideClick: false,
        });

        const res = await fetch(
          `${baseUrl}/api/seleksi/soal-set/${soalUjianSetId}/add-soal`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ bankSoalId: selectedSoalId }),
          },
        );

        if (res.ok) {
          MySwal.fire(
            "Berhasil",
            "Soal berhasil ditambahkan ke set soal",
            "success",
          );
          fetchItems();
        } else {
          const err = await res.json();
          MySwal.fire(
            "Gagal",
            err.message || "Gagal menambahkan soal",
            "error",
          );
        }
      } catch (err) {
        console.error(err);
        MySwal.fire("Error", "Tidak dapat terhubung ke server", "error");
      }
    }
  };

  // Hapus soal dari set
  const handleDelete = async (id: string) => {
    const confirm = await MySwal.fire({
      title: "Hapus Soal dari Set Soal?",
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

        const res = await fetch(`${baseUrl}/api/seleksi/soal-set/item/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          MySwal.fire(
            "Berhasil",
            "Soal berhasil dihapus dari set soal",
            "success",
          );
          fetchItems();
        } else {
          const err = await res.json();
          MySwal.fire("Gagal", err.message || "Gagal menghapus soal", "error");
        }
      } catch (err) {
        console.error(err);
        MySwal.fire("Error", "Tidak dapat terhubung ke server", "error");
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Soal Set Item" />
      <ShowcaseSection title="Data Soal Set Item">
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              size={"small"}
              variant={"primary"}
              shape={"rounded"}
              label="+ Soal"
              onClick={handleTambahSoal}
            />
          </div>

          {loading ? (
            <p className="italic text-gray-500">Memuat soal...</p>
          ) : (
            <table className="w-full overflow-hidden rounded-lg border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Pertanyaan</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td
                        className="max-w-lg truncate p-3"
                        title={item.bankSoal.pertanyaan}
                      >
                        {item.bankSoal.pertanyaan}
                      </td>
                      <td className="flex justify-center p-3">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-4 text-center text-gray-500">
                      Belum ada soal dalam set soal ini
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
