import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number; // 1 -> 0
  color: string;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
  year?: string;
  githubUrl?: string;
  liveUrl?: string;
  /** Kartın kendisini dolduran tek görsel. Boş bırakırsan placeholder görünür. */
  image?: string;
  /**
   * Görselin doğal oranına göre kart kutusunun şekli. Yatay ekran görüntüleri
   * için 'landscape', dikey/poster görseller için 'portrait' ya da 'tall' seç —
   * kutuyu görselin gerçek oranına yaklaştırır, object-cover'ın önemli kısımları
   * kırpmasını engeller. Varsayılan: 'portrait'.
   */
  aspect?: 'landscape' | 'portrait' | 'tall';
}

interface Vec2 {
  x: number;
  y: number;
}

const ASPECT_CLASS: Record<NonNullable<Project['aspect']>, string> = {
  landscape: 'aspect-video', // ~16/9 — ekran görüntüsü / masaüstü site tanıtımları
  portrait: 'aspect-[2/3]', // ~0.67 — poster tarzı dikey görseller
  tall: 'aspect-[4/5]', // hafif dikey, kitap/karakter görselleri
};

/* ================================================================== */
/*  Content — gerçek verilerin. Buraya proje eklemen yeterli, sağdaki  */
/*  serbest yüzen kart alanı otomatik olarak yeni kartı üretir.        */
/* ================================================================== */

const PERSONAL = {
  role: 'Junior Software Developer',
  tagline: 'Modern arayüzler · Güvenli mimari · Sürdürülebilir kod',
  email: 'ozgegumus1@icloud.com',
  location: 'Mersin, Türkiye',
  bio: `Siyaset Bilimi ve İşletme Yönetimi mezunuyum. Geliştirme sürecinde ön yüzde dinamik yapılara ve tip güvenliğine, arka planda ise veri tabanı yönetimi ile otomasyonlara odaklanıyorum. Projeleri, kullanıcı deneyiminden veri akışına kadar tüm teknik gereksinimleriyle bir bütün olarak ele alıyorum. Projelerimde dinamik veri yönetimi için API entegrasyonlarını ve Supabase'i aktif kullanıyor; arka plan süreçlerinde Python'dan yararlanıyorum. İş akışımda yapay zeka araçlarıyla geliştirme sürecini ve kod kalitesini optimize ediyorum. Ethical Hacker (siber güvenlik) eğitimim devam ediyor; Linux ve sanal makine (VirtualBox) ortamlarında rahatım. Sıfırdan tam fonksiyonel web uygulamaları geliştirebilecek teknik bağımsızlığa sahibim; temiz ve sürdürülebilir koda odaklanıyorum.`,
};

/**
 * CV dosyasının yolu. Projenin `public/cv/` klasörüne AYNI İSİMLE bir PDF
 * koyduğun sürece burada hiçbir kod değişikliği gerekmez — CV'ni
 * güncellemek istediğinde sadece bu dosyayı yenisiyle değiştir.
 */
const CV_FILE_PATH = '/cv/Ozge-Gumus-CV.pdf';

const TECH_STACK = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Sanal Makineler',
  'Node.js',
  'Nest.js',
  'MySQL',
  'Python',
  'Supabase',
  'Vercel',
  'PostgreSQL',
  'Git & GitHub',
  'Linux',
];

