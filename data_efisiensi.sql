-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 16 Sep 2024 pada 12.08
-- Versi server: 10.4.27-MariaDB
-- Versi PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `data_efisiensi`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `assy`
--

CREATE TABLE `assy` (
  `id_assy` int(11) NOT NULL,
  `1NR_elbow_planning` int(11) NOT NULL,
  `1NR_elbow_actual` int(11) NOT NULL,
  `1NR_ball_planning` int(11) NOT NULL,
  `1NR_ball_actual` int(11) NOT NULL,
  `1NR_hev_planning` int(11) NOT NULL,
  `1NR_hev_actual` int(11) NOT NULL,
  `2NR_elbow_planning` int(11) NOT NULL,
  `2NR_elbow_actual` int(11) NOT NULL,
  `2NR_ball_planning` int(11) NOT NULL,
  `2NR_ball_actual` int(11) NOT NULL,
  `2NR_hev_planning` int(11) NOT NULL,
  `2NR_hev_actual` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `assy`
--

INSERT INTO `assy` (`id_assy`, `1NR_elbow_planning`, `1NR_elbow_actual`, `1NR_ball_planning`, `1NR_ball_actual`, `1NR_hev_planning`, `1NR_hev_actual`, `2NR_elbow_planning`, `2NR_elbow_actual`, `2NR_ball_planning`, `2NR_ball_actual`, `2NR_hev_planning`, `2NR_hev_actual`) VALUES
(3, 15, 16, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16),
(4, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0),
(5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `casting`
--

CREATE TABLE `casting` (
  `id_casting` int(11) NOT NULL,
  `LP_planning` int(11) NOT NULL,
  `LP_actual` int(11) NOT NULL,
  `DC_conv_planning` int(11) NOT NULL,
  `DC_conv_actual` int(11) NOT NULL,
  `DC_hev_planning` int(11) NOT NULL,
  `DC_hev_actual` int(11) NOT NULL,
  `CB_conv_planning` int(11) NOT NULL,
  `CB_conv_actual` int(11) NOT NULL,
  `CB_hev_planning` int(11) NOT NULL,
  `CB_hev_actual` int(11) NOT NULL,
  `CH_conv_planning` int(11) NOT NULL,
  `CH_conv_actual` int(11) NOT NULL,
  `CH_hev_planning` int(11) NOT NULL,
  `CH_hev_actual` int(11) NOT NULL,
  `CA_IN_conv_planning` int(11) NOT NULL,
  `CA_IN_conv_actual` int(11) NOT NULL,
  `CA_IN_hev_planning` int(11) NOT NULL,
  `CA_IN_hev_actual` int(11) NOT NULL,
  `CA_EX_conv_planning` int(11) NOT NULL,
  `CA_EX_conv_actual` int(11) NOT NULL,
  `CA_EX_hev_planning` int(11) NOT NULL,
  `CA_EX_hev_actual` int(11) NOT NULL,
  `CR_1NR_planning` int(11) NOT NULL,
  `CR_1NR_actual` int(11) NOT NULL,
  `CR_2NR_planning` int(11) NOT NULL,
  `CR_2NR_actual` int(11) NOT NULL,
  `elbow_1NR_planning` int(11) NOT NULL,
  `elbow_1NR_actual` int(11) NOT NULL,
  `ball_1NR_planning` int(11) NOT NULL,
  `ball_1NR_actual` int(11) NOT NULL,
  `hev_1NR_planning` int(11) NOT NULL,
  `hev_1NR_actual` int(11) NOT NULL,
  `elbow_2NR_planning` int(11) NOT NULL,
  `elbow_2NR_actual` int(11) NOT NULL,
  `ball_2NR_planning` int(11) NOT NULL,
  `ball_2NR_actual` int(11) NOT NULL,
  `hev_2NR_planning` int(11) NOT NULL,
  `hev_2NR_actual` int(11) NOT NULL,
  `planning_1NR` int(11) NOT NULL,
  `actual_1NR` int(11) NOT NULL,
  `planning_2NR` int(11) NOT NULL,
  `actual_2NR` int(11) NOT NULL,
  `tanggal` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `casting`
--

INSERT INTO `casting` (`id_casting`, `LP_planning`, `LP_actual`, `DC_conv_planning`, `DC_conv_actual`, `DC_hev_planning`, `DC_hev_actual`, `CB_conv_planning`, `CB_conv_actual`, `CB_hev_planning`, `CB_hev_actual`, `CH_conv_planning`, `CH_conv_actual`, `CH_hev_planning`, `CH_hev_actual`, `CA_IN_conv_planning`, `CA_IN_conv_actual`, `CA_IN_hev_planning`, `CA_IN_hev_actual`, `CA_EX_conv_planning`, `CA_EX_conv_actual`, `CA_EX_hev_planning`, `CA_EX_hev_actual`, `CR_1NR_planning`, `CR_1NR_actual`, `CR_2NR_planning`, `CR_2NR_actual`, `elbow_1NR_planning`, `elbow_1NR_actual`, `ball_1NR_planning`, `ball_1NR_actual`, `hev_1NR_planning`, `hev_1NR_actual`, `elbow_2NR_planning`, `elbow_2NR_actual`, `ball_2NR_planning`, `ball_2NR_actual`, `hev_2NR_planning`, `hev_2NR_actual`, `planning_1NR`, `actual_1NR`, `planning_2NR`, `actual_2NR`, `tanggal`) VALUES
(21, 100, 98, 98, 28, 70, 50, 44, 44, 32, 32, 45, 43, 33, 31, 23, 22, 34, 21, 45, 43, 34, 23, 35, 31, 14, 13, 12, 10, 9, 7, 23, 21, 20, 18, 24, 21, 22, 20, 23, 21, 90, 21, '2024-08-23 03:39:16'),
(22, 20, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2024-08-14 17:00:00'),
(23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2024-08-22 17:00:00'),
(24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2024-08-22 17:00:00'),
(25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2024-08-22 17:00:00'),
(26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2024-08-22 17:00:00'),
(27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2024-08-22 17:00:00'),
(28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2024-08-22 17:00:00'),
(29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2024-08-25 17:00:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `machining`
--

CREATE TABLE `machining` (
  `id_machining` int(100) NOT NULL,
  `CB_conv_planning` int(11) NOT NULL,
  `CB_conv_actual` int(11) NOT NULL,
  `CB_hev_planning` int(11) NOT NULL,
  `CB_hev_actual` int(11) NOT NULL,
  `CH_conv_planning` int(11) NOT NULL,
  `CH_conv_actual` int(11) NOT NULL,
  `CH_hev_planning` int(11) NOT NULL,
  `CH_hev_actual` int(11) NOT NULL,
  `CA_IN_conv_planning` int(11) NOT NULL,
  `CA_IN_conv_actual` int(11) NOT NULL,
  `CA_IN_hev_planning` int(11) NOT NULL,
  `CA_IN_hev_actual` int(11) NOT NULL,
  `CA_EX_conv_planning` int(11) NOT NULL,
  `CA_EX_conv_actual` int(11) NOT NULL,
  `CA_EX_hev_planning` int(11) NOT NULL,
  `CA_EX_hev_actual` int(11) NOT NULL,
  `CR_1NR_planning` int(11) NOT NULL,
  `CR_1NR_actual` int(11) NOT NULL,
  `CR_2NR_planning` int(11) NOT NULL,
  `CR_2NR_actual` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `machining`
--

INSERT INTO `machining` (`id_machining`, `CB_conv_planning`, `CB_conv_actual`, `CB_hev_planning`, `CB_hev_actual`, `CH_conv_planning`, `CH_conv_actual`, `CH_hev_planning`, `CH_hev_actual`, `CA_IN_conv_planning`, `CA_IN_conv_actual`, `CA_IN_hev_planning`, `CA_IN_hev_actual`, `CA_EX_conv_planning`, `CA_EX_conv_actual`, `CA_EX_hev_planning`, `CA_EX_hev_actual`, `CR_1NR_planning`, `CR_1NR_actual`, `CR_2NR_planning`, `CR_2NR_actual`) VALUES
(4, 13, 14, 13, 15, 0, 16, 13, 17, 13, 18, 13, 19, 13, 20, 13, 21, 13, 22, 13, 23),
(5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0),
(6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `packing`
--

CREATE TABLE `packing` (
  `id_packing` int(11) NOT NULL,
  `1NR_planning` int(11) NOT NULL,
  `1NR_actual` int(11) NOT NULL,
  `2NR_planning` int(11) NOT NULL,
  `2NR_actual` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `packing`
--

INSERT INTO `packing` (`id_packing`, `1NR_planning`, `1NR_actual`, `2NR_planning`, `2NR_actual`) VALUES
(4, 15, 16, 15, 16),
(5, 0, 0, 0, 0),
(6, 0, 0, 0, 0),
(7, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `shift`
--

CREATE TABLE `shift` (
  `id_shift` int(10) NOT NULL,
  `day_shift` varchar(255) NOT NULL,
  `night_shift` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `assy`
--
ALTER TABLE `assy`
  ADD PRIMARY KEY (`id_assy`);

--
-- Indeks untuk tabel `casting`
--
ALTER TABLE `casting`
  ADD PRIMARY KEY (`id_casting`);

--
-- Indeks untuk tabel `machining`
--
ALTER TABLE `machining`
  ADD PRIMARY KEY (`id_machining`);

--
-- Indeks untuk tabel `packing`
--
ALTER TABLE `packing`
  ADD PRIMARY KEY (`id_packing`);

--
-- Indeks untuk tabel `shift`
--
ALTER TABLE `shift`
  ADD PRIMARY KEY (`id_shift`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `assy`
--
ALTER TABLE `assy`
  MODIFY `id_assy` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `casting`
--
ALTER TABLE `casting`
  MODIFY `id_casting` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT untuk tabel `machining`
--
ALTER TABLE `machining`
  MODIFY `id_machining` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `packing`
--
ALTER TABLE `packing`
  MODIFY `id_packing` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `shift`
--
ALTER TABLE `shift`
  MODIFY `id_shift` int(10) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
