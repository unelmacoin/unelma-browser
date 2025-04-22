import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import ResizableDivider from "../../components/ResizableDivider.jsx";
import "./home.css";

const Home = ({
  tabsDispatch,
  bookmarksDispatcher,
  openSidebar,
  setOpenSidebar,
  bookmarks,
  tabs,
  loginDialogInfo,
  setLoginDialogInfo,
  setMenu,
  menu,
}) => {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const homeRef = useRef(null);
  const lastValidWidth = useRef(240);
  const COLLAPSED_WIDTH = 40;
  const DEFAULT_EXPANDED_WIDTH = 240;

  // Update CSS variable for sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${sidebarWidth}px`
    );
  }, [sidebarWidth]);

  // Handle toggle button state changes
  useEffect(() => {
    if (!openSidebar) {
      setSidebarWidth(COLLAPSED_WIDTH);
    } else {
      setSidebarWidth(lastValidWidth.current);
    }
  }, [openSidebar]);

  const handleResize = (newWidth) => {
    setSidebarWidth(newWidth);
    if (newWidth > COLLAPSED_WIDTH) {
      lastValidWidth.current = newWidth;
    }
  };

  return (
    <Layout setMenu={setMenu} menu={menu}>
      <div id="home" ref={homeRef}>
        <Sidebar
          tabs={tabs}
          tabsDispatch={tabsDispatch}
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
          bookmarksDispatcher={bookmarksDispatcher}
          bookmarks={bookmarks}
          loginDialogInfo={loginDialogInfo}
          setLoginDialogInfo={setLoginDialogInfo}
          setMenu={setMenu}
          menu={menu}
          style={{ width: `calc(${sidebarWidth}px - 20px)` }}
        />
        <ResizableDivider
          position={sidebarWidth - 40}
          onResize={handleResize}
          minWidth={80}
          collapseThreshold={80}
          collapsedWidth={COLLAPSED_WIDTH}
        />
        <div
          id="webviews-container"
          className={`${!openSidebar && "toggled-container"}`}
          style={{ transform: `translateX(${sidebarWidth}px)` }}
        ></div>
      </div>
    </Layout>
  );
};

export default Home;
