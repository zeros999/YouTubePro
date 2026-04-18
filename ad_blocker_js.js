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

// 3. Tam ekran idarəetmə funksiyası
function toggleFullscreen() {
    const player = document.querySelector('video');
    if (!player) return;

    if (!document.fullscreenElement) {
        if (player.requestFullscreen) {
            player.requestFullscreen();
        } else if (player.webkitRequestFullscreen) {
            player.webkitRequestFullscreen();
        } else if (player.msRequestFullscreen) {
            player.msRequestFullscreen();
        }
        
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {});
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

// Düyməni tap və klik hadisəsini bağla
const fsButton = document.querySelector('.ytp-fullscreen-button'); 
if (fsButton) {
    fsButton.addEventListener('click', toggleFullscreen);
}

// 4. Reklam bloklama və təmizlik dövrü
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

    // BANNER VƏ DİGƏR REKLAMLARI SİLMƏK
    const selectors = [
        ".ytp-ad-overlay-container",
        "#player-ads",
        "ytd-ad-slot-renderer",
        "ytm-ad-slot-renderer",
        "ytm-promoted-item-renderer",
        ".ytp-ad-image-overlay",
        ".ytp-ad-overlay-image",
        "#masthead-ad",
        "ytd-companion-slot-renderer"
    ];

    selectors.forEach(s => {
        document.querySelectorAll(s).forEach(el => el.remove());
    });

    // "Aç" və ya "Open" yazılan elementləri təmizlə
    document.querySelectorAll('button, a').forEach(el => {
        const txt = el.innerText.toLowerCase();
        if (txt.includes('aç') || txt.includes('open')) {
            el.remove();
        }
    });

}, 200);
