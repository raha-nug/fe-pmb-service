import RequireAuth from "@/components/RequireAuth";

export default function CalonMahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth allowedRoles={["CALON_MAHASISWA"]}>{children}</RequireAuth>
  );
}
