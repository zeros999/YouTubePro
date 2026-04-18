let manualPaused = false;

// 1. Klik hadisəsini və manual pauzanı izlə
document.addEventListener('click', () => {
    const video = document.querySelector('video');
    if (video) {
        setTimeout(() => { manualPaused = video.paused; }, 100);
    }
}, true);

// 2. Fon rejimi bloklanmasını ləğv et
Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
Object.defineProperty(document, 'hidden', { get: () => false });

// 3. TAM EKRAN VƏ AVTOMATİK FIRLATMA FUNKSİYASI
async function toggleFullscreen() {
    const video = document.querySelector('video');
    // YouTube-da tam ekran üçün adətən pleyer konteynerini seçmək daha yaxşıdır
    const playerContainer = document.querySelector('.html5-video-player') || video;

    if (!video) return;

    try {
        if (!document.fullscreenElement) {
            // Tam ekrana keçid
            if (playerContainer.requestFullscreen) {
                await playerContainer.requestFullscreen();
            } else if (playerContainer.webkitRequestFullscreen) {
                await playerContainer.webkitRequestFullscreen();
            }

            // EKRANI AVTOMATİK FIRLAT (Landscape rejiminə məcbur et)
            if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape').catch(err => {
                    console.log("Fırlatma dəstəklənmir, amma tam ekran aktivdir.");
                });
            }
        } else {
            // Tam ekrandan çıxış
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            }
        }
    } catch (error) {
        console.error("Tam ekran xətası:", error);
    }
}

// 4. Reklam bloklama və təmizlik dövrü
setInterval(() => {
    const video = document.querySelector('video');
    const ad = document.querySelector('.ad-showing, .ad-interrupting');
    const skipBtn = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button');
    const fsButton = document.querySelector('.ytp-fullscreen-button');

    // Tam ekran düyməsinə bizim funksiyanı bağla (əgər hələ bağlanmayıbsa)
    if (fsButton && !fsButton.dataset.hooked) {
        fsButton.addEventListener('click', (e) => {
            e.stopImmediatePropagation(); // YouTube-un öz kodunun qarışmasına mane ol
            toggleFullscreen();
        }, true);
        fsButton.dataset.hooked = "true";
    }

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

    // Bannerləri və "Aç" düymələrini təmizlə
    const selectors = [
        ".ytp-ad-overlay-container", "#player-ads", "ytd-ad-slot-renderer",
        "ytm-ad-slot-renderer", ".ytp-ad-image-overlay", "#masthead-ad"
    ];
    selectors.forEach(s => {
        document.querySelectorAll(s).forEach(el => el.remove());
    });

    document.querySelectorAll('button, a').forEach(el => {
        const txt = el.innerText.toLowerCase();
        if (txt.includes('aç') || txt.includes('open')) {
            el.remove();
        }
    });
}, 250);