const PROJECTS: Project[] = [
  {
    title: 'Intra — Kurumsal İç İletişim & Mesai Sistemi',
    description: `Büyük işletmelerin iç iletişim ve mesai ihtiyaçlarını çözen, hazır framework kullanmadan sıfırdan geliştirdiğim full stack SaaS ürünüm Intra'yı tamamladım. Performans için HTTP isteklerini PHP (REST API) ile yönetirken, anlık mesajlaşmayı sıfır gecikmeli Node.js ve WebSocket sunucusuyla kurguladım. Bir personel sistemde pasife alındığında, açık olan WebSocket bağlantısını milisaniyeler içinde sunucudan kesen dinamik bir altyapı. Admin girişleri zamanlama saldırılarına karşı hash_equals ile doğrulanır. Kimlik taklidini engelleyen, personele özel benzersiz giriş kodları ve admin panelinden mesai kayıtlarını Excel'e aktarma seçeneği. Arayüz ve mesai manipülasyonlarını engellemek için cihaz saatini yok sayarak tüm giriş/çıkış kayıtlarını tamamen sunucu saatine endeksledim, yetkilendirmeleri de sunucu tarafında çift katmanlı doğrulattım. Geçmiş kayıtların İK raporları için korunması ve bir mobil uygulama gibi çalışan tam ekran PWA deneyimi sundum.`,
    year: '2026',
    tags: ['PHP', 'Node.js', 'WebSocket (ws)', 'MySQL', 'REST API', 'JavaScript', 'PWA'],
    image: '/projects/Intra.jpg',
    aspect: 'landscape',
  },
  {
    title: 'GasOil — Kurumsal Web Sitesi',
    description:
      'Endüstriyel üretim yapan uluslararası bir B2B firması için geliştirilmiş modern web arayüzü. Ürün kataloglarının hızlı ve her cihaza tam uyumlu şekilde sergilenmesi hedeflenerek, markanın kurumsal kimliğine uygun temiz bir kod yapısı oluşturulmuştur.',
    year: '2025',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    liveUrl: 'https://gasoil.com.tr',
    image: '/projects/gasoil.jpg',
    aspect: 'landscape',
  },
  {
    title: 'B2B Ağtaşlar Group — Kurumsal Çözüm Sitesi',
    description:
      'Güvenlik sistemleri ve teknolojik altyapı çözümleri sunan bir B2B firması için geliştirilmiş modern kurumsal web sitesi. Müşteri güvenini yansıtan profesyonel tasarımıyla firmanın hizmetleri ve iletişim kanalları net biçimde hedeflendi.',
    year: '2025',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    liveUrl: 'https://b2bagtaslargroup.com',
    image: '/projects/B2B_AGTASLAR.jpg',
    aspect: 'portrait',
  },
  {
    title: 'Flock — Sosyal Medya Platformu',
    description: `React, TypeScript ve Supabase altyapısıyla geliştirdiğim, Context API ile durum yönetimiyle gerçek zamanlı veri akışına ve medya yönetimine odaklanan sosyal medya uygulaması: Flock. Projede; kayıpsız medya paylaşımı, dinamik etkileşim filtreleri (hikaye ve yorum, mesajlaşma, keşfet mekanizmaları) ile Supabase Auth üzerinden güvenli oturum yönetimi süreçlerini PWA da ekleyerek kurguladım.`,
    year: '2025',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'React Router', 'Vite', 'Resend', 'Vercel'],
    githubUrl: 'https://github.com/ozgegumus1',
    liveUrl: 'https://flocksocial.vercel.app',
    image: '/projects/Flock.jpg',
    aspect: 'portrait',
  },
  {
    title: 'Vesta PMS — Otel Yönetim Paneli',
    description:
      'Vesta, otelcilik sektöründeki operasyonel süreçleri ve yasal yükümlülükleri frontend mimarisi üzerinde simüle eden modern bir Otel Yönetim Paneli (PMS) çalışmasıdır. Kullanıcıların oda durumlarını dinamik olarak izleyebildiği canlı bir resepsiyon matrisi ve hızlı check-in/check-out akışları barındırır. Projenin odak noktası, resepsiyona girişi yapılan misafirlerin verilerini işleyerek asenkron süreçlerle resmi onay kodları üreten sanal bir KBS modülünü merkezi bir state yönetimiyle senkronize çalıştırmasıdır. Tasarım tarafında göz yormayan, siber-koyu tonlarda ve glassmorphism efektlerine sahip modern bir kullanıcı arayüzü sunar.',
    year: '2026',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    githubUrl: 'https://github.com/ozgegumus1/vesta-pms',
    liveUrl: 'https://vesta-pms.vercel.app',
    image: '/projects/VestaPMS.jpg',
    aspect: 'landscape',
  },
  {
    title: 'LineSpine — Ürün & Hizmet Tanıtım Sitesi',
    description:
      'Kullanıcı deneyimini merkeze alan, modern ve dinamik bir web projesi. Markanın dijital kimliğini ve vizyonunu öne çıkarmak amacıyla hızlı yüklenen, sade ve tamamen mobil uyumlu bir arayüz mimarisiyle geliştirilmiştir.',
    year: '2025',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    liveUrl: 'https://linespine.com',
    image: '/projects/Linespine.jpg',
    aspect: 'portrait',
  },
  {
    title: 'Inkwell — Etkileşimli Kitap Sitesi',
    description:
      'Scroll ile ilerledikçe sayfa 3 boyutlu nesnelerle birlikte derinlik kazanan, kitap/yayınevi temalı bir web deneyimi. Sayfa kaydırma hareketi, sahnedeki objelerin dönüşünü ve konumunu kontrol ediyor; statik bir tanıtım sayfası yerine keşfedilen bir hikâye anlatımı kurgulandı.',
    year: '2026',
    tags: [],
    liveUrl: 'https://bookieweb.vercel.app/',
    image: '/projects/Inkwell.jpg',
    aspect: 'tall',
  },
  {
    title: 'NOIR Detailing — Oto Kaplama & Detaylandırma Stüdyosu',
    description:
      'Araç sahiplerine PPF (boya koruma filmi), seramik kaplama ve profesyonel detaylandırma hizmetleri sunan bir oto bakım stüdyosu için tasarladığım karanlık ve zarif bir marka sitesi. Hizmetleri net bir akışla anlatırken, markanın premium ve sinematik kimliğini yansıtan görseller ve sade bir tipografiyle ziyaretçide güven uyandıran bir izlenim hedefledim.',
    year: '2026',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
    githubUrl: 'https://github.com/ozgegumus1/NOIRDETAILING.git',
    liveUrl: 'https://noirgarage.vercel.app/',
    image: '/projects/NOIR.jpg',
    aspect: 'tall',
  },
];

