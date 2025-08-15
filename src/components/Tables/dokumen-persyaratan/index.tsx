"use client";

import Swal from "sweetalert2";
import { TrashIcon } from "@/assets/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function DokumenPersyaratan({ setRefreshKey }: { setRefreshKey: any }) {
  const [data, setData] = useState<any>({});
  useEffect(() => {
    const token = localStorage.getItem("token");
    const pendaftaranId = localStorage.getItem("pendaftaranId");
    const getData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL}/api/pendaftaran/${pendaftaranId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const pendaftaran = await res.json();
      setData(pendaftaran);
    };
    getData();
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");

    const result = await Swal.fire({
      title: "Yakin ingin menghapus dokumen ini?",
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "Batal",
      confirmButtonText: "Ya, hapus",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "Menghapus...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL}/api/pendaftaran/${id}/dokumen`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Gagal menghapus dokumen");
        await Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Dokumen berhasil dihapus",
        });

        // Berhasil → trigger refresh
        setRefreshKey((prev: number) => prev + 1);
      } catch (err) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menghapus dokumen.",
        });
      }
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Daftar Dokumen
        </h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-[120px] pl-5 sm:pl-6 xl:pl-7.5">
              Nama Dokumen
            </TableHead>
            <TableHead>Url Penyimpanan</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.data?.dokumenPersyaratan?.map((dokumen: any) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={dokumen.id}
            >
              <TableCell className="flex min-w-fit items-center gap-3 pl-5 sm:pl-6 xl:pl-7.5">
                <Image
                  src={
                    dokumen.urlPenyimpanan.endsWith("pdf")
                      ? "/images/pdf.png"
                      : dokumen.urlPenyimpanan
                  }
                  className="aspect-[6/5] w-15 rounded-[5px] object-cover"
                  width={60}
                  height={50}
                  alt={"Image for product " + dokumen.namaDokumen}
                  role="presentation"
                />
                <div>{dokumen.namaDokumen}</div>
              </TableCell>

              <TableCell>
                <Link
                  href={dokumen.urlPenyimpanan}
                  target="blank"
                  className="text-blue-500 underline"
                >
                  Lihat Detail
                </Link>
              </TableCell>
              <TableCell>
                <button
                  className="hover:text-red"
                  onClick={() => handleDelete(dokumen.id)}
                >
                  <span className="sr-only">Delete Dokumen</span>
                  <TrashIcon />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
