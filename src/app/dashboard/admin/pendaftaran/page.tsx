"use client";

import { PencilSquareIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function CrudPendaftaranPage() {
  const [pendaftaranList, setPendaftaranList] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [searchNama, setSearchNama] = useState("");
  const [searchNomor, setSearchNomor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = JSON.parse(localStorage.getItem("user") as string);
    const role = userRole.role;
    setRole(role);

    fetch(
      `${process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL}/api/pendaftaran`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((res) => res.json())
      .then((data) => setPendaftaranList(data.data))
      .catch((err) => console.error("Gagal memuat pendaftaran:", err));
  }, []);

  const handleDelete = async (id: string) => {
    MySwal.fire({
      title: "Hapus Pendaftaran?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL}/api/pendaftaran/${id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (res.ok) {
            setPendaftaranList((prev) => prev.filter((p) => p.id !== id));
            MySwal.fire(
              "Terhapus!",
              "Data pendaftaran telah dihapus.",
              "success",
            );
          } else {
            MySwal.fire("Gagal!", "Tidak dapat menghapus data.", "error");
          }
        } catch (error) {
          console.error(error);
          MySwal.fire(
            "Error!",
            "Terjadi kesalahan saat menghapus data.",
            "error",
          );
        }
      }
    });
  };

  const filteredList = pendaftaranList.filter(
    (p) =>
      p.dataFormulir?.nama.toLowerCase().includes(searchNama.toLowerCase()) &&
      p.nomorPendaftaran.toLowerCase().includes(searchNomor.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <>
      <Breadcrumb pageName="CRUD Pendaftaran" />

      <ShowcaseSection title="Daftar Pendaftar">
        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-4">
          <InputGroup
            label=""
            name=""
            type="text"
            placeholder="Cari Nama.."
            value={searchNama}
            handleChange={(e: any) => {
              setSearchNama(e.target.value);
              setCurrentPage(1);
            }}
          />

          <InputGroup
            label=""
            name=""
            type="text"
            placeholder="Cari Nomor Pendaftaran.."
            value={searchNomor}
            handleChange={(e) => {
              setSearchNomor(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Nomor Pendaftaran</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedList.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      {p.dataFormulir?.nama ?? "Tanpa Nama"}
                    </td>
                    <td className="p-3 text-blue-600">{p.nomorPendaftaran}</td>
                    <td className="p-3">
                      <span
                        className={`rounded px-2 py-1 text-white ${
                          p.status === "DATA_LENGKAP"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <PencilSquareIcon
                        onClick={() =>
                          router.push(`/dashboard/admin/pendaftaran/${p.id}`)
                        }
                        className="h-5 w-5 cursor-pointer text-gray-600 hover:text-gray-800"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded px-4 py-2 font-semibold ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </ShowcaseSection>
    </>
  );
}
