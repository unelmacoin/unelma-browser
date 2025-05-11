module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    // Only DMG for macOS to guarantee notarization
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {},
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'unelmacoin',
          name: 'unelma-browser',
        },
        prerelease: false,
        draft: true
      },
    },
  ],
  hooks: {
    async postMake({ makeResults }) {
      if (process.platform !== 'darwin') return;
      const { notarize } = require('@electron/notarize');
      const appleId = process.env.APPLE_ID;
      const appleIdPassword = process.env.APPLE_ID_PASSWORD || process.env.APPLE_APP_SPECIFIC_PASSWORD;
      const teamId = process.env.APPLE_TEAM_ID;
      if (!appleId) {
        console.warn('Not notarizing: Missing APPLE_ID environment variable');
        return;
      }
      if (!appleIdPassword) {
        console.warn('Not notarizing: Missing APPLE_ID_PASSWORD or APPLE_APP_SPECIFIC_PASSWORD environment variable');
        return;
      }
      if (!teamId) {
        console.warn('Not notarizing: Missing APPLE_TEAM_ID environment variable');
        return;
      }
      for (const result of makeResults) {
        console.log('Artifacts found:', result.artifacts);
        for (const artifact of result.artifacts) {
          if (artifact.endsWith('.app') || artifact.endsWith('.dmg')) {
            console.log('Notarizing:', artifact);
            await notarize({
              appBundleId: 'com.unelmas.browser',
              appPath: artifact,
              appleId,
              appleIdPassword,
              teamId
            });
            console.log('Notarization complete for:', artifact);
          } else {
            console.log('Skipping non-macOS artifact:', artifact);
          }
        }
      }
    }
  }
};
