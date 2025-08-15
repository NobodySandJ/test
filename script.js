document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // LOGIKA UNTUK HALAMAN index.html (HALAMAN SELAMAT DATANG)
    // ===================================================================
    if (document.getElementById('welcome-screen')) {
        const yearSlider = document.getElementById('birthyear-slider');
        const yearDisplay = document.getElementById('year-display');
        const themeOptions = document.getElementById('theme-options');
        const giftBox = document.getElementById('lottie-gift-container');
        const root = document.documentElement;

        const updateThemeColor = (color) => {
            root.style.setProperty('--accent-color', color);
            const glowColor = color + '40'; // Menambahkan transparansi untuk efek glow
            root.style.setProperty('--glow-color', glowColor);
        };

        // Event listener untuk slider tahun
        yearSlider.addEventListener('input', (e) => {
            yearDisplay.textContent = e.target.value;
        });

        // Event listener untuk pilihan tema warna
        themeOptions.addEventListener('click', (e) => {
            if (e.target.classList.contains('theme-option')) {
                themeOptions.querySelector('.selected')?.classList.remove('selected');
                e.target.classList.add('selected');
                const newColor = e.target.dataset.color;
                updateThemeColor(newColor);
            }
        });

        // Event listener untuk tombol kado
        giftBox.addEventListener('click', () => {
            const selectedYear = yearSlider.value;
            const selectedColor = themeOptions.querySelector('.selected').dataset.color;
            const encodedColor = encodeURIComponent(selectedColor);

            // Mengarahkan ke halaman ucapan dengan parameter
            window.location.href = `ucapan.html?year=${selectedYear}&color=${encodedColor}`;
        });

        // Atur warna tema awal saat halaman dimuat
        const initialColor = themeOptions.querySelector('.selected').dataset.color;
        updateThemeColor(initialColor);
    }

    // ===================================================================
    // LOGIKA UNTUK HALAMAN ucapan.html (HALAMAN UCAPAN)
    // ===================================================================
    if (document.getElementById('main-content') && !document.getElementById('welcome-screen')) {

        const appState = {
            content: {},
            currentTrackIndex: 0
        };

        // Cache semua elemen DOM untuk akses lebih cepat
        const elements = {
            root: document.documentElement,
            backgroundAnimation: document.getElementById('background-animation'),
            progressBar: document.getElementById('progress-bar'),
            greetingLine1: document.getElementById('greeting-line-1'),
            greetingLine2: document.getElementById('greeting-line-2'),
            personalMessage: document.getElementById('personal-message'),
            personalSignature: document.getElementById('personal-signature'),
            timelineContainer: document.getElementById('timeline-container'),
            photoGallery: document.getElementById('photo-gallery'),
            videoList: document.getElementById('video-list'),
            lightbox: document.getElementById('lightbox'),
            lightboxImg: document.getElementById('lightbox-img'),
            lightboxClose: document.querySelector('.lightbox-close'),
            audioElement: document.getElementById('audio-element'),
            playerArtwork: document.getElementById('player-artwork'),
            playerTitle: document.getElementById('player-title'),
            playerArtist: document.getElementById('player-artist'),
            playPauseBtn: document.getElementById('play-pause-btn'),
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn')
        };

        const utils = {
            // Fungsi typewriter effect
            async typewriter(element, text, delay = 80) {
                element.innerHTML = '';
                element.classList.add('typing');
                for (let i = 0; i < text.length; i++) {
                    element.innerHTML = text.substring(0, i + 1) + '<span class="cursor">|</span>';
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                setTimeout(() => {
                    element.innerHTML = text;
                    element.classList.remove('typing');
                }, 500);
            },

            // Fungsi untuk memicu confetti dengan jumlah adaptif
            triggerConfetti() {
                // OPTIMASI: Kurangi jumlah confetti di layar kecil
                const confettiCount = window.innerWidth < 768 ? 75 : 150;
                const colors = ['#ff6b9d', '#4ecdc4', '#feca57', '#ff9ff3', '#54a0ff'];
                for (let i = 0; i < confettiCount; i++) {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = `${Math.random() * 100}vw`;
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDelay = `${Math.random() * 2}s`;
                    confetti.style.animationDuration = `${Math.random() * 3 + 4}s`;
                    document.body.appendChild(confetti);
                    setTimeout(() => confetti?.remove(), 8000);
                }
            },

            // Fungsi untuk membuat partikel latar belakang dengan jumlah adaptif
            createBgParticles() {
                 // OPTIMASI: Kurangi jumlah partikel di layar kecil
                const count = window.innerWidth < 768 ? 20 : 35;
                const shapes = ['💖', '✨', '🌟', '🎶', '🎉', '♍', '🎀', '🎂'];
                for (let i = 0; i < count; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'bg-particle';
                    particle.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
                    const size = Math.random() * 40 + 30;
                    particle.style.fontSize = `${size}px`;
                    particle.style.left = `${Math.random() * 100}vw`;
                    particle.style.animationDuration = `${Math.random() * 15 + 20}s`;
                    particle.style.animationDelay = `${Math.random() * 10}s`;
                    elements.backgroundAnimation.appendChild(particle);
                }
            },

            // Fungsi untuk update progress bar scroll
            updateScrollProgress() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollProgress = (scrollTop / scrollHeight) * 100;
                elements.progressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
            },

            // Fungsi untuk mengamati elemen saat masuk viewport
            observeElements() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) entry.target.classList.add('visible');
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
                document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
            },

            // Fungsi untuk memperbarui warna tema
            updateThemeColor(color) {
                elements.root.style.setProperty('--accent-color', color);
                const colorMap = {'#ff6b9d':'#4ecdc4', '#4ecdc4':'#ff6b9d', '#a88679':'#ff6b9d', '#e91e63':'#4ecdc4', '#673ab7':'#4ecdc4', '#00bcd4':'#ff6b9d', '#4caf50':'#ff6b9d', '#ff9800':'#4ecdc4'};
                elements.root.style.setProperty('--accent-secondary', colorMap[color] || '#4ecdc4');
                elements.root.style.setProperty('--glow-color', color + '40');
            }
        };

        const contentRenderer = {
            // Render timeline dari data JSON
            renderTimeline() {
                elements.timelineContainer.innerHTML = appState.content.timelineItems.map((item, index) => {
                    const side = index % 2 === 0 ? 'left' : 'right';
                    const imageHtml = item.image ? `<img src="${item.image}" alt="${item.title}" class="timeline-image">` : '';
                    return `
                        <div class="timeline-item ${side}">
                            <div class="timeline-content">
                                ${imageHtml}
                                <h3>${item.year} - ${item.title}</h3>
                                <p>${item.description}</p>
                            </div>
                        </div>`;
                }).join('');
            },

            // Render galeri dari data JSON
            renderGallery() {
                // OPTIMASI: Tambahkan decoding="async" untuk performa rendering
                elements.photoGallery.innerHTML = appState.content.galleryImages.map((src, i) => `<img src="${src}" alt="Foto Kenangan ${i + 1}" loading="lazy" decoding="async">`).join('');
            },

            // Render video dari data JSON
            renderVideos() {
                elements.videoList.innerHTML = appState.content.videos.map(video => `<div class="video-wrapper"><iframe src="${video.url}" title="${video.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`).join('');
            }
        };

        const musicPlayer = {
            init() {
                if (appState.content.playlist?.length) this.loadTrack(0, false);
            },
            loadTrack(index, autoplay = true) {
                const track = appState.content.playlist[index];
                appState.currentTrackIndex = index;
                elements.audioElement.src = track.path;
                elements.playerArtwork.src = track.artwork;
                elements.playerTitle.textContent = track.title;
                elements.playerArtist.textContent = track.artist;
                this.updatePlayButton(false);
                if (autoplay) this.play();
            },
            play() {
                if (!appState.content.playlist?.length) return;
                elements.audioElement.play();
                this.updatePlayButton(true);
            },
            pause() {
                elements.audioElement.pause();
                this.updatePlayButton(false);
            },
            togglePlayPause() {
                elements.audioElement.paused ? this.play() : this.pause();
            },
            previousTrack() {
                const prev = (appState.currentTrackIndex - 1 + appState.content.playlist.length) % appState.content.playlist.length;
                this.loadTrack(prev);
            },
            nextTrack() {
                const next = (appState.currentTrackIndex + 1) % appState.content.playlist.length;
                this.loadTrack(next);
            },
            updatePlayButton(isPlaying) {
                elements.playPauseBtn.innerHTML = isPlaying ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="currentColor"/></svg>` : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5V19L19 12L8 5Z" fill="currentColor"/></svg>`;
            }
        };

        const eventHandlers = {
            init() {
                elements.photoGallery.addEventListener('click', (e) => {
                    if (e.target.tagName === 'IMG') {
                        elements.lightbox.style.display = 'block';
                        elements.lightboxImg.src = e.target.src;
                    }
                });
                elements.lightboxClose.addEventListener('click', this.closeLightbox);
                elements.lightbox.addEventListener('click', (e) => {
                    if (e.target === elements.lightbox) this.closeLightbox();
                });
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') this.closeLightbox();
                });
                elements.playPauseBtn.addEventListener('click', () => musicPlayer.togglePlayPause());
                elements.prevBtn.addEventListener('click', () => musicPlayer.previousTrack());
                elements.nextBtn.addEventListener('click', () => musicPlayer.nextTrack());
                elements.audioElement.addEventListener('ended', () => musicPlayer.nextTrack());
                window.addEventListener('scroll', utils.updateScrollProgress, { passive: true });
            },
            closeLightbox() {
                elements.lightbox.style.display = 'none';
            }
        };

        const app = {
            async init() {
                try {
                    const response = await fetch('content.json');
                    if (!response.ok) throw new Error('Gagal memuat konten');
                    appState.content = await response.json();

                    const params = new URLSearchParams(window.location.search);
                    const year = params.get('year') || 2006;
                    const color = decodeURIComponent(params.get('color') || '#ff6b9d');
                    utils.updateThemeColor(color);

                    utils.createBgParticles();
                    contentRenderer.renderTimeline();
                    contentRenderer.renderGallery();
                    contentRenderer.renderVideos();
                    musicPlayer.init();
                    eventHandlers.init();
                    utils.observeElements();
                    utils.updateScrollProgress();
                    utils.triggerConfetti();

                    const age = new Date().getFullYear() - parseInt(year, 10);
                    const greeting1 = appState.content.personalGreeting;
                    const greeting2 = `yang ke-${age}! 🎉`;

                    await utils.typewriter(elements.greetingLine1, greeting1, 100);
                    await utils.typewriter(elements.greetingLine2, greeting2, 120);

                    await new Promise(resolve => setTimeout(resolve, 300));

                    await utils.typewriter(elements.personalMessage, appState.content.personalMessage, 30);
                    elements.personalSignature.textContent = appState.content.personalSignature;

                    setTimeout(() => musicPlayer.play(), 500);

                } catch (error) {
                    console.error('Error initializing app:', error);
                    document.body.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; color: var(--text-light); font-family: 'Poppins', sans-serif; padding: 1rem;"><div><h1>😔 Oops! Terjadi Kesalahan</h1><p>Tidak dapat memuat konten website. Pastikan file <strong>content.json</strong> ada dan bisa diakses.</p><button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--accent-color); color: white; border: none; border-radius: 5px; cursor: pointer;">🔄 Coba Lagi</button></div></div>`;
                }
            }
        };
        app.init();
    }
});