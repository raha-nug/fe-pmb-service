"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      nama_asal_sekolah: formData.get("nama_asal_sekolah") as string,
      tahun_lulus_sma: formData.get("tahun_lulus_sma") as string,
      npsn: formData.get("npsn") as string,
      nisn: formData.get("nisn") as string,
      no_pendaftaran_kipk: formData.get("no_pendaftaran_kipk") as string,
    };

    const prevData = JSON.parse(localStorage.getItem("formulir") as string);
    localStorage.setItem(
      "formulir",
      JSON.stringify({
        ...prevData,
        ...data,
      }),
    );

    router.push("/dashboard/calon-mahasiswa/forms/pendaftaran/rencana-kuliah")
  };
  return (
    <>
      <Breadcrumb pageName="Data Sekolah" />
      <ShowcaseSection title="Data Sekolah" className="space-y-5.5 !p-6.5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InputGroup
              label="Nama Asal Sekolah"
              type="text"
              name="nama_asal_sekolah"
              required
            />
            <InputGroup
              label="Tahun Lulus SMA"
              type="text"
              name="tahun_lulus_sma"
              required
            />
            <InputGroup label="NPSN" type="text" name="npsn" required />
            <InputGroup label="NISN" type="text" name="nisn" required />
            <InputGroup
              label="Nomor Pendaftaran KIP Kuliah"
              type="text"
              name="no_pendaftaran_kipk"
            />
          </div>
          <div>
            <Button
              label="Sebelumnya"
              onClick={() =>
                router.push("/dashboard/calon-mahasiswa/forms/pendaftaran/data-pribadi")
              }
              className="float-start"
              variant="outlinePrimary"
              shape="rounded"
              size="small"
            />
            <Button
              label="Selanjutnya"
              className="float-end"
              variant="primary"
              shape="rounded"
              type="submit"
              size="small"
              icon={
                loading && (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
                )
              }
            />
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
}
