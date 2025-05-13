// Ad blocking logic for Electron (Unelma Browser)
const { session, app } = require('electron');
const { ElectronBlocker } = require('@cliqz/adblocker-electron');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Aggressive uBlock/uAssets filter lists
const FILTER_LISTS = [
  'https://easylist.to/easylist/easylist.txt',
  'https://easylist.to/easylist/easyprivacy.txt',
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt',
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/badware.txt',
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/privacy.txt',
  'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/unbreak.txt',
  // If you want maximum blocking (may break YouTube), re-add annoyances/resource-abuse/yt-annoyances below:
  // 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/annoyances.txt',
  // 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/resource-abuse.txt',
  // 'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/yt-annoyances.txt',
];

// Helper to initialize adblocker and apply to all sessions
async function enableAdBlocking() {

  // Disable ad-blocking for all YouTube-related domains by skipping ad-blocker logic for these URLs
  const youtubeDomains = [
    'youtube.com',
    'youtube-nocookie.com',
    'googlevideo.com',
  ];
  session.defaultSession.webRequest.onBeforeRequest((details, callback) => {
    const url = details.url;
    if (youtubeDomains.some(domain => url.includes(domain))) {
      // Do nothing for YouTube, let all requests through
      callback({ cancel: false });
      return;
    }
    // Only apply ad-blocker logic for non-YouTube domains (ad-blocker initialization below)
    callback({ cancel: false });
  });

  // Now, only initialize ad-blocker for non-YouTube domains
  // (ad-blocker logic remains unchanged below)

  try {
    // Use prebuilt lists for ads and tracking, with disk cache
    const { ElectronBlocker } = require('@cliqz/adblocker-electron');
    const fs = require('fs');
    const path = require('path');
    // Store cache in user's appData directory
    const cachePath = path.join(app.getPath('userData'), 'adblock-cache.bin');
    // Provide both sync and async cache methods for compatibility
    const read = () => {
      try {
        return fs.existsSync(cachePath) ? fs.readFileSync(cachePath) : null;
      } catch (e) {
        return null;
      }
    };
    const write = (data) => {
      try {
        fs.writeFileSync(cachePath, data);
      } catch (e) {}
    };

    const blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch, false, { read, write });
    // Enable ad-blocking for main session
    blocker.enableBlockingInSession(session.defaultSession);
    blocker.on('request-blocked', ({ url, type }) => {
      console.log(`[adblock] Blocked: ${type} ${url}`);
    });
    blocker.on('request-redirected', ({ url, redirectUrl }) => {
      console.log(`[adblock] Redirected: ${url} -> ${redirectUrl}`);
    });
    blocker.on('request-whitelisted', ({ url }) => {
      console.log(`[adblock] Whitelisted: ${url}`);
    });
    // Cosmetic filtering and scriptlets are disabled to avoid breaking YouTube.
    // To re-enable, uncomment below:
    // if (blocker.enableCosmeticFiltering) blocker.enableCosmeticFiltering(session.defaultSession);
    // if (blocker.enableScriptlets) blocker.enableScriptlets(session.defaultSession);
    console.log('Ad-blocker enabled (prebuilt lists, cosmetic/scriptlets OFF for compatibility)');
  } catch (err) {
    console.error('Prebuilt adblock lists failed, falling back to manual lists:', err);
    try {
      const { ElectronBlocker } = require('@cliqz/adblocker-electron');
      const blocker = await ElectronBlocker.fromLists(fetch, FILTER_LISTS);
      // Allow absolutely all requests to YouTube-related domains and subdomains
      if (blocker.allowlist && typeof blocker.allowlist.add === 'function') {
        blocker.allowlist.add('@@||youtube.com^');
        blocker.allowlist.add('@@||youtube-nocookie.com^');
        blocker.allowlist.add('@@||googlevideo.com^');
        blocker.allowlist.add('@@||*.youtube.com^');
        blocker.allowlist.add('@@||*.youtube-nocookie.com^');
        blocker.allowlist.add('@@||*.googlevideo.com^');
      }
      blocker.enableBlockingInSession(session.defaultSession);
      // Allowlist essential YouTube resources for scripts/XHR to prevent blank page
      if (blocker.allowlist && typeof blocker.allowlist.add === 'function') {
        blocker.allowlist.add('@@||youtube.com^$script,domain=youtube.com|www.youtube.com');
        blocker.allowlist.add('@@||youtube-nocookie.com^$script,domain=youtube.com|www.youtube.com');
        blocker.allowlist.add('@@||googlevideo.com^$script,domain=youtube.com|www.youtube.com');
        blocker.allowlist.add('@@||youtube.com^$xmlhttprequest,domain=youtube.com|www.youtube.com');
        blocker.allowlist.add('@@||youtube-nocookie.com^$xmlhttprequest,domain=youtube.com|www.youtube.com');
        blocker.allowlist.add('@@||googlevideo.com^$xmlhttprequest,domain=youtube.com|www.youtube.com');
      }
      blocker.on('request-blocked', ({ url, type }) => {
        console.log(`[adblock] Blocked: ${type} ${url}`);
      });
      blocker.on('request-redirected', ({ url, redirectUrl }) => {
        console.log(`[adblock] Redirected: ${url} -> ${redirectUrl}`);
      });
      blocker.on('request-whitelisted', ({ url }) => {
        console.log(`[adblock] Whitelisted: ${url}`);
      });
      // Cosmetic filtering and scriptlets are disabled to avoid breaking YouTube.
      // To re-enable, uncomment below:
      // if (blocker.enableCosmeticFiltering) blocker.enableCosmeticFiltering(session.defaultSession);
      // if (blocker.enableScriptlets) blocker.enableScriptlets(session.defaultSession);
      console.log('Ad-blocker enabled (manual lists, cosmetic/scriptlets OFF for compatibility)');
    } catch (err2) {
      console.error('Failed to initialize ad-blocker completely:', err2);
    }
  }
}

// Aggressive ad-blocking: all lists, cosmetic filtering, scriptlets
async function enableAggressiveAdBlocking() {
  try {
    const { ElectronBlocker } = require('@cliqz/adblocker-electron');
    const ALL_LISTS = [
      'https://easylist.to/easylist/easylist.txt',
      'https://easylist.to/easylist/easyprivacy.txt',
      'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt',
      'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/badware.txt',
      'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/privacy.txt',
      'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/unbreak.txt',
      'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/annoyances.txt',
      'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/resource-abuse.txt',
      'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/yt-annoyances.txt',
    ];
    const blocker = await ElectronBlocker.fromLists(fetch, ALL_LISTS);
    blocker.enableBlockingInSession(session.defaultSession);
    if (blocker.enableCosmeticFiltering) blocker.enableCosmeticFiltering(session.defaultSession);
    if (blocker.enableScriptlets) blocker.enableScriptlets(session.defaultSession);
    console.log('Aggressive ad-blocker enabled (all lists, cosmetic/scriptlets ON)');
  } catch (err) {
    console.error('Failed to enable aggressive ad-blocking:', err);
  }
}

module.exports = { enableAdBlocking, enableAggressiveAdBlocking };

