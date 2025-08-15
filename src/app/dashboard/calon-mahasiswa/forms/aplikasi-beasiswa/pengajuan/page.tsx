"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { RadioInput } from "@/components/FormElements/radio";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Button } from "@/components/ui-elements/button";
import { useRouter } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";

export default function Page() {
  const router = useRouter();

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
          router.push("/dashboard/forms/pendaftaran");
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
      <Breadcrumb pageName="Aplikasi Beasiswa" />
      <ShowcaseSection title="Aplikasi Beasiswa" className="space-y-5.5 !p-6.5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <h2>Comming Soon</h2>
        </form>
      </ShowcaseSection>
    </>
  );
}
