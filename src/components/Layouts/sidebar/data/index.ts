import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/dashboard/calon-mahasiswa",
        items: [],
      },

      {
        title: "Forms",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Pendaftaran",
            url: "/dashboard/calon-mahasiswa/forms/pendaftaran",
          },
          {
            title: "Dokumen Persyaratan",
            url: "/dashboard/calon-mahasiswa/forms/dokumen-persyaratan",
          },
          {
            title: "Aplikasi Beasiswa",
            url: "/dashboard/calon-mahasiswa/forms/aplikasi-beasiswa",
          },
          {
            title: "Daftar Ulang",
            url: "/dashboard/calon-mahasiswa/forms/daftar-ulang",
          },
        ],
      },
      {
        title: "Seleksi",
        icon: Icons.Alphabet,
        url: "/dashboard/calon-mahasiswa/seleksi",
        items: [],
      },
      {
        title: "Pengumuman",
        icon: Icons.Table,
        url: "/dashboard/calon-mahasiswa/pengumuman",
        items: [],
      },
    ],
  },

];


export const NAV_ADMIN = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/dashboard/admin",
        items: [],
      },
      {
        title: "Pendaftaran",
        icon: Icons.Alphabet,
        url: "/dashboard/admin/pendaftaran",
        items: [],
      },

      {
        title: "CMS",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Gelombang",
            url: "/dashboard/admin/cms/gelombang",
          },
          {
            title: "Program Studi",
            url: "/dashboard/admin/cms/prodi",
          },
          {
            title: "Pengumuman",
            url: "/dashboard/admin/cms/pengumuman",
          },
        ],
      },
      {
        title: "Seleksi",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Bank Soal",
            url: "/dashboard/admin/seleksi/bank-soal",
          },
          {
            title: "Soal Ujian Set",
            url: "/dashboard/admin/seleksi/soal-ujian-set",
          },
          {
            title: "Jadwal Seleksi",
            url: "/dashboard/admin/seleksi/jadwal-seleksi",
          },
          {
            title: "Validasi Seleksi",
            url: "/dashboard/admin/seleksi/validasi-seleksi",
          },
        ],
      },
      {
        title: "Pembayaran",
        icon: Icons.PieChart,
        url: "/dashboard/admin/pembayaran",
        items: [],
      },
    ],
  },
];
