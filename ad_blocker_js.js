
    let manualPaused = false;

    // 1. Klik hadisəsini izlə: Əgər istifadəçi ekrana toxunubsa
    document.addEventListener('click', (e) => {
        const video = document.querySelector('video');
        if (video) {
            setTimeout(() => {
                manualPaused = video.paused; 
                console.log("Manual Pause vəziyyəti:", manualPaused);
            }, 100);
        }
    }, true);

    // 2. YouTube-un səhifə gizlənmə hadisələrini blokla (Arxa fon üçün)
    Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
    Object.defineProperty(document, 'hidden', { get: () => false });

    setInterval(() => {
        const video = document.querySelector('video');
        const ad = document.querySelector('.ad-showing, .ad-interrupting');
        const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');

        if (video) {
            // REKLAM VARSA: Sürətləndir və manualPaused-u sıfırla
            if (ad) {
                video.muted = true;
                video.playbackRate = 16;
                manualPaused = false; 
                if(isFinite(video.duration)) video.currentTime = video.duration;
                if (skipBtn) skipBtn.click();
            } 
            // REKLAM YOXDURSA:
            else {
                if (video.muted) video.muted = false;
                if (video.playbackRate > 2) video.playbackRate = 1;

                if (video.paused && !manualPaused && !video.ended) {
                    video.play().catch(() => {});
                    console.log("Sistem dayandırdı, avtomatik başladıldı.");
                }
            }
        }

        // TƏMİZLƏMƏ: Alt bannerlər, reklamlar və "Tətbiqi aç" elementləri
        const selectors = [
            ".ytp-ad-overlay-container", 
            "#player-ads", 
            "ytd-ad-slot-renderer",
            "ytm-ad-slot-renderer",            // Video altındakı əsas reklam bloku
            "ytm-promoted-item-renderer",      // Sponsorlu məhsullar
            "ytm-promoted-sparkles-web-renderer", // Parıldayan reklam bannerləri
            "ytm-upsell-dialog-renderer",      // "Tətbiqdə aç" popup pəncərəsi
            "ytm-open-app-receiver",           // Tətbiqə yönləndirmə
            ".ui-smart-app-banner",            // Brauzer banneri
            "tp-yt-paper-dialog"               // Hər hansı digər dialoq pəncərəsi
        ];
        
        selectors.forEach(s => {
            document.querySelectorAll(s).forEach(el => {
                el.style.display = 'none'; // Görünməz et
                el.remove();               // Kökündən sil
            });
        });

        // "Aç" və ya "Open" yazılan hər şeyi silməyə davam et
        document.querySelectorAll('button, a').forEach(el => {
            const txt = el.innerText.toLowerCase();
            if(txt.includes('aç') || txt.includes('open')) {
                el.remove();
            }
        });

    }, 500);