// Warm brown / mocha / taba sparkle palette
const SPARKLE_COLORS = ['#8B5A2B', '#9A5B32', '#78350F', '#A9744F', '#6B4423'];

// Asimetrik "havada asılı" hissi için kart başına sabit dikey ofset ve dinlenme açısı.
// Sadece masaüstünde uygulanır — mobilde tek sütuna düşünce dev boşluklar yaratmasın diye kapatılır.
const HANG_OFFSETS = [0, 56, -28, 76, -40, 20, 60, -18, 40, -50];
const REST_ROTATIONS = [-3, 2.5, -1.5, 3, -2, 1.5, -2.5, 2, -1, 3.5];

/* ================================================================== */
/*  Ekran genişliğini takip eden küçük hook — masaüstü/mobil ayrımı    */
/*  için (asimetrik asılma efekti sadece masaüstünde uygulanır).       */
/* ================================================================== */

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isDesktop;
}

/* ================================================================== */
/*  Click Sparkle / Particle Canvas                                    */
/* ================================================================== */

const ClickSparkleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = (x: number, y: number) => {
      const count = 14;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = 1.5 + Math.random() * 3.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 1.5 + Math.random() * 2.5,
          life: 1,
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
        });
      }
    };

    const handleClick = (e: MouseEvent) => spawn(e.clientX, e.clientY);
    window.addEventListener('click', handleClick);

    const DECAY = 0.018; // ~1s lifespan at 60fps

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const alive: Particle[] = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= DECAY;
        if (p.life > 0) {
          ctx.beginPath();
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
          alive.push(p);
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      particlesRef.current = alive;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="true"
    />
  );
};

/* ================================================================== */
/*  Dark / Light Theme Switcher                                        */
/* ================================================================== */

