const handleFavicon = (url) => {
  const settingsTabs = ["bookmark", "history"];
  const settingTab = settingsTabs.find((tab) => url.includes(tab));
  return url === "https://www.unelma.xyz/"
    ? "img/unp.png"
    : settingTab
    ? `img/${settingTab}.png`
    : `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`;
};
module.exports = handleFavicon;
