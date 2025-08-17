"use client";
import Swal from "sweetalert2";
import { EmailIcon, PasswordIcon, UserIcon } from "@/assets/icons";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
    nama: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // You can remove this code block
    Swal.fire({
      title: "Loading...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        },
      );

      const auth = await res.json();
      if (!res.ok) throw new Error(auth.message || "Gagal Register");
      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Anda akan diarahkan ke halaman login.",
        timer: 2000, // auto close setelah 2 detik
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      if (res.ok) {
        router.push(`/auth/sign-in`);
      }
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Gagal",
        text: error.message || "Terjadi kesalahan saat register.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="text"
        label="Nama"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your name"
        name="nama"
        handleChange={handleChange}
        value={data.nama}
        icon={<UserIcon />}
      />
      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Daftar
        </button>
      </div>
    </form>
  );
}