const ThemeSwitcher: React.FC<{ isDarkMode: boolean; onToggle: () => void }> = ({
  isDarkMode,
  onToggle,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={isDarkMode}
    aria-label="Aydınlık / karanlık temayı değiştir"
    onClick={onToggle}
    className={`relative flex h-9 w-[76px] shrink-0 items-center rounded-full border backdrop-blur-md transition-all duration-500 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5A2B]/60 ${
      isDarkMode
        ? 'border-[#78350F]/50 bg-gradient-to-r from-[#78350F]/25 via-[#5A2A0C]/15 to-transparent shadow-[0_0_18px_2px_rgba(120,53,15,0.4)]'
        : 'border-[#9A5B32]/40 bg-gradient-to-r from-[#C9A27E]/40 via-[#E8D5BD]/30 to-transparent shadow-[0_0_18px_2px_rgba(154,91,50,0.35)]'
    }`}
  >
    <span
      className={`absolute top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br text-[11px] leading-none backdrop-blur-md transition-all duration-500 ease-out ${
        isDarkMode
          ? 'left-1 from-[#8B5A2B] to-[#78350F] shadow-[0_0_12px_3px_rgba(120,53,15,0.6)]'
          : 'left-[42px] from-[#E8D5BD] to-[#C9A27E] shadow-[0_0_12px_3px_rgba(154,91,50,0.5)]'
      }`}
    >
      {isDarkMode ? '🌙' : '☀️'}
    </span>
  </button>
);

/* ================================================================== */
/*  Navbar — logo left, theme switcher right, nothing else              */
/* ================================================================== */

const Navbar: React.FC<{ isDarkMode: boolean; onToggleTheme: () => void }> = ({
  isDarkMode,
  onToggleTheme,
}) => (
  <nav
    className={`fixed top-0 left-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-500 ${
      isDarkMode ? 'border-white/5 bg-zinc-950/40' : 'border-zinc-200 bg-white/50'
    }`}
  >
    <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6 lg:px-10">
      <a
        href="#hero"
        className={`text-lg font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}
      >
        Özge<span className="text-[#9A5B32]">.</span>
      </a>
      <ThemeSwitcher isDarkMode={isDarkMode} onToggle={onToggleTheme} />
    </div>
  </nav>
);

/* ================================================================== */
/*  Small building blocks                                              */
/* ================================================================== */

const GlassBadge: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <span
    className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur-md transition-colors duration-500 ${
      isDarkMode
        ? 'border-[#8B5A2B]/40 bg-white/5 text-[#C9A27E] shadow-[0_0_20px_-4px_rgba(120,53,15,0.5)]'
        : 'border-[#9A5B32]/40 bg-white/70 text-[#78350F] shadow-[0_0_20px_-4px_rgba(120,53,15,0.25)]'
    }`}
  >
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9A5B32] opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9A5B32]" />
    </span>
    {PERSONAL.role}
  </span>
);

const TechTag: React.FC<{ label: string; isDarkMode: boolean }> = ({ label, isDarkMode }) => (
  <span
    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors duration-300 ${
      isDarkMode
        ? 'border-white/10 bg-white/5 text-zinc-300 hover:border-[#8B5A2B]/50 hover:text-white'
        : 'border-zinc-200 bg-white/70 text-zinc-600 hover:border-[#9A5B32]/50 hover:text-zinc-900'
    }`}
  >
    {label}
  </span>
);

/** Görsel alanı — hem tam kaplayan proje kartında hem modal önizlemesinde kullanılır. */
const ImagePlaceholder: React.FC<{
  image?: string;
  alt: string;
  isDarkMode: boolean;
  className?: string;
  rounded?: boolean;
  eager?: boolean;
}> = ({ image, alt, isDarkMode, className = '', rounded = true, eager = false }) => (
  <div
    className={`flex items-center justify-center overflow-hidden border border-dashed ${
      rounded ? 'rounded-xl' : ''
    } ${isDarkMode ? 'border-[#8B5A2B]/25 bg-white/[0.03]' : 'border-[#9A5B32]/35 bg-[#F3E9DD]/60'} ${className}`}
  >
    {image ? (
      <img
        src={image}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="flex flex-col items-center gap-2 px-3 text-center">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          className={isDarkMode ? 'text-[#C9A27E]/50' : 'text-[#9A5B32]/60'}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={`text-[10px] font-medium ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
          Görsel yakında
        </span>
      </div>
    )}
  </div>
);

