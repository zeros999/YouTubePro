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

// 2. YouTube-un səhifə gizlənmə hadisələrini blokla (Arxa fon üçün)
Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
Object.defineProperty(document, 'hidden', { get: () => false });

setInterval(() => {
    const video = document.querySelector('video');
    const ad = document.querySelector('.ad-showing, .ad-interrupting');
    const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');

    if (video) {
        // REKLAM VARSA
        if (ad) {
            video.muted = true;
            video.playbackRate = 16; 
            manualPaused = false;
            
            // Avtomatik Skip düyməsinə klik et
            if (skipBtn) {
                skipBtn.click();
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

    // 3. BANNERLƏR VƏ POP-UPLAR (Tətbiqi aç və s.)
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
        "ytm-upsell-dialog-renderer",      // "Tətbiqdə aç" pəncərəsi
        "ytm-open-app-receiver",           // Tətbiqə yönləndirmə
        ".ui-smart-app-banner",            // Brauzerin öz banneri
        "tp-yt-paper-dialog"               // Abunə ol və ya digər popup-lar
    ];

    selectors.forEach(s => {
        document.querySelectorAll(s).forEach(el => el.remove());
    });

    // 4. "Aç" və ya "Open" yazılan bütün bezdirici butonları sil
    document.querySelectorAll('button, a').forEach(el => {
        const txt = el.innerText.toLowerCase();
        // Sırf "aç" və ya "open" olanları hədəf alırıq (Kanalı aç kimi vacib şeylərə toxunmasın deyə)
        if (txt === 'aç' || txt === 'open' || txt.includes('uygulamada aç') || txt.includes('open app')) {
            el.remove();
        }
    });

}, 200);
            
