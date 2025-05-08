import React, { useState, useEffect, useRef, useCallback } from "react";
import { throttle } from "lodash";
import Layout from "../../components/Layout/Layout.jsx";
import Sidebar from "../../components/Sidebar.jsx";
import ResizableDivider from "../../components/ResizableDivider.jsx";
import {
  TOGGLE_WINDOW,
  RESIZE_WINDOW,
} from "../../../constants/global/channels";
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
  const [isNarrowMode, setIsNarrowMode] = useState(false);
  const homeRef = useRef(null);
  const lastValidWidth = useRef(240);
  const COLLAPSED_WIDTH = 80;
  const DEFAULT_EXPANDED_WIDTH = 240;
  const NARROW_SIDEBAR_THRESHOLD = 200;

  // Update CSS variable for sidebar width and notify main process
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${sidebarWidth}px`
    );

    // Notify main process of width change
    window.api.send(RESIZE_WINDOW, {
      width: sidebarWidth,
      windowId: window.id,
    });

    // Update narrow-sidebar class based on width
    const sidebar = document.getElementById("app-sidebar");
    if (sidebar) {
      if (sidebarWidth < NARROW_SIDEBAR_THRESHOLD && !isNarrowMode) {
        setIsNarrowMode(true);
        sidebar.classList.add("narrow-sidebar");
      } else if (sidebarWidth >= NARROW_SIDEBAR_THRESHOLD && isNarrowMode) {
        setIsNarrowMode(false);
        sidebar.classList.remove("narrow-sidebar");
      }
    }
  }, [sidebarWidth, isNarrowMode]);

  // Handle toggle button state changes and notify main process
  useEffect(() => {
    if (!openSidebar) {
      setSidebarWidth(COLLAPSED_WIDTH);
      window.api.send(TOGGLE_WINDOW, {
        isOpen: false,
        width: COLLAPSED_WIDTH,
        windowId: window.id,
      });
    } else {
      setSidebarWidth(lastValidWidth.current);
      window.api.send(TOGGLE_WINDOW, {
        isOpen: true,
        width: lastValidWidth.current,
        windowId: window.id,
      });
    }
  }, [openSidebar]);

  // Debounced resize handler with main process notification
  const handleResize = useCallback(
    throttle((newWidth) => {
      const clampedWidth = Math.max(COLLAPSED_WIDTH, newWidth);
      const sidebar = document.getElementById("app-sidebar");

      if (clampedWidth < NARROW_SIDEBAR_THRESHOLD) {
        // In narrow mode, maintain the dragged width until toggle is clicked
        setSidebarWidth(clampedWidth);
        setIsNarrowMode(true);
        if (sidebar) {
          sidebar.classList.add("narrow-sidebar");
        }
        window.api.send(RESIZE_WINDOW, {
          width: clampedWidth,
          windowId: window.id,
        });
      } else {
        setSidebarWidth(clampedWidth);
        setIsNarrowMode(false);
        if (sidebar) {
          sidebar.classList.remove("narrow-sidebar");
        }
        lastValidWidth.current = clampedWidth;
        window.api.send(RESIZE_WINDOW, {
          width: clampedWidth,
          windowId: window.id,
        });
      }

      // Update openSidebar state based on width crossing the NARROW_SIDEBAR_THRESHOLD
      setOpenSidebar(clampedWidth >= NARROW_SIDEBAR_THRESHOLD);
    }, 33), // 30 fps throttle
    [setOpenSidebar, setIsNarrowMode, window.api]
  );

  useEffect(() => {
    // Delayed resize to ensure BrowserView is properly positioned
    setTimeout(() => {
      handleResize(sidebarWidth);
    }, 50);
  }, []);

  // Calculate webviews container styles based on sidebar state
  const getWebviewsContainerStyle = () => {
    const width = openSidebar ? sidebarWidth : COLLAPSED_WIDTH;
    const isTransitioning =
      sidebarWidth < NARROW_SIDEBAR_THRESHOLD && openSidebar;

    return {
      transform: `translateX(${width}px)`,
      width: `calc(100% - ${width}px)`,
      transition: isTransitioning ? "none" : "all 0.3s ease",
    };
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
          minWidth={COLLAPSED_WIDTH}
        />
        <div
          id="webviews-container"
          className={`${!openSidebar ? "toggled-container" : ""} ${
            isNarrowMode ? "narrow-container" : ""
          }`}
          style={getWebviewsContainerStyle()}
        ></div>
      </div>
    </Layout>
  );
};

export default Home;
