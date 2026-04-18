let manualPaused = false;

// 1. Fon və gizlilik sığortası
Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
Object.defineProperty(document, 'hidden', { get: () => false });

// 2. MƏHVETMƏ VƏ TAM EKRAN FUNKSİYASI
function goAbsoluteFullscreen() {
    const video = document.querySelector('video');
    if (!video) return;

    if (!document.fullscreenElement) {
        // Videonu pəncərədən ayırıb bütün ekranı tutmağa məcbur edirik
        video.style.setProperty("position", "fixed", "important");
        video.style.setProperty("top", "0", "important");
        video.style.setProperty("left", "0", "important");
        video.style.setProperty("width", "100vw", "important");
        video.style.setProperty("height", "100vh", "important");
        video.style.setProperty("z-index", "2147483647", "important"); // Ən yuxarı qat
        video.style.setProperty("object-fit", "contain", "important");
        video.style.setProperty("background", "black", "important");

        // Brauzeri tam ekrana keçməyə məcbur et
        const requestMethod = video.requestFullscreen || video.webkitRequestFullscreen || video.mozRequestFullScreen || video.msRequestFullscreen;
        if (requestMethod) {
            requestMethod.call(video).then(() => {
                // Ekranı fırlat (dəstəkləyən cihazlarda)
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(() => {});
                }
            });
        }
    } else {
        // Köhnə vəziyyətə qaytar
        video.style.position = "";
        video.style.top = "";
        video.style.left = "";
        video.style.width = "";
        video.style.height = "";
        video.style.zIndex = "";
        if (document.exitFullscreen) document.exitFullscreen();
    }
}

// 3. YOUTUBE DÜYMƏSİNİ ƏLƏ KEÇİRMƏK
function hookButton() {
    const fsButton = document.querySelector('.ytp-fullscreen-button');
    if (fsButton && !fsButton.dataset.hacked) {
        // YouTube-un öz klik funksiyasını ləğv edirik
        fsButton.replaceWith(fsButton.cloneNode(true)); 
        const newBtn = document.querySelector('.ytp-fullscreen-button');
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            goAbsoluteFullscreen();
        });
        newBtn.dataset.hacked = "true";
    }
}

setInterval(() => {
    hookButton(); // Düyməni daim izlə və bizimki ilə əvəz et
    
    const video = document.querySelector('video');
    const ad = document.querySelector('.ad-showing, .ad-interrupting');
    const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');

    if (video) {
        // REKLAM BLOKER
        if (ad) {
            video.muted = true;
            video.playbackRate = 16;
            if (skipBtn) skipBtn.click();
            if (isFinite(video.duration)) video.currentTime = video.duration;
        } else {
            if (video.muted && !video.paused) video.muted = false;
            if (video.playbackRate > 2) video.playbackRate = 1;
        }
    }

    // Əlavə maneələri (banner, düymə və s.) təmizlə
    document.querySelectorAll(".ytp-ad-overlay-container, #player-ads, .mobile-topbar-header-endpoint").forEach(el => el.remove());
}, 500);
