"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { RadioInput } from "@/components/FormElements/radio";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Page() {
  const router = useRouter();
  const [prodi, setProdi] = useState([]);

  useEffect(() => {
    const getProdi = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_OPERASIONAL_SERVICE_URL}/api/program-studi`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.ok) {
          const data = await res.json();

          const formattedProdi = data.data.map((prodi: any) => ({
            label: prodi.namaProdi,
            value: prodi.namaProdi,
          }));

          setProdi(formattedProdi);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getProdi();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      prodi: formData.get("prodi") as string,
      sistem_kuliah: formData.get("sistem_kuliah") as string,
      rencana_tinggal: formData.get("rencana_tinggal") as string,
      alat_transportasi: formData.get("alat_transportasi") as string,
      pemberi_rekomendasi: formData.get("pemberi_rekomendasi") as string,
      no_hp_pemberi_rekomendasi: formData.get(
        "no_hp_pemberi_rekomendasi",
      ) as string,
      asal_info_sttc: formData.get("asal_info_sttc") as string,
      daftar_beasiswa: formData.get("daftar_beasiswa") as string,
    };

    const prevData = JSON.parse(localStorage.getItem("formulir") as string);
    const token = localStorage.getItem("token");
    const gelombangId = localStorage.getItem("gelombangId");
    const user = JSON.parse(localStorage.getItem("user") as string);
    const dataToReturn = {
      ...prevData,
      ...data,
    };

    const konfirmasi = await Swal.fire({
      title: "Selesai?",
      text: "Yakin ingin mengirim semua jawaban?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Kirim",
      cancelButtonText: "Kembali",
    });

    if (konfirmasi.isConfirmed) {
      try {
        // You can remove this code block
        Swal.fire({
          title: "Loading...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PENDAFTARAN_SERVICE_URL}/api/pendaftaran`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              calonMahasiswaId: user.id,
              gelombangId: gelombangId,
              dataFormulir: dataToReturn,
            }),
          },
        );

        const pendaftaran = await res.json();

        if (res.ok) {
          await Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Anda akan diarahkan ke dashboard.",
            timer: 2000, // auto close setelah 2 detik
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
          localStorage.setItem("pendaftaranId", pendaftaran.data.id);
          localStorage.setItem(
            "nomorPendaftaran",
            pendaftaran.data.nomorPendaftaran,
          );
          router.push("/dashboard/calon-mahasiswa/forms/pendaftaran");
        }
      } catch (error: any) {
        await Swal.fire({
          icon: "error",
          title: "Gagal",
          text: error.message || "Terjadi kesalahan saat mendaftar.",
        });
      }
    }
  };
  return (
    <>
      <Breadcrumb pageName="Rencana Kuliah" />
      <ShowcaseSection title="Rencana Kuliah" className="space-y-5.5 !p-6.5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Select
              placeholder="Prodi"
              label="Program Studi yang dipulih"
              name="prodi"
              items={prodi}
              required
            />
            <Select
              placeholder="Sistem Kuliah"
              label="Sistem Kuliah"
              name="sistem_kuliah"
              items={[
                { label: "Kelas Reguler", value: "Kelas Reguler" },
                { label: "Kelas Karyawan", value: "Kelas Karyawan" },
              ]}
              required
            />
            <Select
              placeholder="Rencana Tempat Tinggal"
              label="Rencana Tempat Tinggal Ketika Kuliah"
              name="rencana_tinggal"
              items={[
                {
                  label: "Bersama Orang Tua / Kenalan",
                  value: "Bersama Orang Tua / Kenalan",
                },
                { label: "Kost / Sewa", value: "Kost / Sewa" },
                { label: "Pesantren", value: "Pesantren" },
                { label: "Belum Ada", value: "Belum Ada" },
              ]}
            />
            <Select
              placeholder="Alat Transportasi"
              label="Alat Transportasi Ketika Kuliah"
              name="alat_transportasi"
              items={[
                { label: "Jalan Kaki", value: "Jalan Kaki" },
                { label: "Angkutan Umum", value: "Angkutan Umum" },
                { label: "Sepeda", value: "Sepeda" },
                { label: "Sepeda Motor", value: "Sepeda Motor" },
                { label: "Lainnya", value: "Lainnya" },
              ]}
            />
            <InputGroup
              label="Pemberi Rekomendasi Kuliah di STT Cipasung"
              type="text"
              name="pemberi_rekomendasi"
            />
            <InputGroup
              label="No HP Pemberi Rekomendasi"
              type="text"
              name="no_hp_pemberi_rekomendasi"
            />

            <Select
              placeholder=" "
              label="Dapat Informasi STT Cipasung dari mana?"
              name="asal_info_sttc"
              items={[
                { label: "Sekolah", value: "Sekolah" },
                { label: "Teman", value: "Teman" },
                { label: "Keluarga", value: "Keluarga" },
                { label: "Brosur / Banner", value: "Brosur / Banner" },
                { label: "Media Sosial", value: "Media Sosial" },
              ]}
            />
            <div className="flex flex-col justify-between">
              <label
                htmlFor="daftar_beasiswa"
                className="text-body-sm font-medium text-dark dark:text-white"
              >
                Daftar Beasiswa?
                <span className="ml-1 select-none text-red">*</span>
              </label>
              <div className="mb-4 flex gap-4">
                <RadioInput
                  label="Ya"
                  variant="circle"
                  name="daftar_beasiswa"
                  value="Ya"
                />
                <RadioInput
                  label="Tidak"
                  variant="circle"
                  name="daftar_beasiswa"
                  value="Tidak"
                />
              </div>
            </div>
          </div>
          <div>
            <Button
              label="Sebelumnya"
              onClick={() =>
                router.push(
                  "/dashboard/calon-mahasiswa/forms/pendaftaran/data-sekolah",
                )
              }
              className="float-start"
              variant="outlinePrimary"
              shape="rounded"
              size="small"
            />
            <Button
              label="Kirim"
              className="float-end"
              variant="primary"
              shape="rounded"
              size="small"
              type="submit"
            />
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
}
