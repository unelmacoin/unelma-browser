[![Build](https://github.com/unelmacoin/unelma-browser/actions/workflows/sonarcloud.yml/badge.svg)](https://github.com/unelmacoin/unelma-browser/actions/workflows/sonarcloud.yml)

# Unelma Browser

Unelma Browser is an open-source web browser designed to provide a fast, secure, and user-friendly browsing experience. Built with privacy and freedom in mind, it aims to empower users with a seamless and customizable way to explore the internet. Developed by [Unelma Platforms](https://www.unelmaplatforms.com), Unelma Browser is available for macOS, Windows, and Linux.

## Features

- **Privacy-Focused**: Includes built-in ad-blocking powered by `@cliqz/adblocker-electron` for a cleaner browsing experience.
- **Cross-Platform**: Runs on macOS, Windows, and Linux with consistent performance.
- **Modern Tech Stack**: Built with [Electron](https://www.electronjs.org/) (v29.1.5), [React](https://reactjs.org/) (v18.2.0), and [React Router](https://reactrouter.com/) for a responsive UI.
- **Customizable**: Offers a user-friendly interface with support for themes and extensions.
- **Secure**: Regular updates and hardened runtime on macOS ensure a safe browsing environment.
- **Open Source**: Licensed under the Apache 2.0 License, inviting community contributions.

## Installation

Unelma Browser binaries are available for macOS, Windows, and Linux. Download the latest release (v3.2.8 as of May 2025 from the [GitHub Releases page](https://github.com/unelmacoin/unelma-browser/releases).

### System Requirements
- **macOS**: macOS 10.13 or later
- **Windows**: Windows 10 or later
- **Linux**: Ubuntu 18.04 or equivalent
- At least 4GB RAM and 500MB disk space

### Steps
1. Visit the [Releases page](https://github.com/unelmacoin/unelma-browser/releases).
2. Download the appropriate installer for your operating system (e.g., `.dmg` for macOS, `.exe` for Windows, or `.AppImage` for Linux).
3. Click on Unelma_Browser --> New Browser Window
4. Run the installer and follow the on-screen instructions.
5. Launch Unelma Browser from your applications menu.

## Usage

Once installed, Unelma Browser is ready to use. Key features include:
- **Ad Blocking**: Enabled by default to reduce intrusive ads.
- **Bookmark Management**: Save and organize bookmarks via the history/bookmark menu.
- **Custom Themes**: Switch between light and dark themes in the settings.
- **Developer Tools**: Access Electron’s built-in developer tools for debugging (Ctrl+Shift+I or Cmd+Shift+I).

For support, contact [support@unelmacoin.com](mailto:support@unelmacoin.com) or join our [community on Discord](https://discord.gg/dccbXPKGRH).

## Building from Source

To build Unelma Browser from source, ensure you have [Node.js](https://nodejs.org/) (v16 or later) and [Git](https://git-scm.com/) installed.

### Prerequisites
- Node.js and npm
- Electron Forge (`npm install -g @electron-forge/cli`)
- A GitHub account for publishing (optional)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/unelmacoin/unelma-browser.git
   cd unelma-browser
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Build the application for distribution:
   ```bash
   npm run dist
   ```
   This generates installers for Windows (`nsis`), macOS, and Linux (`AppImage`) in the `out` directory.

For macOS, notarization is required. Configure your Apple Developer credentials in `build/notarize.js` before running `npm run publish`.

## Contributing

We welcome contributions to Unelma Browser! To get started:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit: `git commit -m "Add feature-name"`.
4. Push to your branch: `git push origin feature-name`.
5. Open a pull request on GitHub.

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code review process and coding standards. Check open issues [here](https://github.com/unelmacoin/unelma-browser/issues) for tasks to tackle.

## License

Unelma Browser is licensed under the [Apache 2.0 License](LICENSE). See the [LICENSE](LICENSE) file for details.

## Contact

- **Website**: [https://www.unelmaplatforms.com](https://www.unelmaplatforms.com)
- **Email**: [support@unelmacoin.com](mailto:support@unelmacoin.com)
- **Twitter**: [@unelmaplatforms](https://twitter.com/unelmaplatforms)
- **Facebook**: [Unelma Platforms](https://www.facebook.com/unelmaplatforms)
- **Reddit**: [r/unelmacoin](https://www.reddit.com/r/unelmacoin/)
- **Discord**: [Join our server](https://discord.gg/dccbXPKGRH)

Thank you for using Unelma Browser! Let’s build a freer internet together.