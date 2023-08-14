import React from "react";
import './layout.css'
import TopBar from'../TopBar.jsx'
const Layout = ({ children, menu, setMenu }) => {
  
  return (
    <div id="root" style={{ height: `${window.window.innerHeight}px` }} >
      {children}
      <TopBar menu={menu}  setMenu={setMenu}/>
    </div>
  );
};

export default Layout;
