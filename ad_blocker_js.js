let manualPaused = false;

// 1. Klik hadisəsini izlə
document.addEventListener('click', (e) => {
    const video = document.querySelector('video');
    if (video) {
        setTimeout(() => {
            manualPaused = video.paused;
        }, 100);
    }
}, true);

// 2. Səhifə gizlənmə hadisələrini blokla
Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
Object.defineProperty(document, 'hidden', { get: () => false });

setInterval(() => {
    const video = document.querySelector('video');
    const ad = document.querySelector('.ad-showing, .ad-interrupting');
    const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');

    // --- ARXA FONU QARALTMA HİSSƏSİ ---
    // Bütün səhifənin və pleyerin arxa fonunu məcburi qara edir
    document.body.style.backgroundColor = "black";
    const playerContainer = document.querySelector('#player-container, .player-container, #player');
    if (playerContainer) {
        playerContainer.style.backgroundColor = "black";
    }
    // YouTube-un o rəngli "Ambient Mode" (Cinematic) effektini söndürür
    const cinematicContainer = document.querySelector('#cinematic-container, .cinematic-container');
    if (cinematicContainer) cinematicContainer.remove();
    // ---------------------------------

    if (video) {
        // REKLAM VARSA
        if (ad) {
            video.muted = true;
            video.playbackRate = 16; 
            manualPaused = false;
            if (skipBtn) skipBtn.click();
            if (isFinite(video.duration)) video.currentTime = video.duration;
        } 
        // REKLAM YOXDURSA
        else {
            if (video.muted && !video.paused) video.muted = false;
            if (video.playbackRate > 2) video.playbackRate = 1;
            if (video.paused && !manualPaused && !video.ended) {
                video.play().catch(() => {});
            }
        }
    }

    // 3. REKLAMLARI VƏ BANNERLƏRİ SİL
    const selectors = [
        ".ytp-ad-overlay-container", "#player-ads", "ytd-ad-slot-renderer",
        "ytm-ad-slot-renderer", "ytm-promoted-item-renderer", ".ytp-ad-image-overlay",
        ".ytp-ad-overlay-image", "#masthead-ad", "ytd-companion-slot-renderer",
        ".mobile-topbar-header-endpoint" // O yuxarıdakı "Tətbiqi Aç" düyməsi
    ];

    selectors.forEach(s => {
        document.querySelectorAll(s).forEach(el => el.remove());
    });

    // 4. "Tətbiqi Aç" düymələrini söküb at
    document.querySelectorAll('button, a').forEach(el => {
        const txt = el.innerText.toLowerCase();
        if (txt.includes('tətbiqi aç') || txt.includes('uygulamada aç') || txt.includes('open app')) {
            el.remove();
        }
    });

}, 200);