/* ================================================================== */
/*  Free-floating, sharp-edged, leaf-sway project card (image only)    */
/*  Performans notu: tilt + salınım React state'i DEĞİL, doğrudan DOM  */
/*  üzerinde (ref ile) güncelleniyor — her mousemove'da yeniden render */
/*  tetiklenmiyor, bu yüzden hem masaüstünde anında tepki veriyor hem  */
/*  de mobilde gereksiz yeniden çizim maliyeti oluşturmuyor.           */
/* ================================================================== */

const FloatingProjectCard: React.FC<{
  project: Project;
  index: number;
  parallax: Vec2;
  isDarkMode: boolean;
  onOpen: (project: Project) => void;
  compactHang: boolean;
}> = ({ project, index, parallax, isDarkMode, onOpen, compactHang }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [hovering, setHovering] = useState(false);

  const tiltRef = useRef<Vec2>({ x: 0, y: 0 });
  const swayRef = useRef(0);
  const swayRafRef = useRef<number>(0);
  const scaleRef = useRef(1);

  const depth = (index % 3) + 1;
  const hangOffset = compactHang ? 0 : HANG_OFFSETS[index % HANG_OFFSETS.length];
  const restRotation = compactHang ? 0 : REST_ROTATIONS[index % REST_ROTATIONS.length];

  const applyTransform = () => {
    const card = cardRef.current;
    if (!card) return;
    const parallaxX = parallax.x * 10 * depth;
    const parallaxY = parallax.y * 10 * depth;
    card.style.transform = `perspective(1000px) translate3d(${parallaxX}px, ${parallaxY}px, 0) rotateX(${tiltRef.current.x}deg) rotateY(${tiltRef.current.y}deg) rotateZ(${restRotation + swayRef.current}deg) scale(${scaleRef.current})`;
  };

  // Panel geneli parallax (üst bileşenden gelen prop) her değiştiğinde transformu tazele.
  useEffect(() => {
    applyTransform();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parallax.x, parallax.y, compactHang]);

  useEffect(() => {
    applyTransform();
    return () => cancelAnimationFrame(swayRafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSway = () => {
    const start = performance.now();
    const loop = (t: number) => {
      swayRef.current = Math.sin((t - start) / 260) * 6;
      applyTransform();
      swayRafRef.current = requestAnimationFrame(loop);
    };
    swayRafRef.current = requestAnimationFrame(loop);
  };

  const stopSway = () => {
    cancelAnimationFrame(swayRafRef.current);
    swayRef.current = 0;
  };

  const updateTiltFromPoint = (clientX: number, clientY: number) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (clientX - rect.left) / rect.width - 0.5;
    const py = (clientY - rect.top) / rect.height - 0.5;
    tiltRef.current = { x: py * -22, y: px * 22 };
    applyTransform();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) =>
    updateTiltFromPoint(e.clientX, e.clientY);

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch) updateTiltFromPoint(touch.clientX, touch.clientY);
  };

  const handleEnter = () => {
    setHovering(true);
    scaleRef.current = 1.06;
    if (cardRef.current) cardRef.current.style.transition = 'transform 90ms linear';
    startSway();
    applyTransform();
  };

  const handleLeave = () => {
    setHovering(false);
    tiltRef.current = { x: 0, y: 0 };
    scaleRef.current = 1;
    stopSway();
    if (cardRef.current) cardRef.current.style.transition = 'transform 0.6s ease-out';
    applyTransform();
  };

  const aspectClass = ASPECT_CLASS[project.aspect ?? 'portrait'];

  return (
    <div
      className="relative w-40 shrink-0 xs:w-44 sm:w-56"
      style={{ perspective: '1000px', marginTop: hangOffset }}
    >
      {/* soft mocha ambient glow sitting behind the card — no shape, just light */}
      <div
        ref={glowRef}
        className={`pointer-events-none absolute -inset-6 rounded-full blur-3xl transition-opacity duration-500 ${
          isDarkMode ? 'bg-[#78350F]/25' : 'bg-[#9A5B32]/20'
        } ${hovering ? 'opacity-100' : 'opacity-50'}`}
      />

      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label={project.title}
        onClick={() => onOpen(project)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(project)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onTouchStart={handleEnter}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleLeave}
        style={{ animation: `floatY 6s ease-in-out ${index * 0.45}s infinite` }}
        className={`relative z-10 ${aspectClass} w-full cursor-pointer overflow-hidden will-change-transform`}
      >
        <ImagePlaceholder
          image={project.image}
          alt={project.title}
          isDarkMode={isDarkMode}
          rounded={false}
          eager={index < 2}
          className={`h-full w-full ${
            isDarkMode ? 'shadow-[0_25px_60px_-20px_rgba(0,0,0,0.7)]' : 'shadow-[0_25px_60px_-20px_rgba(120,53,15,0.3)]'
          }`}
        />
      </div>
    </div>
  );
};

