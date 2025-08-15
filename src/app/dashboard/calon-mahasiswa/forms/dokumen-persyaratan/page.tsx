"use client";
import Swal from "sweetalert2";
import { UploadIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { DokumenPersyaratan } from "@/components/Tables/dokumen-persyaratan";
import { DokumenPersyaratanSkeleton } from "@/components/Tables/dokumen-persyaratan/skeleton";
import React, { Suspense, useEffect, useState } from "react";

export default function Page() {
  const [fileName, setFileName] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendaftaranId, setPendaftaranId] = useState<any>(null);

  useEffect(() => {
    const pendaftaranId = localStorage.getItem("pendaftaranId");
    const token = localStorage.getItem("token");
    setPendaftaranId(pendaftaranId);

    const getPendaftaran = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL}/api/pendaftaran/${pendaftaranId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) {
          setPendaftaranId(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getPendaftaran();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const pendaftaranId = localStorage.getItem("pendaftaranId");

    setPendaftaranId(pendaftaranId);

    const token = localStorage.getItem("token");

    // Validasi opsional
    const file = formData.get("filePersyaratan") as File | null;
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
        `${process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL}/api/pendaftaran/${pendaftaranId}/dokumen`,
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
      setRefreshKey((prev) => prev + 1);
      setFileName("");
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus dokumen.",
      });
      setFileName("");
    } finally {
      setFileName("");
    }
  };
  return (
    <>
      <Breadcrumb pageName="Dokumen Persyaratan" />

      {!pendaftaranId ? (
        <ShowcaseSection title="Informasi" className="!p-7">
          <p>Silahkan mendaftar terlebih dahulu</p>
        </ShowcaseSection>
      ) : (
        <>
          <div className="mb-12 flex flex-col-reverse gap-6 sm:grid sm:grid-cols-2 sm:gap-12">
            <ShowcaseSection title="Upload Dokumen" className="!p-7">
              <form onSubmit={handleSubmit}>
                <InputGroup
                  label="Nama Dokumen"
                  type="text"
                  name="namaDokumen"
                  className="mb-6"
                  required
                />
                <div className="relative mb-5.5 block w-full rounded-xl border border-dashed border-gray-4 bg-gray-2 hover:border-primary dark:border-dark-3 dark:bg-dark-2 dark:hover:border-primary">
                  <input
                    type="file"
                    name="filePersyaratan"
                    id="filePersyaratan"
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
                    htmlFor="filePersyaratan"
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
            </ShowcaseSection>
            <ShowcaseSection title="Informasi">
              <h3 className="mb-3 text-xl font-bold text-slate-800">
                Daftar dokumen yang harus diupload!
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-gray-700">
                <li>Pas Foto Berwarna Terbaru</li>
                <li>Scan Kartu Keluarga Asli</li>
                <li>Scan KTP Asli</li>
                <li>Scan Akta Lahir Asli</li>
                <li>Scan Ijazah SMA/ Sederajat Asli</li>
              </ul>

              <p className="italic mt-3">
                *Pastikan mengunggah dan mengisi kolom nama dokumen dengan benar
              </p>
            </ShowcaseSection>
          </div>
          <Suspense fallback={<DokumenPersyaratanSkeleton />}>
            <DokumenPersyaratan
              key={refreshKey}
              setRefreshKey={setRefreshKey}
            />
          </Suspense>
        </>
      )}
    </>
  );
}
