"use client";
import { useState, useEffect } from "react";

interface HasilSeleksi {
  id: string;
  pendaftaranId: string;
  calonMahasiswaId: string;
  statusKelulusan: string;
  programStudiDiterimaId?: string;
  catatanAdmin?: string;
  tanggalKeputusan: string;
}

interface Pendaftaran {
  id: string;
  namaLengkap: string;
}

interface ProgramStudi {
  id: string;
  nama: string;
}

export default function HasilSeleksiPage() {
  const [data, setData] = useState<HasilSeleksi[]>([]);
  const [pendaftaranList, setPendaftaranList] = useState<Pendaftaran[]>([]);
  const [prodiList, setProdiList] = useState<ProgramStudi[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<HasilSeleksi | null>(null);

  const [form, setForm] = useState<Partial<HasilSeleksi>>({});

  useEffect(() => {
    fetchData();
    fetchPendaftaran();
    fetchProdi();
  }, []);

  async function fetchData() {
    setLoading(true);
    const res = await fetch("/api/hasil-seleksi");
    const json = await res.json();
    setData(json.data || []);
    setLoading(false);
  }

  async function fetchPendaftaran() {
    const res = await fetch("/api/pendaftaran");
    const json = await res.json();
    setPendaftaranList(json.data || []);
  }

  async function fetchProdi() {
    const res = await fetch("/api/program-studi");
    const json = await res.json();
    setProdiList(json.data || []);
  }

  function openForm(item?: HasilSeleksi) {
    if (item) {
      setEditing(item);
      setForm(item);
    } else {
      setEditing(null);
      setForm({});
    }
    setShowForm(true);
  }

  async function saveData() {
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `/api/hasil-seleksi/${editing.id}`
      : `/api/hasil-seleksi`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setShowForm(false);
    fetchData();
  }

  async function deleteData(id: string) {
    if (!confirm("Yakin ingin menghapus?")) return;
    await fetch(`/api/hasil-seleksi/${id}`, { method: "DELETE" });
    fetchData();
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="mb-4 text-xl font-bold">CRUD Hasil Seleksi</h1>
      <button
        onClick={() => openForm()}
        style={{
          background: "#4CAF50",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: "6px",
          marginBottom: "10px",
        }}
      >
        Tambah
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                Pendaftar
              </th>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                Status
              </th>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                Program Studi
              </th>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>
                Catatan
              </th>
              <th style={{ border: "1px solid #ccc", padding: "6px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id}>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  {pendaftaranList.find((p) => p.id === d.pendaftaranId)
                    ?.namaLengkap || "-"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  {d.statusKelulusan}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  {prodiList.find((p) => p.id === d.programStudiDiterimaId)
                    ?.nama || "-"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  {d.catatanAdmin || "-"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "6px" }}>
                  <button onClick={() => openForm(d)}>Edit</button>{" "}
                  <button
                    onClick={() => deleteData(d.id)}
                    style={{ color: "red" }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h2 className="mb-3 text-lg font-bold">
              {editing ? "Edit" : "Tambah"} Hasil Seleksi
            </h2>

            <label className="mb-1 block font-semibold">Pendaftar</label>
            <select
              value={form.pendaftaranId || ""}
              onChange={(e) =>
                setForm({ ...form, pendaftaranId: e.target.value })
              }
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="">-- Pilih --</option>
              {pendaftaranList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.namaLengkap}
                </option>
              ))}
            </select>

            <label className="mb-1 mt-3 block font-semibold">
              Status Kelulusan
            </label>
            <select
              value={form.statusKelulusan || ""}
              onChange={(e) =>
                setForm({ ...form, statusKelulusan: e.target.value })
              }
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="LULUS">Lulus</option>
              <option value="TIDAK_LULUS">Tidak Lulus</option>
            </select>

            <label className="mb-1 mt-3 block font-semibold">
              Program Studi Diterima
            </label>
            <select
              value={form.programStudiDiterimaId || ""}
              onChange={(e) =>
                setForm({ ...form, programStudiDiterimaId: e.target.value })
              }
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="">-- Pilih --</option>
              {prodiList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nama}
                </option>
              ))}
            </select>

            <label className="mb-1 mt-3 block font-semibold">
              Catatan Admin
            </label>
            <textarea
              value={form.catatanAdmin || ""}
              onChange={(e) =>
                setForm({ ...form, catatanAdmin: e.target.value })
              }
              rows={3}
              style={{
                width: "100%",
                padding: "6px 8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowForm(false)}>Batal</button>
              <button
                onClick={saveData}
                style={{
                  background: "#4CAF50",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
