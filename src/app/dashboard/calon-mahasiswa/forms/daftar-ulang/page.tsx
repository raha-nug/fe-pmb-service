"use client";

import { UploadIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { RadioInput } from "@/components/FormElements/radio";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Page() {
  const [daftarUlang, setDaftarUlang] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");

  const router = useRouter();

  const pendaftaranId = localStorage.getItem("pendaftaranId");
  const token = localStorage.getItem("token");

  const getdaftarUlang = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PEMBAYARAN_SERVICE_URL}/api/pembayaran/tagihan/${pendaftaranId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const daftarUlang = await res.json();
      if (res.ok) {
        setDaftarUlang(daftarUlang);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getdaftarUlang();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const pendaftaranId = localStorage.getItem("pendaftaranId");

    const token = localStorage.getItem("token");

    // Validasi opsional
    const file = formData.get("buktiBayar") as File | null;
    if (!file || file.size === 0) {
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Dokumen belum diunggah",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Mengungah...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PEMBAYARAN_SERVICE_URL}/api/pembayaran/tagihan/${pendaftaranId}/upload-bukti`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: formData,
        },
      );
      if (!res.ok) throw new Error("Gagal mengunggah dokumen");
      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Dokumen berhasil diunggah",
      });
      setFileName("");
      await getdaftarUlang();
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat mengunggah dokumen.",
      });
      setFileName("");
    } finally {
      setFileName("");
    }
  };

  if (!daftarUlang) return <p>Memuat data...</p>;

  console.log(daftarUlang);

  return (
    <>
      <Breadcrumb pageName="Daftar Ulang" />

      {daftarUlang == null ? (
        <ShowcaseSection title="Informasi" className="!p-7">
          <p>
            Kamu belum menyelesaikan seleksi, silahkan kembali lagi jika seleksi
            sudah dikerjakan
          </p>
        </ShowcaseSection>
      ) : (
        <>
          <div className="mb-12 flex flex-col-reverse gap-6 sm:grid sm:grid-cols-2 sm:gap-12">
            <ShowcaseSection title="Upload Dokumen" className="!p-7">
              {daftarUlang.data.status === "LUNAS" || daftarUlang.data.status === "MENUNGGU_KONFIRMASI" ? (
                <p>
                  <Link
                    href={daftarUlang.data.urlBuktiBayar || "/"}
                    className="text-blue-500 underline"
                    target="blank"
                  >
                    Link Bukti Bayar
                  </Link>
                </p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6 flex flex-col justify-between">
                    <label
                      htmlFor="konfirmasi"
                      className="text-body-sm font-medium text-dark dark:text-white"
                    >
                      Dengan ini Saya Menyatakan Benar-Benar Akan Kuliah di STT
                      Cipasung Sesuai dengan Program Studi yang telah Dipilih.
                      <span className="ml-1 select-none text-red">*</span>
                    </label>
                    <div className="mb-4 flex gap-4">
                      <RadioInput
                        label="Ya"
                        variant="circle"
                        name="konfirmasi"
                        value="Ya"
                      />
                    </div>
                  </div>

                  <p>Upload Bukti Bayar</p>
                  <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
                    <input
                      type="file"
                      name="buktiBayar"
                      id="buktiBayar"
                      accept="image/png, image/jpg, image/jpeg, application/pdf"
                      hidden
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileName(file.name);
                        }
                      }}
                    />

                    <label
                      htmlFor="buktiBayar"
                      className="flex cursor-pointer flex-col items-center justify-center p-4 sm:py-7.5"
                    >
                      <div className="flex size-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
                        <UploadIcon />
                      </div>

                      <p className="mt-2.5 text-body-sm font-medium">
                        <span className="text-primary">Click to upload</span>
                      </p>

                      <p className="mt-1 text-body-xs">
                        PNG, JPG or PDF (max 5MB)
                      </p>
                      {fileName && (
                        <p className="mb-4 text-sm text-dark dark:text-white">
                          File dipilih:{" "}
                          <span className="font-medium">{fileName}</span>
                        </p>
                      )}
                    </label>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      className="flex justify-center rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex items-center justify-center rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}
            </ShowcaseSection>
            <ShowcaseSection title="Informasi Tagihan">
              <div className="text-slate-950">
                <p>
                  Jumlah : Rp. {daftarUlang.data.jumlah.toLocaleString("ID")}
                </p>
                <p>Deskripsi : {daftarUlang.data.deskripsi}</p>
                <p>Status : {daftarUlang.data.status}</p>
                <p>Catatan Admin : {daftarUlang.data.catatanAdmin}</p>
              </div>
            </ShowcaseSection>
          </div>
        </>
      )}
    </>
  );
}
