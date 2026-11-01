import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ThreeSeabedCanvas } from './components/ThreeSeabedCanvas';

gsap.registerPlugin(ScrollTrigger);

interface StationRecord {
  id: string;
  code: string;
  location: string;
  substrate: string;
  salinity: string;
  sedimentRate: string;
  benthosCount: string;
  status: string;
  canopyDensity: string;
  phValue: string;
}

const STATIONS: StationRecord[] = [
  {
    id: 'KASUGENGAN',
    code: 'ST-01',
    location: 'Kasugengan Lor',
    substrate: 'Lumpur Liat Organik',
    salinity: '18.4 PSU',
    sedimentRate: '+2.4 cm/thn',
    benthosCount: '14 Spesies/m²',
    status: 'Sangat Sehat',
    canopyDensity: '92%',
    phValue: '7.8 pH',
  },
  {
    id: 'MUNDU',
    code: 'ST-02',
    location: 'Mundu Pesisir',
    substrate: 'Lumpur Berpasir',
    salinity: '24.1 PSU',
    sedimentRate: '+1.8 cm/thn',
    benthosCount: '9 Spesies/m²',
    status: 'Pemulihan Aktif',
    canopyDensity: '76%',
    phValue: '7.5 pH',
  },
  {
    id: 'ASTANAJAPURA',
    code: 'ST-03',
    location: 'Muara Japura',
    substrate: 'Lumpur Aluvial Dalam',
    salinity: '21.0 PSU',
    sedimentRate: '+3.1 cm/thn',
    benthosCount: '16 Spesies/m²',
    status: 'Sangat Sehat',
    canopyDensity: '89%',
    phValue: '8.0 pH',
  },
  {
    id: 'LOSARI',
    code: 'ST-04',
    location: 'Losari Barat',
    substrate: 'Garis Pasir Pantai',
    salinity: '27.5 PSU',
    sedimentRate: '+1.2 cm/thn',
    benthosCount: '7 Spesies/m²',
    status: 'Konsolidasi',
    canopyDensity: '64%',
    phValue: '7.4 pH',
  },
];

