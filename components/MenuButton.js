const MenuButton = () => {
  const menuButton = document.createElement("div");
  menuButton.id = "menu-button";
  menuButton.innerHTML = '<i class="fa fa-ellipsis"></i>';
  menuButton.addEventListener("click", () => {
    const menu = document.getElementById("menu");
    menu.classList.toggle("open");
  });
  return menuButton;
};
module.exports = MenuButton;