/* ================================================================== */
/*  Project detail modal                                               */
/* ================================================================== */

const ProjectModal: React.FC<{
  project: Project | null;
  onClose: () => void;
  isDarkMode: boolean;
}> = ({ project, onClose, isDarkMode }) => {
  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  const linkClass = isDarkMode
    ? 'text-[#C9A27E] hover:text-white'
    : 'text-[#78350F] hover:text-zinc-900';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        style={{ animation: 'scaleIn 0.25s cubic-bezier(0.22,1,0.36,1)' }}
        className={`no-scrollbar relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl p-7 shadow-2xl sm:p-8 ${
          isDarkMode ? 'bg-zinc-900/95 text-white' : 'bg-white text-zinc-900'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Kapat"
          className={`absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
            isDarkMode
              ? 'bg-white/10 text-zinc-200 hover:bg-white/20 hover:text-white'
              : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900'
          }`}
        >
          ✕
        </button>

        {project.year && (
          <span className="mb-2 mt-8 block text-xs font-medium uppercase tracking-[0.2em] text-[#9A5B32]">
            {project.year}
          </span>
        )}
        <h3 id="project-modal-title" className="mb-3 text-2xl font-bold tracking-tight">
          {project.title}
        </h3>
        <p className={`mb-6 text-sm leading-relaxed sm:text-base ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
          {project.description}
        </p>

        {project.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isDarkMode ? 'bg-white/5 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {(project.githubUrl || project.liveUrl) && (
          <div className="flex flex-wrap gap-6 text-sm font-semibold">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={`underline-offset-4 transition-colors duration-200 hover:underline ${linkClass}`}
              >
                GitHub →
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className={`underline-offset-4 transition-colors duration-200 hover:underline ${linkClass}`}
              >
                Canlı Site →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================================================================== */
/*  Right side — free-floating card field, no wrapping panel            */
/* ================================================================== */

const FloatingProjectField: React.FC<{
  isDarkMode: boolean;
  onOpenProject: (project: Project) => void;
}> = ({ isDarkMode, onOpenProject }) => {
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const [parallax, setParallax] = useState<Vec2>({ x: 0, y: 0 });
  const isDesktop = useIsDesktop();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const field = fieldRef.current;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: px, y: py });
  };

  const handleMouseLeave = () => setParallax({ x: 0, y: 0 });

  return (
    <div
      ref={fieldRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1500px' }}
      className="relative flex min-h-[60vh] w-full flex-wrap items-center justify-center gap-6 px-6 py-12 sm:gap-8 sm:py-16 lg:h-full lg:min-h-0 lg:gap-10 lg:py-20"
    >
      {PROJECTS.map((project, index) => (
        <FloatingProjectCard
          key={project.title}
          project={project}
          index={index}
          parallax={parallax}
          isDarkMode={isDarkMode}
          onOpen={onOpenProject}
          compactHang={!isDesktop}
        />
      ))}
    </div>
  );
};

