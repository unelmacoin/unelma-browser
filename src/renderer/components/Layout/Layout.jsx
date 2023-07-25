import React from "react";
import './layout.css'
import TopBar from'../TopBar.jsx'
const Layout = ({ children, menu, setMenu }) => {
  console.log(menu)
  const handleClose =() =>{
    if (menu === true)  setMenu(false)//document.getElementById("menu-button").click();
   
  }
  return (
    <div id="root" style={{ height: `${window.window.innerHeight}px` }} onClick={handleClose}>
      {children}
      <TopBar />
    </div>
  );
};

export default Layout;
