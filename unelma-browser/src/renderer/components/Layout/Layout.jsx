import React, { useEffect, useState } from "react";
import './layout.css'
import TopBar from'../TopBar.jsx'
const Layout = ({ children, menu, setMenu }) => {

useEffect(() => {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    document.getElementById("root").setAttribute('data-theme', storedTheme)
  }
}, []);
  return (
    <div id="root" style={{ height: `${window.window.innerHeight}px` }} >
      {children}
      <TopBar menu={menu}  setMenu={setMenu}/>
    </div>
  );
};

export default Layout;