export default function App() {
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.0 } });
      tl.from('.hero-badge-tag', { opacity: 0, y: -16 })
        .from('.hero-main-title', { opacity: 0, y: 32, duration: 1.1 }, '-=0.7')
        .from('.hero-main-desc', { opacity: 0, y: 20 }, '-=0.8')
        .from('.hero-cta-group', { opacity: 0, y: 14 }, '-=0.8')
        .from('.hero-3d-box', { opacity: 0, scale: 0.97, y: 24, duration: 1.2 }, '-=0.9');

      // Asymmetrical Bento ScrollTrigger Reveal
      const bentoCards = gsap.utils.toArray<HTMLElement>('.bento-item');
      gsap.from(bentoCards, {
        scrollTrigger: {
          trigger: bentoRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power2.out',
      });
    },
    { scope: mainRef }
  );

  const filteredStations =
    selectedZone === 'ALL'
      ? STATIONS
      : STATIONS.filter((s) => s.id === selectedZone);

  return (
    <div ref={mainRef} className="min-h-screen bg-paper text-ink font-sans selection:bg-brand selection:text-white">
      {/* ─── Architectural Grid Background ─── */}
      <div className="fixed inset-0 grid-carto pointer-events-none opacity-60 z-0" />

      {/* ─── Floating Island Navigation ─── */}
      <div className="sticky top-6 z-50 px-4 mb-[-84px]">
        <header className="max-w-[1080px] mx-auto bg-paper/85 backdrop-blur-2xl border border-line-strong rounded-full h-[58px] flex items-center justify-between px-6 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-brand text-paper flex items-center justify-center font-serif text-lg font-normal">
              S
            </span>
            <div className="flex flex-col">
              <span className="font-bold text-[13.5px] tracking-tight text-ink leading-tight">
                SABUK TELUK CIREBON
              </span>
              <span className="font-mono text-[10px] text-ink-muted tracking-wider">
                6°41'28"S 108°34'12"E
              </span>
            </div>
          </div>

          <nav aria-label="Navigasi Utama" className="hidden md:flex items-center gap-8">
            <a href="#sabuk" className="text-[12.5px] font-medium text-ink-secondary hover:text-ink transition-colors tracking-wide">
              Zonasi Sabuk
            </a>
            <a href="#batimetri" className="text-[12.5px] font-medium text-ink-secondary hover:text-ink transition-colors tracking-wide">
              Batimetri &amp; 3D
            </a>
            <a href="#stasiun" className="text-[12.5px] font-medium text-ink-secondary hover:text-ink transition-colors tracking-wide">
              Titik Pantau
            </a>
            <a href="#manifesto" className="text-[12.5px] font-medium text-ink-secondary hover:text-ink transition-colors tracking-wide">
              Konsorsium Pokmas
            </a>
          </nav>

          <a
            href="#stasiun"
            className="inline-flex items-center gap-3 h-10 pl-4 pr-1.5 bg-brand text-white text-[12px] font-semibold rounded-full hover:bg-brand-hover active:scale-[0.98] transition-all shadow-sm"
          >
            <span>Kunjungan Lapangan</span>
            <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-[11px] transition-transform group-hover:translate-x-0.5">
              ↗
            </span>
          </a>
        </header>
      </div>

      <main className="relative z-10">
        {/* ─── Hero Section with Swiss Architectural Grid ─── */}
        <section ref={heroRef} className="pt-36 pb-20 border-b border-line">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Editorial Display Typography */}
              <div className="lg:col-span-7">
                <div className="hero-badge-tag inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface border border-line-strong shadow-xs text-[11px] font-mono text-brand mb-6 tabular-nums">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>STASIUN KASUGENGAN LOR : STATUS SABUK AKTIF</span>
                </div>

                <h1 className="hero-main-title font-serif text-5xl sm:text-6xl lg:text-[74px] font-normal leading-[0.98] tracking-tight text-ink mb-6">
                  Restorasi Ekologi Mangrove <em className="italic text-brand">Pesisir Pantura</em>
                </h1>

                <p className="hero-main-desc text-base sm:text-lg text-ink-secondary leading-relaxed max-w-xl font-light mb-8">
                  Rekonstruksi presisi 34 hektar sabuk hijau penahan pasang surut air laut Jawa, memadukan sains batimetri substrat dengan perakaran alami <span className="font-serif italic text-ink">Rhizophora mucronata</span>.
                </p>

                <div className="hero-cta-group flex items-center gap-4 flex-wrap">
                  <a
                    href="#stasiun"
                    className="inline-flex items-center gap-3.5 h-12 px-7 bg-brand text-white text-[13px] font-medium rounded-full hover:bg-brand-hover active:scale-[0.98] transition-all shadow-soft"
                  >
                    <span>Eksplorasi Data Stasiun</span>
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                      ↗
                    </span>
                  </a>
                  <a
                    href="#batimetri"
                    className="inline-flex items-center h-12 px-6 border border-line-strong text-ink text-[13px] font-medium rounded-full hover:bg-surface transition-colors"
                  >
                    Laporan Batimetri Q4 2026
                  </a>
                </div>

                <div className="mt-10 pt-6 border-t border-line/70 grid grid-cols-3 gap-6 font-mono text-[11px] text-ink-muted">
                  <div>
                    <span className="block text-ink font-semibold">KOORDINAT</span>
                    <span>06°41'28"S 108°34'12"E</span>
                  </div>
                  <div>
                    <span className="block text-ink font-semibold">TIPE VEGETASI</span>
                    <span>Rhizophora &amp; Avicennia</span>
                  </div>
                  <div>
                    <span className="block text-ink font-semibold">SURUT TERENDAH</span>
                    <span>LAT -1.2m MSL</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Double-Bezel 3D WebGL Canvas */}
              <div className="hero-3d-box lg:col-span-5 crosshair-corner">
                <div className="bg-ink/[0.03] border border-line-strong p-2.5 rounded-bezel shadow-bezel">
                  <div className="bg-surface border border-line-subtle rounded-core p-5 relative overflow-hidden">
                    <div className="flex justify-between items-center pb-3.5 border-b border-line mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink font-semibold">
                          Batimetri Pasang Surut 3D
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-terracotta bg-terracotta-tint px-2.5 py-0.5 rounded-full font-semibold">
                        WebGL 60 FPS
                      </span>
                    </div>

                    {/* Three.js Interactive WebGL Canvas */}
                    <ThreeSeabedCanvas className="mb-4" />

                    {/* Telemetry Readout Metrics */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      <div className="border-l-2 border-brand pl-2.5">
                        <div className="font-mono text-[10px] uppercase text-ink-muted">Salinitas</div>
                        <div className="font-serif text-2xl text-ink font-normal tabular-nums">
                          18.4 <span className="font-sans text-[10px] text-ink-muted">PSU</span>
                        </div>
                      </div>
                      <div className="border-l-2 border-line-strong pl-2.5">
                        <div className="font-mono text-[10px] uppercase text-ink-muted">Akresi</div>
                        <div className="font-serif text-2xl text-ink font-normal tabular-nums">
                          +2.4 <span className="font-sans text-[10px] text-ink-muted">cm/th</span>
                        </div>
                      </div>
                      <div className="border-l-2 border-terracotta pl-2.5">
                        <div className="font-mono text-[10px] uppercase text-ink-muted">Dissolved O2</div>
                        <div className="font-serif text-2xl text-ink font-normal tabular-nums">
                          6.8 <span className="font-sans text-[10px] text-ink-muted">mg/L</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Asymmetrical Bento Grid Section ─── */}
        <section id="sabuk" className="py-24 border-b border-line bg-paper/50">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-terracotta font-semibold mb-2">
                  01 / ARSITEKTUR SABUK HIJAU
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-ink">
                  Matriks Lapangan Kasugengan Lor
                </h2>
              </div>
              <p className="text-ink-secondary text-[13.5px] max-w-md font-light leading-relaxed">
                Pemantauan terpadu restorasi pesisir berbasis sains geofisika tanah dan kemitraan masyarakat nelayan tradisional Pantura.
              </p>
            </div>

            {/* Asymmetrical 12-Column Bento Grid */}
            <div ref={bentoRef} className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Card 1: 34,8 Ha Sabuk Bio-Benteng (col-span-7) */}
              <div className="bento-item md:col-span-7 bg-surface border border-line-strong rounded-core p-8 flex flex-col justify-between relative overflow-hidden shadow-xs">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="font-mono text-[11px] text-ink-muted uppercase tracking-wider block mb-1">
                      ZONASI INTI RESTORASI
                    </span>
                    <h3 className="font-serif text-3xl font-normal text-ink">
                      34,8 Hektar Tanggul Alami
                    </h3>
                  </div>
                  <span className="font-mono text-[11px] bg-brand-tint text-brand px-3 py-1 rounded-full font-semibold">
                    Proteksi Aktif
                  </span>
                </div>

                <p className="text-ink-secondary text-[13.5px] leading-relaxed mb-6 font-light max-w-lg">
                  Meredam energi gelombang muson timur hingga 68% sebelum mencapai tambak garam produktif dan pemukiman pesisir. Mengunci laju sedimentasi positif pada muara sungai.
                </p>

                {/* Wave Damping Progress Visualizer */}
                <div className="bg-[#f6f4ed] border border-line p-4 rounded-xl">
                  <div className="flex justify-between text-[11px] font-mono text-ink-muted mb-2">
                    <span>Efikasi Peredaman Ombak (Wave Attenuation)</span>
                    <span className="text-brand font-semibold tabular-nums">68.4%</span>
                  </div>
                  <div className="w-full h-2.5 bg-line rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: '68.4%' }} />
                  </div>
                </div>
              </div>

              {/* Card 2: 14.200 Propagul (col-span-5) */}
              <div className="bento-item md:col-span-5 bg-surface border border-line-strong rounded-core p-8 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="font-mono text-[11px] text-ink-muted uppercase tracking-wider">
                      SEMAI PROPAGUL
                    </span>
                    <span className="font-mono text-[11px] text-terracotta">91,4% Kelulushidupan</span>
                  </div>
                  <div className="font-serif text-5xl font-normal text-brand tracking-tight mb-2 tabular-nums">
                    14.200
                  </div>
                  <div className="font-bold text-[14px] text-ink mb-2">Propagul Rhizophora Tumbuh</div>
                  <p className="text-ink-secondary text-[13px] font-light leading-relaxed">
                    Ditanam bertahap pada substrat lumpur pasang surut dengan fraksi lempung organik 64% dan salinitas stabil 18-24 PSU.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-line flex justify-between font-mono text-[11px] text-ink-muted">
                  <span>VARIETAS: R. MUCRONATA</span>
                  <span className="text-ink font-semibold">AKAR TUNJANG RAPAT</span>
                </div>
              </div>

              {/* Card 3: 18 Pokmas Nelayan (col-span-4) */}
              <div className="bento-item md:col-span-4 bg-surface border border-line-strong rounded-core p-8 flex flex-col justify-between shadow-xs">
                <div>
                  <span className="font-mono text-[11px] text-ink-muted uppercase tracking-wider block mb-1">
                    KOLABORASI KOMUNITAS
                  </span>
                  <div className="font-serif text-5xl font-normal text-ink tracking-tight mb-2 tabular-nums">
                    18 Pokmas
                  </div>
                  <div className="font-bold text-[14px] text-ink mb-2">Kelompok Masyarakat Pengawas</div>
                  <p className="text-ink-secondary text-[13px] font-light leading-relaxed">
                    Kemitraan mandiri kelompok tani nelayan Mundu, Kasugengan, dan Losari untuk rotasi patroli kebersihan sabuk dan penyiangan sampah plastik.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-[11px] font-mono text-ink-muted">
                  <span>ANGGOTA AKTIF</span>
                  <span className="text-brand font-semibold">240+ Nelayan</span>
                </div>
              </div>

              {/* Card 4: Data Inti Salinitas & Sedimen (col-span-8) */}
              <div id="batimetri" className="bento-item md:col-span-8 bg-surface border border-line-strong rounded-core p-8 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="font-mono text-[11px] text-ink-muted uppercase tracking-wider">
                      AKRESI SEDIMEN PASANG SURUT
                    </span>
                    <span className="font-mono text-[11px] text-brand font-semibold">Audit Kuartal IV 2026</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-ink mb-3">
                    Laju Pembentukan Daratan Baru
                  </h3>
                  <p className="text-ink-secondary text-[13px] font-light leading-relaxed max-w-xl mb-6">
                    Sistem perakaran tunjang menjebak sedimen lumpur terlarut, menghasilkan pertambahan daratan hingga +2.4 cm per tahun di zona muara Kasugengan dan +3.1 cm di Japura.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-line">
                  <div>
                    <span className="font-mono text-[10.5px] text-ink-muted block">ST-01 KASUGENGAN</span>
                    <span className="font-serif text-xl text-ink font-normal tabular-nums">+2.4 cm/th</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10.5px] text-ink-muted block">ST-02 MUNDU</span>
                    <span className="font-serif text-xl text-ink font-normal tabular-nums">+1.8 cm/th</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10.5px] text-ink-muted block">ST-03 JAPURA</span>
                    <span className="font-serif text-xl text-ink font-normal tabular-nums">+3.1 cm/th</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10.5px] text-ink-muted block">ST-04 LOSARI</span>
                    <span className="font-serif text-xl text-ink font-normal tabular-nums">+1.2 cm/th</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Observation Station Ledger Table ─── */}
        <section id="stasiun" className="py-24 border-b border-line bg-[#f6f5ed]">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-widest text-terracotta font-semibold mb-2">
                  02 / MATRIKS 4 TITIK PANTAU
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-ink">
                  Data Laboratorium Hidrologi Teluk Cirebon
                </h2>
              </div>
              <p className="text-ink-secondary text-[13.5px] max-w-md font-light">
                Sampel air, derajat keasaman (pH), salinitas, dan kepadatan bentos diuji berkala bersama Balai Riset Pesisir.
              </p>
            </div>

            {/* Interactive Station Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 flex-wrap" role="tablist">
              {[
                { id: 'ALL', label: 'Seluruh Titik Pantau' },
                { id: 'KASUGENGAN', label: 'ST-01 Kasugengan Lor' },
                { id: 'MUNDU', label: 'ST-02 Mundu Pesisir' },
                { id: 'ASTANAJAPURA', label: 'ST-03 Muara Japura' },
                { id: 'LOSARI', label: 'ST-04 Losari Barat' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedZone(tab.id)}
                  className={`px-4 py-2 rounded-full text-[12px] font-medium border transition-all ${
                    selectedZone === tab.id
                      ? 'bg-brand text-white border-brand shadow-xs'
                      : 'bg-surface text-ink-secondary border-line hover:text-ink hover:border-line-strong'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Swiss Precision Data Table */}
            <div className="bg-surface border border-line-strong rounded-core overflow-x-auto shadow-soft">
              <table className="w-full text-left text-[13.5px] border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-[#f0ede1] border-b border-line-strong font-mono text-[10.5px] uppercase tracking-wider text-ink-secondary font-semibold">
                    <th className="py-3.5 px-6">Kode &amp; Lokasi</th>
                    <th className="py-3.5 px-6">Tipe Substrat</th>
                    <th className="py-3.5 px-6">Salinitas</th>
                    <th className="py-3.5 px-6">Keasaman (pH)</th>
                    <th className="py-3.5 px-6">Laju Sedimen</th>
                    <th className="py-3.5 px-6">Bentos</th>
                    <th className="py-3.5 px-6">Kerapatan Sabuk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-subtle">
                  {filteredStations.map((station) => (
                    <tr key={station.id} className="hover:bg-brand/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-ink">{station.code}</div>
                        <div className="text-[12px] text-ink-muted">{station.location}</div>
                      </td>
                      <td className="py-4 px-6 text-ink-secondary font-light">{station.substrate}</td>
                      <td className="py-4 px-6 text-ink-secondary font-mono tabular-nums">{station.salinity}</td>
                      <td className="py-4 px-6 text-ink-secondary font-mono tabular-nums">{station.phValue}</td>
                      <td className="py-4 px-6 text-ink-secondary font-mono tabular-nums">{station.sedimentRate}</td>
                      <td className="py-4 px-6 text-ink-secondary tabular-nums font-light">{station.benthosCount}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-tint text-brand">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                          {station.status} ({station.canopyDensity})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── Editorial Manifesto Section ─── */}
        <section id="manifesto" className="py-28 bg-brand text-paper relative overflow-hidden">
          <div className="absolute right-[-40px] bottom-[-60px] font-serif text-[260px] font-normal text-white/[0.03] select-none pointer-events-none">
            CIREBON
          </div>
          <div className="max-w-[1240px] mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#a3c4b1] font-semibold block mb-4">
                SUARA LAPANGAN KONSORSIUM
              </span>
              <blockquote className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-tight font-normal tracking-tight mb-10 text-[#fbf9f4]">
                "Menjaga akar bakau di pantai utara bukan sekadar menancapkan bibit, tetapi membangun kembali benteng hidup yang menjaga tambak dan masa depan anak cucu pesisir dari hempasan laut."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center font-mono font-semibold text-xs text-paper">
                  PKM
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Dahlan Sutrisno</div>
                  <div className="text-xs text-[#b8d1c3] font-light">
                    Koordinator Lapangan Kelompok Tani Nelayan Kasugengan, Kabupaten Cirebon
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Architectural Swiss Masthead Footer ─── */}
      <footer className="bg-[#eae7dc] border-t border-line-strong py-14 text-[12.5px] text-ink-secondary relative z-10">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-brand text-paper flex items-center justify-center font-serif text-xs">
                  S
                </span>
                <h4 className="font-bold text-[14px] text-ink tracking-tight">SABUK TELUK CIREBON</h4>
              </div>
              <p className="text-ink-muted text-xs max-w-sm font-light leading-relaxed">
                Stasiun Pemantauan Batimetri &amp; Konsorsium Pemulihan Hutan Mangrove Pantai Utara Jawa Barat. Terbuka untuk audit ilmiah dan penelitian kolaboratif.
              </p>
            </div>

            <ul className="flex items-center gap-8 text-[12.5px] font-medium flex-wrap">
              <li><a href="#sabuk" className="hover:text-ink transition-colors">Zonasi Sabuk</a></li>
              <li><a href="#batimetri" className="hover:text-ink transition-colors">Data Batimetri</a></li>
              <li><a href="#stasiun" className="hover:text-ink transition-colors">4 Titik Pantau</a></li>
              <li>
                <a href="mailto:stasiun@sabukcirebon.or.id" className="hover:text-ink transition-colors">
                  Kontak Peneliti
                </a>
              </li>
            </ul>
          </div>

          <div className="border-t border-line pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-ink-muted">
            <span>&copy; 2026 KONSORSIUM SABUK PESISIR CIREBON. OPEN CONSERVATION DATA LICENSE.</span>
            <span>AUDIT TERAKHIR: NOVEMBER 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
