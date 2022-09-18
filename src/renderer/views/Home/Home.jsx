import React from "react";
import Layout from "../../components/Layout/Layout.jsx";
import Sidebar from "../../components/Sidebar.jsx";
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
}) => {
  return (
    <Layout>
      <div id="home">
        <Sidebar
          tabs={tabs}
          tabsDispatch={tabsDispatch}
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
          bookmarksDispatcher={bookmarksDispatcher}
          bookmarks={bookmarks}
          loginDialogInfo={loginDialogInfo}
          setLoginDialogInfo={setLoginDialogInfo}
        />
        <div
          id="webviews-container"
          className={`${!openSidebar && "toggled-container"}`}
        ></div>
      </div>
    </Layout>
  );
};

export default Home;
