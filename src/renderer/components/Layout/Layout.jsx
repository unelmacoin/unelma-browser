import React from "react";
import './layout.css'
import TopBar from'../TopBar.jsx'
const Layout = ({ children }) => {
  return (
    <div id="root" style={{ height: `${window.window.innerHeight}px` }}>
      {children}
      <TopBar />
    </div>
  );
};

export default Layout;
