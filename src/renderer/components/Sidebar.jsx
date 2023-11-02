import React, { useState, useEffect } from "react";
import BookmarkBtn from "./BookmarkBtn.jsx";
import LocationForm from "./LocationForm.jsx";
import Menu from "./Menu.jsx";
import MenuButton from "./MenuButton.jsx";
import NavigationControls from "./NavigationControls.jsx";
import SavePasswordDialog from "./SavePasswordDialog.jsx";
import TabsList from "./TabsList.jsx";
import WindowControllers from "./WindowControllers.jsx";

const Sidebar = ({
  tabs,
  tabsDispatch,
  openSidebar,
  setOpenSidebar,
  bookmarksDispatcher,
  bookmarks,
  loginDialogInfo,
  setLoginDialogInfo,
  setMenu = { setMenu },
  menu = { menu },
}) => {
  const renderSavePasswordDialog = () =>
    loginDialogInfo && (
      <SavePasswordDialog
        info={loginDialogInfo}
        setLoginDialogInfo={setLoginDialogInfo}
      />
    );

  const [sidebarWidth, setSidebarWidth] = useState(
    openSidebar
      ? `${window.innerWidth * 0.21}px`
      : `${window.innerWidth * 0.02}px`
  );
  useEffect(() => {
    window.addEventListener("resize", () => {
      document.getElementById("app-sidebar").style.width = openSidebar
        ? `${window.innerWidth * 0.21}px`
        : `${window.innerWidth * 0.02}px`;
    });
  }, [openSidebar]);

  const initResizeFunction = () => {
    const resizer = document.querySelector("#resizer");
    const sidebar = document.querySelector("#app-sidebar");

    let x, initialWidth;

    const mouseDownHandler = (e) => {
      x = e.clientX;
      initialWidth = parseInt(window.getComputedStyle(sidebar).width, 10);
      console.log(initialWidth);

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);
    };

    const mouseMoveHandler = (e) => {
      const dx = e.clientX - x;
      let newWidth = initialWidth + dx;
      const screenWidth = screen.innerWidth;
      const minWidth = 180;
      // Limit the minimum width
      if (newWidth < minWidth) {
        newWidth = minWidth;
      } else if (newWidth > screenWidth) {
        newWidth = screenWidth;
      }

      setSidebarWidth(`${newWidth}px`);
    };

    const mouseUpHandler = () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("mouseup", mouseUpHandler);
    };

    resizer.addEventListener("mousedown", mouseDownHandler);
  };

  useEffect(() => {
    initResizeFunction();
  }, []);

  return (
    <div
      id="app-sidebar"
      className={`${!openSidebar && "toggled-sidebar"}`}
      style={{
        width: sidebarWidth,
      }}
    >
      <div id="resizer"></div>
      {renderSavePasswordDialog()}
      <div id="controllers">
        <MenuButton setMenu={setMenu} menu={menu} openSidebar={openSidebar} />
        <WindowControllers
          setOpenSidebar={setOpenSidebar}
          openSidebar={openSidebar}
          setLoginDialogInfo={setLoginDialogInfo}
          setMenu={setMenu}
        />
        <BookmarkBtn
          tabs={tabs}
          bookmarksDispatcher={bookmarksDispatcher}
          bookmarks={bookmarks}
        />
        <NavigationControls tabs={tabs} />
      </div>
      <LocationForm tabs={tabs} tabsDispatch={tabsDispatch} />
      <Menu
        menu={menu}
        setMenu={setMenu}
        tabsDispatch={tabsDispatch}
        tabs={tabs}
      />
      <TabsList tabs={tabs} tabsDispatch={tabsDispatch} />
    </div>
  );
};

export default Sidebar;
