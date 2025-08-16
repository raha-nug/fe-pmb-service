"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";

const MySwal = withReactContent(Swal);

export default function DetailPendaftaranPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = JSON.parse(localStorage.getItem("user") as string);
    setRole(userRole.role);

    fetch(
      `${process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL}/api/pendaftaran/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((res) => res.json())
      .then((resData) => setData(resData.data))
      .catch((err) => console.error("Gagal memuat detail:", err));
  }, [id]);

  const handleValidasi = async () => {
    const { value: formValues } = await MySwal.fire({
      title: "Validasi Pendaftaran",
      html: `
    <div style="text-align:left; font-size:14px;">
      <label class="block mb-1 text-sm font-semibold text-gray-700">Status</label>
      <select id="status" 
        style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #d1d5db;font-size:13px">
        <option value="DATA_LENGKAP">DATA_LENGKAP</option>
        <option value="PERLU_PERBAIKAN">PERLU_PERBAIKAN</option>
      </select>

      <label class="block mt-3 mb-1 text-sm font-semibold text-gray-700">Catatan Admin</label>
      <textarea id="catatanAdmin" 
        placeholder="Opsional"
        style="width:100%;padding:6px 8px;border-radius:6px;border:1px solid #d1d5db;resize:vertical;height:60px;font-size:13px"></textarea>
    </div>
  `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      background: "#f9fafb",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#9ca3af",
      customClass: {
        popup: "p-4", // kalau mau jarak dalam popup lebih kecil
        title: "text-lg font-bold text-gray-800",
      },
      preConfirm: () => {
        const status = (document.getElementById("status") as HTMLSelectElement)
          .value;
        const catatanAdmin = (
          document.getElementById("catatanAdmin") as HTMLTextAreaElement
        ).value;
        return { status, catatanAdmin };
      },
    });

    if (formValues) {
      try {
        Swal.fire({
          title: "Loading...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL}/api/pendaftaran/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formValues),
          },
        );

        if (res.ok) {
          MySwal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Data pendaftaran telah divalidasi.",
            confirmButtonColor: "#2563eb",
          });
          router.refresh();
        } else {
          MySwal.fire({
            icon: "error",
            title: "Gagal",
            text: "Terjadi kesalahan saat validasi",
          });
        }
      } catch (error) {
        console.error(error);
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Tidak dapat terhubung ke server",
        });
      }
    }
  };

  if (!data) return <p className="italic text-gray-500">Memuat data...</p>;

  return (
    <div className="grid gap-12">
      <ShowcaseSection title="Data Pendaftaran">
        <table className="w-full border-collapse overflow-hidden rounded-lg shadow-sm">
          <tbody>
            {[
              {
                label: "Nomor Pendaftaran",
                value: data?.nomorPendaftaran,
              },
              {
                label: "Gelombang Id",
                value: data?.gelombangId,
              },
              {
                label: "Status Pendaftaran",
                value: (
                  <span
                    className={`rounded px-2 py-1 text-white ${
                      data?.status === "DATA_LENGKAP"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {data?.status || "-"}
                  </span>
                ),
              },
              {
                label: "Catatan Admin",
                value: data?.catatanAdmin ? (
                  <span className="italic text-gray-600">
                    {data.catatanAdmin}
                  </span>
                ) : (
                  "-"
                ),
              },
            ].map((item, idx) => (
              <tr
                key={idx}
                className={`${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
              >
                <td className="w-1/3 px-4 py-3 font-semibold text-slate-800">
                  {item.label}
                </td>
                <td className="w-1 px-2 py-3 text-gray-500">:</td>
                <td className="px-4 py-3 text-gray-700">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ShowcaseSection>

      <ShowcaseSection title="Data Formulir" className="space-y-4 p-6">
        <table className="w-full overflow-hidden rounded-lg border border-gray-300">
          <tbody>
            {Object.entries(data.dataFormulir || {}).map(([key, value]) => (
              <tr
                key={key}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="bg-gray-50 p-3 font-medium capitalize text-gray-700">
                  {key.replace(/_/g, " ")}
                </td>
                <td className="p-3 text-gray-800">{value as string}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.dokumenPersyaratan?.length > 0 && (
          <>
            <h2 className="mt-4 text-lg font-semibold text-gray-800">
              Dokumen Persyaratan
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-gray-700">
              {data.dokumenPersyaratan.map((doc: any) => (
                <li key={doc.id}>
                  {doc.namaDokumen} —{" "}
                  <a
                    href={doc.urlPenyimpanan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Lihat Dokumen
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        <Button
          label="Validasi Data"
          variant={"primary"}
          shape={"rounded"}
          onClick={handleValidasi}
        />
      </ShowcaseSection>
    </div>
  );
}
