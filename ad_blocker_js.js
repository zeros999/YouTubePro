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

// 2. YouTube-un səhifə gizlənmə hadisələrini blokla
Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
Object.defineProperty(document, 'hidden', { get: () => false });

setInterval(() => {
    const video = document.querySelector('video');
    const ad = document.querySelector('.ad-showing, .ad-interrupting');
    const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');

    if (video) {
        // --- ƏLAVƏ OLUNAN HİSSƏ: EKRANI TAM DOLDUR ---
        // Videonun kənarlarındakı qara boşluqları yox edir
        if (video.style.objectFit !== "cover") {
            video.style.objectFit = "cover";
        }
        // --------------------------------------------

        // REKLAM VARSA
        if (ad) {
            video.muted = true;
            video.playbackRate = 16; 
            manualPaused = false;
            
            if (skipBtn) {
                skipBtn.click();
                console.log("Reklam avtomatik atlanıldı.");
            }
            
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

    // 3. BANNER VƏ DİGƏR REKLAMLARI SİLMƏK
    const selectors = [
        ".ytp-ad-overlay-container",
        "#player-ads",
        "ytd-ad-slot-renderer",
        "ytm-ad-slot-renderer",
        "ytm-promoted-item-renderer",
        ".ytp-ad-image-overlay",
        ".ytp-ad-overlay-image",
        "#masthead-ad",
        "ytd-companion-slot-renderer",
        ".mobile-topbar-header-endpoint" // Yuxarıdakı "Tətbiqi Aç" düyməsi üçün
    ];

    selectors.forEach(s => {
        document.querySelectorAll(s).forEach(el => el.remove());
    });

    // 4. "Aç" və ya "Open" yazılan elementləri təmizlə
    document.querySelectorAll('button, a').forEach(el => {
        const txt = el.innerText.toLowerCase();
        if (txt.includes('tətbiqi aç') || txt.includes('uygulamada aç') || txt.includes('open app')) {
            el.remove();
        }
    });

}, 200);
