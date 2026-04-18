let manualPaused = false;

document.addEventListener('click', (e) => {
    const video = document.querySelector('video');
    if (video) {
        setTimeout(() => {
            manualPaused = video.paused;
        }, 100);
    }
}, true);

Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
Object.defineProperty(document, 'hidden', { get: () => false });

setInterval(() => {
    const video = document.querySelector('video');
    const ad = document.querySelector('.ad-showing, .ad-interrupting');
    const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');

    if (video) {
        if (ad) {
            video.muted = true;
            video.playbackRate = 16; 
            manualPaused = false;
            if (skipBtn) skipBtn.click();
            if (isFinite(video.duration)) video.currentTime = video.duration;
        } else {
            if (video.muted && !video.paused) video.muted = false;
            if (video.playbackRate > 2) video.playbackRate = 1;
            if (video.paused && !manualPaused && !video.ended) {
                video.play().catch(() => {});
            }
        }
    }

    // TƏKMİLLƏŞDİRİLMİŞ SİLMƏ SİYAHISI
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
        "ytm-upsell-dialog-renderer",
        "ytm-open-app-receiver",
        ".ui-smart-app-banner",
        "tp-yt-paper-dialog",
        ".mobile-topbar-header-endpoint", // Şəkildəki o yuxarı "Tətbiqi Aç" hissəsi
        "button[aria-label='Uygulamayı Aç']", // Alternativ hədəf
        "button[aria-label='Open App']"
    ];

    selectors.forEach(s => {
        document.querySelectorAll(s).forEach(el => el.remove());
    });

    // Mətnlə təmizləmə hissəsi (daha rəsmi düymələr üçün)
    document.querySelectorAll('.ytm-open-app-button, button, a').forEach(el => {
        const txt = el.innerText.toLowerCase();
        if (txt.includes('tətbiqi aç') || txt.includes('uygulamada aç') || txt.includes('open app')) {
            el.closest('ytm-open-app-button')?.remove() || el.remove();
        }
    });

}, 200);
