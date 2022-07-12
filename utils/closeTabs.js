const closeTabs = () => {
  const closeBtns = [...document.querySelectorAll(".close")];
  closeBtns.forEach((btn, index) => {
    if (index !== 0) btn.click();

  });
  document.querySelector(".active-webview").src = "https://www.unelma.xyz/";
};
module.exports = closeTabs;
