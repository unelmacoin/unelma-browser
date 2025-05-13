// Preload script: Detect when a YouTube video starts playing and notify main process
const { ipcRenderer } = require('electron');

function notifyAggressiveAdblock() {
  ipcRenderer.send('youtube-video-started');
}

function hookVideoPlay() {
  const video = document.querySelector('video');
  if (video) {
    video.addEventListener('play', notifyAggressiveAdblock, { once: true });
  } else {
    // Try again after DOM changes
    const observer = new MutationObserver(() => {
      const vid = document.querySelector('video');
      if (vid) {
        observer.disconnect();
        vid.addEventListener('play', notifyAggressiveAdblock, { once: true });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

if (window.location.hostname.includes('youtube.com')) {
  window.addEventListener('DOMContentLoaded', hookVideoPlay);
}
