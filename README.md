# METEO SNAP v1.0
**Smart Meteorological Decision Brief**
*"Dari Informasi Cuaca Menjadi Keputusan Cepat."*

Prototipe dashboard eksekutif untuk Rancangan Aksi Perubahan (RAP) — Pelatihan Kepemimpinan Administrator (PKA), disusun oleh Stasiun Meteorologi Kelas III APT Pranoto Samarinda, BMKG.

## Demo
Dijalankan lewat GitHub Pages: `https://<username>.github.io/meteo-snap/`

## Fitur (Sprint 1–2)
- Dashboard eksekutif bertema BMKG (header, logo, warna resmi)
- Ringkasan cuaca provinsi (status, fenomena dominan, update terakhir)
- Ranking otomatis 10 prioritas wilayah Kalimantan Timur
- Peta choropleth interaktif (Leaflet) dengan batas administrasi asli tiap kabupaten/kota
- Grafik tren status risiko 7 hari (Chart.js)
- Kartu potensi dampak (genangan, longsor, pohon tumbang, angin kencang, gelombang)
- Rekomendasi otomatis per stakeholder (BPBD, Bandara APT Pranoto, KSOP, Pemda, Media, PLN) — Smart Engine rule-based per level risiko (simulasi IBF)
- Generator **WhatsApp Brief** dan **Executive Brief** satu klik
- **Integrasi data cuaca real-time dari API Data Terbuka BMKG** (`api.bmkg.go.id/publik/prakiraan-cuaca`) — mengklasifikasikan risiko wilayah otomatis berdasarkan deskripsi cuaca, curah hujan, dan kecepatan angin aktual
- Mode gelap/terang

## Struktur Proyek
```
index.html            Halaman utama dashboard
assets/style.css       Seluruh styling tema BMKG
assets/app.js          Logika dashboard, decision engine, integrasi API BMKG
assets/kaltim.geojson  Batas administrasi 10 kabupaten/kota Kalimantan Timur (disederhanakan)
assets/logo-bmkg.png   Logo resmi BMKG
```

## Teknologi
HTML5, Bootstrap 5.3, CSS3, JavaScript ES6, Leaflet.js, Chart.js, Font Awesome, API Data Terbuka BMKG.

## Roadmap
- **Sprint 1 (selesai):** Dashboard MVP + peta poligon asli + legenda + grafik tren
- **Sprint 2 (selesai — dasar):** Smart Engine rule-based per level risiko
- **Sprint 3:** Dashboard login per stakeholder (BPBD, Bandara, KSOP) dengan data yang sama
- **Sprint 4:** Integrasi penuh pipeline data BMKG (Forecast → IBF → Warning → update otomatis)

## Sumber Data
Data prakiraan cuaca bersumber dari **Data Prakiraan Cuaca Terbuka BMKG** (data.bmkg.go.id). Data wilayah masih bersifat prototipe/dummy untuk sebagian aspek non-cuaca (skor dampak sektoral, dsb).

## Catatan
Proyek ini adalah prototipe untuk keperluan pelatihan kepemimpinan (PKA), bukan produk resmi BMKG yang telah melalui proses verifikasi operasional.