/* ================================================================== */
/*  MOBİL-ÖZEL: masaüstündeki gibi sade kapak görselli kartlar,        */
/*  yan yana/dağınık dizilim, scroll'da aşağıdan beliren animasyon.    */
/*  Masaüstü tarafına hiç dokunmuyor — sadece lg breakpoint altında    */
/*  ProjectShowcase tarafından devreye alınıyor.                       */
/* ================================================================== */

const MobileProjectCard: React.FC<{
  project: Project;
  index: number;
  isDarkMode: boolean;
  onOpen: (project: Project) => void;
}> = ({ project, index, isDarkMode, onOpen }) => {
  // Aynı "dağınık" ofset/açı dizilerini masaüstüyle paylaşıyoruz ama daha ölçülü —
  // temiz bir grid değil, hafif rastgele duran bir düzen hedefleniyor.
  const hangOffset = HANG_OFFSETS[index % HANG_OFFSETS.length] * 0.4;
  const restRotation = REST_ROTATIONS[index % REST_ROTATIONS.length];
  const aspectClass = ASPECT_CLASS[project.aspect ?? 'portrait'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 56, scale: 0.92, rotate: restRotation - 5 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotate: restRotation }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      aria-label={project.title}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(project)}
      style={{ marginTop: hangOffset }}
      className="relative w-full cursor-pointer select-none"
    >
      {/* soft ambient glow behind the card — aynı taba/mocha palet */}
      <div
        className={`pointer-events-none absolute -inset-4 rounded-full blur-2xl ${
          isDarkMode ? 'bg-[#78350F]/20' : 'bg-[#9A5B32]/15'
        }`}
      />

      <div
        className={`relative z-10 ${aspectClass} w-full overflow-hidden ${
          isDarkMode ? 'shadow-[0_15px_40px_-15px_rgba(0,0,0,0.6)]' : 'shadow-[0_15px_40px_-15px_rgba(120,53,15,0.3)]'
        }`}
      >
        <ImagePlaceholder
          image={project.image}
          alt={project.title}
          isDarkMode={isDarkMode}
          rounded={false}
          eager={index < 2}
          className="h-full w-full"
        />
      </div>
    </motion.div>
  );
};

const MobileProjectShowcase: React.FC<{
  isDarkMode: boolean;
  onOpenProject: (project: Project) => void;
}> = ({ isDarkMode, onOpenProject }) => (
  <div className="relative grid w-full grid-cols-2 gap-x-5 gap-y-16 px-6 py-16">
    {PROJECTS.map((project, index) => (
      <MobileProjectCard
        key={project.title}
        project={project}
        index={index}
        isDarkMode={isDarkMode}
        onOpen={onOpenProject}
      />
    ))}
  </div>
);

/**
 * Ekran genişliğine göre doğru gösterimi seçer:
 * - Masaüstü (lg ve üstü): mevcut FloatingProjectField — TAMAMEN AYNI, dokunulmadı.
 * - Mobil: yeni telefon-mockup'lı, Framer Motion ile scroll'da beliren gösterim.
 */
const ProjectShowcase: React.FC<{
  isDarkMode: boolean;
  onOpenProject: (project: Project) => void;
}> = ({ isDarkMode, onOpenProject }) => {
  const isDesktop = useIsDesktop();
  return isDesktop ? (
    <FloatingProjectField isDarkMode={isDarkMode} onOpenProject={onOpenProject} />
  ) : (
    <MobileProjectShowcase isDarkMode={isDarkMode} onOpenProject={onOpenProject} />
  );
};

