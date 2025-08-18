"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Tagihan {
  id: string;
  pendaftaranId: string;
  calonMahasiswaId: string;
  deskripsi: string;
  jumlah: number;
  status: string;
  urlBuktiBayar?: string;
  tanggalUpload?: string;
  catatanAdmin?: string;
  createdAt: string;
}

export default function TagihanPage() {
  const [data, setData] = useState<Tagihan[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_PEMBAYARAN_SERVICE_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/pembayaran/tagihan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData(json.data || []);
    } catch (err) {
      console.error("Gagal mengambil data tagihan", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const konfirmasi = async (id: string) => {
    const { value: alasan } = await Swal.fire({
      title: "Konfirmasi Pembayaran?",
      text: "Pastikan bukti bayar valid sebelum konfirmasi.",
      showCancelButton: true,
      confirmButtonText: "Ya, konfirmasi",
      cancelButtonText: "Batal",

      input: "textarea",
      inputLabel: "Catatan",
      inputPlaceholder: "Tuliskan catatan...",
      inputAttributes: {
        "aria-label": "Tuliskan catatan",
      },
    });

    try {
      Swal.fire({
        title: "Mengonfirmasi...",
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
      });
      const res = await fetch(
        `${baseUrl}/api/pembayaran/tagihan/${id}/konfirmasi`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "LUNAS", catatanAdmin: alasan }),
        },
      );
      const tagihan = await res.json();

      if (!res.ok) {
        Swal.fire("Gagal", tagihan.message, "error");
      }
      Swal.fire("Berhasil", "Pembayaran telah dikonfirmasi", "success");
      await fetchData();
    } catch (err) {
      Swal.fire("Error", "Gagal mengkonfirmasi pembayaran", "error");
    }
  };

  const tolak = async (id: string) => {
    const { value: alasan } = await Swal.fire({
      title: "Tolak Pembayaran?",
      input: "textarea",
      inputLabel: "Alasan Penolakan",
      inputPlaceholder: "Tuliskan alasan penolakan...",
      inputAttributes: {
        "aria-label": "Tuliskan alasan penolakan",
      },
      showCancelButton: true,
      confirmButtonText: "Tolak",
      cancelButtonText: "Batal",
    });

    if (!alasan) return;

    try {
      Swal.fire({
        title: "Menolak...",
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
      });
      const res = await fetch(
        `${baseUrl}/api/pembayaran/tagihan/${id}/konfirmasi`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "DITOLAK", catatanAdmin: alasan }),
        },
      );

      const tagihan = await res.json();

      if (!res.ok) {
        Swal.fire("Gagal", tagihan.message, "error");
      }

      Swal.fire("Ditolak", "Pembayaran telah ditolak", "success");
      await fetchData();
    } catch (err) {
      Swal.fire("Error", "Gagal menolak pembayaran", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Breadcrumb pageName="Pembayaran" />
      <ShowcaseSection title="Data Pembayaran">
        <div className="space-y-4">
          {loading ? (
            <p className="italic text-gray-500">Memuat data tagihan...</p>
          ) : (
            <table className="w-full overflow-hidden rounded-lg border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Deskripsi</th>
                  <th className="p-3 text-left">Jumlah</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Bukti Bayar</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((tagihan) => (
                  <tr key={tagihan.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{tagihan.deskripsi}</td>
                    <td className="p-3">
                      Rp {tagihan.jumlah.toLocaleString("id-ID")}
                    </td>
                    <td className="p-3">{tagihan.status}</td>
                    <td className="p-3">
                      {tagihan.urlBuktiBayar ? (
                        <a
                          href={tagihan.urlBuktiBayar}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Lihat
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="flex justify-center gap-2 p-3">
                      {tagihan.status !== "LUNAS" && (
                        <>
                          <button
                            onClick={() => konfirmasi(tagihan.pendaftaranId)}
                            className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                          >
                            Konfirmasi
                          </button>
                          <button
                            onClick={() => tolak(tagihan.pendaftaranId)}
                            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-3 text-center text-gray-500">
                      Belum ada tagihan tersedia
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
