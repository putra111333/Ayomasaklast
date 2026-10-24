(() => {
  const loadingScreen = document.getElementById('gameLoadingScreen');
  if (!loadingScreen) return;

  if (window.self !== window.top || document.documentElement.classList.contains('embedded')) {
    loadingScreen.remove();
    return;
  }

  const minimumDisplayTime = 3000;
  const idleStartScreen = document.getElementById('idleStartScreen');
  const progressTrack = loadingScreen.querySelector('#gameLoadingProgress');
  const progressFill = loadingScreen.querySelector('.game-loading-track__fill');
  const progressIndicator = loadingScreen.querySelector('.game-loading-track__indicator');
  const progressLabel = loadingScreen.querySelector('#gameLoadingPercent');
  let loadingStartedAt;
  let currentProgress = 0;

  function setProgress(value) {
    if (!progressTrack || !progressFill || !progressIndicator || !progressLabel) return;

    currentProgress = Math.max(currentProgress, Math.min(100, Math.round(value)));
    const fillWidth = currentProgress * 0.8737;
    progressTrack.setAttribute('aria-valuenow', String(currentProgress));
    progressLabel.textContent = `${currentProgress}%`;
    progressFill.style.width = `${fillWidth}%`;
    progressIndicator.style.left = `calc(6.18% + ${fillWidth}%)`;
  }

  async function finishLoading() {
    loadingStartedAt = performance.now();
    const images = [...document.images].filter(image =>
      image.getAttribute('src') || image.getAttribute('srcset') || image.currentSrc
    );
    let resourcesReady = false;
    const resourcesPromise = Promise.all([
      Promise.all(images.map(async image => {
        if (!image.complete) {
          await new Promise(resolve => {
            image.addEventListener('load', resolve, { once: true });
            image.addEventListener('error', resolve, { once: true });
          });
        }

        if (!image.naturalWidth) {
          console.error(`Gagal memuat gambar: ${image.currentSrc || image.src}`);
          return;
        }

        if (typeof image.decode === 'function') {
          try {
            await image.decode();
          } catch (error) {
            console.error(`Gagal menyiapkan gambar: ${image.currentSrc || image.src}`, error);
          }
        }
      })),
      document.fonts.ready
    ]).then(() => {
      resourcesReady = true;
    });

    while (!resourcesReady || performance.now() - loadingStartedAt < minimumDisplayTime) {
      const elapsed = performance.now() - loadingStartedAt;
      const timedProgress = elapsed / minimumDisplayTime * 97;
      setProgress(resourcesReady
        ? Math.min(97, timedProgress)
        : Math.min(85, timedProgress));
      await new Promise(resolve => window.requestAnimationFrame(resolve));
    }

    await resourcesPromise;
    setProgress(100);
    await new Promise(resolve => window.setTimeout(resolve, 140));

    loadingScreen.classList.add('is-hidden');
    loadingScreen.setAttribute('aria-hidden', 'true');
    await new Promise(resolve => {
      const timeout = window.setTimeout(resolve, 500);
      loadingScreen.addEventListener('transitionend', event => {
        if (event.target !== loadingScreen) return;
        window.clearTimeout(timeout);
        resolve();
      }, { once: true });
    });
    loadingScreen.remove();
  }

  function startLoading() {
    if (idleStartScreen) {
      idleStartScreen.classList.add('is-hidden');
      idleStartScreen.setAttribute('aria-hidden', 'true');
      loadingScreen.classList.remove('is-waiting');
    }

    finishLoading();
  }

  if (idleStartScreen) {
    document.getElementById('idleStartButton').addEventListener('click', startLoading, { once: true });
  } else if (document.readyState === 'complete') {
    startLoading();
  } else {
    window.addEventListener('load', startLoading, { once: true });
  }
})();