/* ================================================================== */
/*  Page                                                                */
/* ================================================================== */

const PortfolioPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div
      className={`relative antialiased selection:bg-[#8B5A2B]/30 transition-colors duration-500 ${
        isDarkMode ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'
      }`}
    >
      {/* keyframes + hidden-scrollbar utility */}
      <style>{`
        @keyframes floatY {
          0%, 100% { margin-top: 0px; }
          50% { margin-top: -14px; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <ClickSparkleCanvas />
      <Navbar isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode((v) => !v)} />
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        isDarkMode={isDarkMode}
      />

      {/* ---------------------------------------------------------- */}
      {/* Hero — one seamless bg-zinc-950 surface, no split, no box    */}
      {/* ---------------------------------------------------------- */}
      <section id="hero" className="relative grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
        {/* single cinematic ambient glow spanning the whole hero — stitches both sides together */}
        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[55rem] w-[55rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px] transition-colors duration-500 ${
            isDarkMode ? 'bg-[#78350F]/10' : 'bg-[#9A5B32]/10'
          }`}
        />
        <div
          className={`pointer-events-none absolute right-0 top-1/4 h-[30rem] w-[30rem] rounded-full blur-[140px] transition-colors duration-500 ${
            isDarkMode ? 'bg-[#8B5A2B]/10' : 'bg-[#C9A27E]/20'
          }`}
        />

        {/* ---------- Left : bio ---------- */}
        <div className="relative z-10 flex h-full flex-col justify-center gap-5 px-6 pb-16 pt-28 sm:px-10 lg:px-16 lg:pb-16 lg:pt-24 xl:px-24">
          <GlassBadge isDarkMode={isDarkMode} />

          <h1 className="relative text-5xl font-bold leading-[1.05] tracking-tight text-[#9A5B32] sm:text-6xl xl:text-7xl">
            Özge Gümüş
          </h1>

          <p className={`relative max-w-md text-sm font-light tracking-wide ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {PERSONAL.tagline}
          </p>

          <div className="relative max-w-md space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9A5B32]">
              Hakkımda
            </span>
            <p className={`text-sm leading-relaxed sm:text-base ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {PERSONAL.bio}
            </p>
            <span className={`block text-[11px] uppercase tracking-[0.2em] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
              {PERSONAL.location}
            </span>
          </div>

          <div className="relative flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${PERSONAL.email}`}
              className="rounded-full bg-gradient-to-r from-[#8B5A2B] to-[#78350F] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_25px_-5px_rgba(120,53,15,0.8)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_-2px_rgba(120,53,15,1)]"
            >
              İletişime Geç
            </a>
            <a
              href={CV_FILE_PATH}
              download
              className={`rounded-full border px-6 py-3 text-sm font-semibold backdrop-blur-md transition-all duration-300 ${
                isDarkMode
                  ? 'border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10'
                  : 'border-zinc-300 bg-white/70 text-zinc-900 hover:border-zinc-400 hover:bg-white'
              }`}
            >
              CV İndir
            </a>
          </div>

          <div className="relative max-w-md space-y-3 pt-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9A5B32]">
              Stack
            </span>
            <div className="flex flex-wrap gap-2.5">
              {TECH_STACK.map((t) => (
                <TechTag key={t} label={t} isDarkMode={isDarkMode} />
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Right : free-floating, asymmetric, leaf-sway project cards ---------- */}
        <ProjectShowcase isDarkMode={isDarkMode} onOpenProject={setSelectedProject} />
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Footer — copyright only                                      */}
      {/* ---------------------------------------------------------- */}
      <footer className="relative px-6 py-8 text-center">
        <p className={`text-xs ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`}>
          © 2025 Özge Gümüş. Tüm hakları saklıdır.
        </p>
      </footer>
    </div>
  );
};

export default PortfolioPage;