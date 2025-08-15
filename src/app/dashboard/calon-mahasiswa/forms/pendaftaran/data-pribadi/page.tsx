"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import InputGroup from "@/components/FormElements/InputGroup";
import { RadioInput } from "@/components/FormElements/radio";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget; // HTMLFormElement
    const formData = new FormData(form);
    const data = {
      nama: formData.get("nama") as string,
      tempat_lahir: formData.get("tempat_lahir") as string,
      tanggal_lahir: formData.get("tanggal_lahir") as string,
      jenis_kelamin: formData.get("jenis_kelamin") as string,
      email_aktif: formData.get("email_aktif") as string,
      no_tlp: formData.get("no_tlp") as string,
      agama: formData.get("agama") as string,
      no_ktp: formData.get("no_ktp") as string,
      no_kk: formData.get("no_kk") as string,
      alamat: formData.get("alamat") as string,
      desa_kelurahan: formData.get("desa_kelurahan") as string,
      kecamatan: formData.get("kecamatan") as string,
      kota_kabupaten: formData.get("kota_kabupaten") as string,
      nama_ibu_kandung: formData.get("nama_ibu_kandung") as string,
      nama_ayah_kandung: formData.get("nama_ayah_kandung") as string,
      no_tlp_ortu: formData.get("no_tlp_ortu") as string,
    };

    localStorage.setItem("formulir", JSON.stringify(data));

    router.push("/dashboard/calon-mahasiswa/forms/pendaftaran/data-sekolah");
  };
  return (
    <>
      <Breadcrumb pageName="Data Pribadi" />
      <ShowcaseSection title="Data Pribadi" className="space-y-5.5 !p-6.5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InputGroup label="Nama Lengkap" type="text" name="nama" required />
            <InputGroup
              label="Tempat Lahir"
              type="text"
              name="tempat_lahir"
              required
            />
            <DatePickerOne
              label="Tanggal Lahir"
              name="tanggal_lahir"
              required
            />
            <div className="flex flex-col justify-between">
              <label
                htmlFor="jenis_kelamin"
                className="text-body-sm font-medium text-dark dark:text-white"
              >
                Jenis Kelamin
                <span className="ml-1 select-none text-red">*</span>
              </label>
              <div className="mb-4 flex gap-4">
                <RadioInput
                  label="Laki Laki"
                  variant="circle"
                  name="jenis_kelamin"
                  value="Laki Laki"
                />
                <RadioInput
                  label="Perempuan"
                  variant="circle"
                  name="jenis_kelamin"
                  value="Perempuan"
                />
              </div>
            </div>
            <InputGroup
              label="Email Aktif"
              type="email"
              name="email_aktif"
              required
            />
            <InputGroup label="No HP / WA" type="text" name="no_tlp" required />
            <Select
              placeholder="Agama"
              label="Agama"
              name="agama"
              items={[
                { label: "Islam", value: "Islam" },
                { label: "Kristen", value: "Kristen" },
                { label: "Katolik", value: "Katolik" },
                { label: "Budha", value: "Budha" },
                { label: "Hindu", value: "Hindu" },
                { label: "Konghucu", value: "Konghucu" },
              ]}
            />
            <InputGroup label="No KTP" type="text" name="no_ktp" required />
            <InputGroup label="No KK" type="text" name="no_kk" required />
            <InputGroup
              label="Alamat (Kampung, RT, dan RW)"
              type="text"
              name="alamat"
              required
            />
            <InputGroup
              label="Desa/Kelurahan"
              type="text"
              name="desa_kelurahan"
              required
            />
            <InputGroup
              label="Kecamatan"
              type="text"
              name="kecamatan"
              required
            />
            <InputGroup
              label="Kota/Kabupaten"
              type="text"
              name="kota_kabupaten"
              required
            />
            <InputGroup
              label="Nama Ibu Kandung (Kapital)"
              type="text"
              name="nama_ibu_kandung"
              required
            />
            <InputGroup
              label="Nama Ayah Kandung (Kapital)"
              type="text"
              name="nama_ayah_kandung"
              required
            />
            <InputGroup
              label="No HP / WA Orang Tua atau Wali"
              type="text"
              name="no_tlp_ortu"
              required
            />
          </div>
          <div>
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
