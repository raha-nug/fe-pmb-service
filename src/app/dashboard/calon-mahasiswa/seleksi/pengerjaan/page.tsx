"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface PilihanJawaban {
  id: string;
  text: string;
}

interface Soal {
  id: string;
  pertanyaan: string;
  pilihanJawaban: PilihanJawaban[];
}

interface SesiUjian {
  id: string;
  pendaftaranId: string;
}

export default function PengerjaanUjianPage() {
  const router = useRouter();
  const [sesi, setSesi] = useState<SesiUjian | null>(null);
  const [soalList, setSoalList] = useState<Soal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [jawaban, setJawaban] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const pendaftaranId =
    typeof window !== "undefined"
      ? localStorage.getItem("pendaftaranId")
      : null;

  const fetchSesi = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SELEKSI_SERVICE_URL}/api/seleksi/sesi/${pendaftaranId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const json = await res.json();
      const data = json.data;

      setSesi({
        id: data.id,
        pendaftaranId: data.pendaftaranId,
      });

      handleStartUjian(data.id);
    } catch (err) {
      console.error(err);
      Swal.fire("Gagal", "Gagal mengambil sesi ujian", "error");
      router.push("/dashboard/calon-mahasiswa/seleksi");
    }
  };

  const handleStartUjian = async (sesiUjianId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SELEKSI_SERVICE_URL}/api/seleksi/sesi/${sesiUjianId}/start`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const json = await res.json();
      const soal = json.data?.soal;

      if (!soal || soal.length === 0) {
        Swal.fire("Error", "Soal tidak tersedia", "error");
        router.push("/dashboard/calon-mahasiswa/seleksi");
        return;
      }

      setSoalList(soal);
      setIsLoading(false);
    } catch (err) {
      console.error("Gagal memulai ujian");
      Swal.fire("Error", "Gagal memulai sesi ujian", "error");
      router.push("/dashboard/calon-mahasiswa/seleksi");
    }
  };

  useEffect(() => {
    if (pendaftaranId) {
      fetchSesi();
    }
  }, [pendaftaranId]);

  const handleJawab = (soalId: string, pilihanId: string) => {
    setJawaban((prev) => ({ ...prev, [soalId]: pilihanId }));
  };

  const handleSubmit = async () => {
    const konfirmasi = await Swal.fire({
      title: "Selesai?",
      text: "Yakin ingin mengirim semua jawaban?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Kirim",
      cancelButtonText: "Kembali",
    });

    if (!konfirmasi.isConfirmed || !sesi) return;

    const jawabanArray = Object.entries(jawaban).map(([soalId, jawaban]) => ({
      soalId,
      jawaban,
    }));

    try {
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SELEKSI_SERVICE_URL}/api/seleksi/sesi/${sesi.id}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jawaban: jawabanArray }),
        },
      );

      if (res.ok) {
        Swal.fire("Berhasil", "Jawaban berhasil dikirim!", "success").then(() =>
          router.push("/dashboard/calon-mahasiswa/seleksi"),
        );
      } else {
        Swal.fire("Gagal", "Gagal mengirim jawaban", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Terjadi kesalahan pengiriman", "error");
    }
  };

  if (isLoading) return <p>Memuat ujian...</p>;

  const soal = soalList[currentIndex];
  const total = soalList.length;

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-xl font-bold">
        Soal {currentIndex + 1} dari {total}
      </h1>
      <div className="rounded bg-white p-4 shadow">
        <p className="mb-4">{soal.pertanyaan}</p>
        <div className="space-y-2">
          {soal.pilihanJawaban.map((pil) => (
            <label key={pil.id} className="flex items-center gap-2">
              <input
                type="radio"
                name={soal.id}
                value={pil.id}
                checked={jawaban[soal.id] === pil.id}
                onChange={() => handleJawab(soal.id, pil.id)}
              />
              <span>
                {pil.id}. {pil.text}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="rounded bg-gray-300 px-4 py-2"
          >
            Sebelumnya
          </button>
          {currentIndex < total - 1 ? (
            <button
              onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Selanjutnya
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="rounded bg-green-600 px-4 py-2 text-white"
            >
              Selesai & Kirim
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
