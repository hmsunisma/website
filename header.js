/**
 * ============================================================================
 * HEADER NAVIGASI TERPUSAT – HIMPUNAN MAHASISWA SIPIL (HMS UNISMA)
 * File ini dipanggil oleh setiap halaman HTML melalui:
 * <div id="hms-header-container" data-active="berita.html"></div>
 * <script src="header.js"></script>
 * ============================================================================
 */
(function () {
    // 0. PEMBERSIH URL OTOMATIS DI BILAH ALAMAT BROWSER (index.html -> home, hapus .html)
    (function cleanBrowserURL() {
        try {
            if (!window.location.protocol.startsWith('http')) return;
            const path = window.location.pathname;
            let cleanPath = null;

            if (path === '/' || /\/index(\.html)?$/i.test(path)) {
                cleanPath = path.replace(/\/(index(\.html)?)?$/i, '/home');
            } else if (/\.html$/i.test(path)) {
                cleanPath = path.replace(/\.html$/i, '');
            }

            if (cleanPath && cleanPath !== path) {
                window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
            }
        } catch (e) {
            // Abaikan jika berjalan di dalam iframe sandboxed
        }
    })();

    function initHMSHeader() {
        // Cegah duplikasi jika header sudah terpasang
        if (document.getElementById('main-header')) return;

        const container = document.getElementById('hms-header-container');
        if (!container) return;

        // 1. KONFIGURASI MENU & DAFTAR BERITA (Clean URL tanpa .html)
        const HMS_HEADER = {
            title: 'HMS UNISMA',
            subtitle: 'Teknik Sipil',
            logo: 'https://res.cloudinary.com/t8om9lyk/image/upload/v1794560331/LOGO_HMS_TERBARU_1.png',
            logoFallback: 'https://placehold.co/40x40/1e3a8a/ffffff?text=HMS',
            homeHref: 'home',
            cta: {
                desktop: 'Aspirasi',
                mobile: 'Sampaikan Aspirasi',
                href: 'https://forms.gle/AoemyXn1UVsCV1pHA'
            },
            menus: [
                { label: 'Beranda', mobileLabel: 'Beranda', href: 'home.html' },
                { label: 'Profil', mobileLabel: 'Profil Organisasi', href: 'profil.html' },
                { label: 'Prestasi', mobileLabel: 'Karya & Prestasi', href: 'prestasi.html' },
                {
                    label: 'Berita',
                    mobileLabel: 'Berita Terkini',
                    href: 'berita.html',
                    dropdown: [
                        { title: 'Semua Kabar & Berita', href: 'berita.html', tag: 'Indeks Berita', isAll: true },
                        { title: 'Forum Sipil (FORSIP) 2026 Teknik Sipil UNISMA', href: 'forum sipil 2026.html', tag: '8 Nov 2026' },
                        { title: 'Workshop Road to KJI & KBGI 2027', href: 'workshop road to kji-kbgi 2027.html', tag: '30 Okt 2026' },
                        { title: 'Study Excursion PT Wijaya Karya Beton', href: 'study excursion 2026.html', tag: '29 Sep 2026' },
                        { title: 'CIVAFEST 2026 Universitas Islam Malang', href: 'civafest 2026.html', tag: '11 Agu 2026' },
                        { title: 'CIVEX 2026 Teknik Sipil UNISMA', href: 'civex 2026', tag: '10 Jun 2026' },
                        { title: 'Rapat Kerja Himpunan Mahasiswa Sipil 2026', href: 'rapat kerja 2026', tag: '14 Mar 2026' }
                    ]
                },
                { label: 'Galeri', mobileLabel: 'Galeri Kegiatan', href: 'galeri.html' },
                { label: 'Kontak', mobileLabel: 'Hubungi Kami', href: 'kontak.html' }
            ]
        };

        // 2. INJEKSI STYLE ANIMASI HEADER
        if (!document.getElementById('hms-header-style')) {
            const style = document.createElement('style');
            style.id = 'hms-header-style';
            style.textContent = `
                @keyframes hmsSlideDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes hmsHeaderGlow {
                    0%, 100% { border-bottom-color: rgba(30, 58, 138, 0.25); box-shadow: 0 4px 25px -2px rgba(30, 58, 138, 0.08); }
                    50% { border-bottom-color: rgba(5, 150, 105, 0.45); box-shadow: 0 6px 30px -2px rgba(5, 150, 105, 0.14); }
                }
                .hms-header-anim {
                    animation: hmsSlideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .hms-header-glow {
                    animation: hmsSlideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards, hmsHeaderGlow 4s ease-in-out infinite 0.6s;
                }
            `;
            document.head.appendChild(style);
        }

        // 3. DETEKSI HALAMAN AKTIF DARI ATRIBUT data-active ATAU URL PATH (Mendukung URL dengan/tanpa .html)
        const normalizeSlug = (val) => {
            const cleaned = decodeURIComponent(val || '')
                .split('/').pop()
                .replace(/\.html$/i, '')
                .trim()
                .toLowerCase();
            return (cleaned === '' || cleaned === 'index') ? 'home' : cleaned;
        };

        const rawPath = location.pathname.split('/').pop() || 'home';
        const activePage = normalizeSlug(container.dataset.active || rawPath);
        const isActive = (item) => {
            const hrefSlug = normalizeSlug(item.href);
            if (activePage === hrefSlug) return true;
            if (item.dropdown) {
                if (activePage.includes('berita')) return true;
                if (item.dropdown.some(sub => normalizeSlug(sub.href) === activePage)) return true;
            }
            return false;
        };

        // 4. BANGUN NAVIGASI DESKTOP
        const desktopNav = HMS_HEADER.menus.map(item => {
            const active = isActive(item);
            const pillClass = active
                ? 'px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#1e3a8a] text-white shadow-sm transition-all'
                : 'px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-[#1e3a8a] hover:bg-white/90 transition-all';

            if (!item.dropdown) {
                return `<a href="${item.href}" class="${pillClass}">${item.label}</a>`;
            }

            const subItems = item.dropdown.map(sub => sub.isAll ? `
                <a href="${sub.href}" class="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-50/80 hover:bg-[#1e3a8a] text-[#1e3a8a] hover:text-white text-xs font-extrabold transition-colors mb-1">
                    <span>${sub.title}</span>
                    <span>→</span>
                </a>
            ` : `
                <a href="${sub.href}" class="block px-3.5 py-2 rounded-xl hover:bg-slate-100/90 transition-colors group/sub">
                    <p class="text-xs font-bold text-slate-800 group-hover/sub:text-[#1e3a8a] line-clamp-1">${sub.title}</p>
                    <span class="text-[10px] font-semibold text-slate-400">${sub.tag}</span>
                </a>
            `).join('');

            return `
                <div class="relative group" data-desktop-dropdown>
                    <button type="button" class="${pillClass} inline-flex items-center gap-1 focus:outline-none">
                        <span>${item.label}</span>
                        <svg class="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <div class="dropdown-panel hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-full pt-2.5 w-72 z-50">
                        <div class="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-xl p-2 max-h-80 overflow-y-auto space-y-0.5">
                            ${subItems}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // 5. BANGUN NAVIGASI MOBILE
        const mobileNav = HMS_HEADER.menus.map(item => {
            const active = isActive(item);
            const baseClass = active
                ? 'px-3.5 py-2.5 rounded-xl font-extrabold text-xs bg-blue-50 text-[#1e3a8a] flex items-center justify-between'
                : 'px-3.5 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-between';

            if (!item.dropdown) {
                const indicator = active ? '<span class="w-2 h-2 rounded-full bg-[#1e3a8a]"></span>' : '';
                return `<a href="${item.href}" class="${baseClass}"><span>${item.mobileLabel}</span>${indicator}</a>`;
            }

            const mobileSubItems = item.dropdown.map(sub => sub.isAll ? `
                <a href="${sub.href}" class="block px-3 py-2 rounded-lg text-xs font-extrabold text-[#1e3a8a] bg-blue-50/60">${sub.title}</a>
            ` : `
                <a href="${sub.href}" class="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100">
                    <span class="line-clamp-1">${sub.title}</span>
                    <span class="block text-[10px] text-slate-400 font-normal">${sub.tag}</span>
                </a>
            `).join('');

            return `
                <div>
                    <button type="button" data-mobile-sub-toggle class="w-full ${baseClass}">
                        <span>${item.mobileLabel}</span>
                        <svg class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <div class="hidden mt-1.5 ml-3 pl-3 border-l-2 border-blue-200 space-y-1 max-h-56 overflow-y-auto">
                        ${mobileSubItems}
                    </div>
                </div>
            `;
        }).join('');

        // 6. RENDER HTML HEADER KE DALAM WADAH
        container.innerHTML = `
            <header id="main-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/85 backdrop-blur-xl border-b border-slate-200/60 shadow-sm hms-header-anim hms-header-glow">
                <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <a href="${HMS_HEADER.homeHref}" class="flex items-center gap-2.5 group">
                        <img src="${HMS_HEADER.logo}"
                             onerror="this.src='${HMS_HEADER.logoFallback}'"
                             alt="Logo HMS UNISMA"
                             class="w-8 h-8 md:w-9 md:h-9 object-contain drop-shadow-md group-hover:scale-110 transition-transform">
                        <div class="flex flex-col">
                            <span class="text-xs md:text-base font-extrabold text-[#0f172a] tracking-tight leading-none group-hover:text-[#1e3a8a] transition-colors">${HMS_HEADER.title}</span>
                            <span class="text-[8px] md:text-[9px] font-bold text-[#059669] uppercase tracking-widest mt-0.5">${HMS_HEADER.subtitle}</span>
                        </div>
                    </a>

                    <nav class="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80 shadow-inner">
                        ${desktopNav}
                    </nav>

                    <div class="flex items-center gap-2.5">
                        <a href="${HMS_HEADER.cta.href}" target="_blank" rel="noopener noreferrer"
                           class="hidden sm:inline-flex px-3.5 py-1.5 bg-gradient-to-r from-[#1e3a8a] to-blue-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-blue-500/30 transition-all">
                            ${HMS_HEADER.cta.desktop}
                        </a>
                        <button id="mobile-menu-btn" type="button" aria-label="Buka Menu" class="md:hidden w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors focus:outline-none">
                            <svg id="menu-icon-open" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                            <svg id="menu-icon-close" class="w-5 h-5 hidden" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div id="mobile-menu" class="hidden md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-2xl px-5 py-5 max-h-[82vh] overflow-y-auto transition-all duration-300">
                    <nav class="flex flex-col space-y-2">
                        ${mobileNav}
                        <div class="pt-1">
                            <a href="${HMS_HEADER.cta.href}" target="_blank" rel="noopener noreferrer"
                               class="w-full py-2.5 bg-gradient-to-r from-[#1e3a8a] to-blue-700 text-white font-bold text-xs rounded-xl shadow-md text-center block">
                                ${HMS_HEADER.cta.mobile}
                            </a>
                        </div>
                    </nav>
                </div>
            </header>
        `;

        // 7. AKTIFKAN INTERAKSI MENU MOBILE, DROPDOWN DESKTOP & EFEK SCROLL
        const mainHeader = document.getElementById('main-header');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIconOpen = document.getElementById('menu-icon-open');
        const menuIconClose = document.getElementById('menu-icon-close');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isHidden = mobileMenu.classList.toggle('hidden');
                menuIconOpen.classList.toggle('hidden', !isHidden);
                menuIconClose.classList.toggle('hidden', isHidden);
            });
        }

        mainHeader.querySelectorAll('[data-mobile-sub-toggle]').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.nextElementSibling.classList.toggle('hidden');
                btn.querySelector('svg').classList.toggle('rotate-180');
            });
        });

        mainHeader.querySelectorAll('[data-desktop-dropdown]').forEach(wrap => {
            const btn = wrap.querySelector('button');
            const panel = wrap.querySelector('.dropdown-panel');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                panel.classList.toggle('!block');
            });
            document.addEventListener('click', () => panel.classList.remove('!block'));
        });

        window.addEventListener('scroll', () => {
            mainHeader.classList.toggle('shadow-md', window.scrollY > 20);
            mainHeader.classList.toggle('bg-white/95', window.scrollY > 20);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHMSHeader);
    } else {
        initHMSHeader();
    }
})();