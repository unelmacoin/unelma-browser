import React, { useState, useEffect } from "react";
import BookmarkBtn from "./BookmarkBtn.jsx";
import LocationForm from "./LocationForm.jsx";
import Menu from "./Menu.jsx";
import MenuButton from "./MenuButton.jsx";
import NavigationControls from "./NavigationControls.jsx";
import SavePasswordDialog from "./SavePasswordDialog.jsx";
import TabsList from "./TabsList.jsx";
import WindowControllers from "./WindowControllers.jsx";
import WorkspaceList from "./Workspaces/WorkspaceList.jsx";

const Sidebar = ({
  tabs,
  tabsDispatch,
  openSidebar,
  setOpenSidebar,
  bookmarksDispatcher,
  bookmarks,
  loginDialogInfo,
  setLoginDialogInfo,
  setMenu,
  menu,
  style,
}) => {
  const [activeWorkspace, setActiveWorkspace] = useState("default");

  const handleWorkspaceSelect = (workspaceId) => {
    setActiveWorkspace(workspaceId);
  };

  const renderSavePasswordDialog = () =>
    loginDialogInfo && (
      <SavePasswordDialog
        info={loginDialogInfo}
        setLoginDialogInfo={setLoginDialogInfo}
      />
    );

  return (
    <div
      id="app-sidebar"
      className={`${!openSidebar && "toggled-sidebar"}`}
      style={style}
    >
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
      <WorkspaceList
        tabs={tabs}
        tabsDispatch={tabsDispatch}
        activeWorkspace={activeWorkspace}
        onWorkspaceSelect={handleWorkspaceSelect}
      />
    </div>
  );
};

export default Sidebar;
