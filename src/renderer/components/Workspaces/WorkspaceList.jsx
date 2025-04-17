import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaBriefcase,
  FaUser,
  FaFlask,
  FaPlus,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import TabsList from "../TabsList.jsx";
import { ADD_VIEW, mergeChannel } from "../../../constants/global/channels";
import { ADD_TAB } from "../../../constants/renderer/actions";
import { defaultTab } from "../../utils/tabs";
import "./WorkspaceList.css";

const TAB_LIMIT = 5;

const WorkspaceList = ({
  tabs,
  tabsDispatch,
  activeWorkspace,
  onWorkspaceSelect,
}) => {
  const [expandedWorkspaces, setExpandedWorkspaces] = useState({
    default: true,
    work: true,
    personal: true,
    research: true,
  });

  const workspsaceData = [
    { id: "default", name: "Default", icon: FaHome },
    { id: "work", name: "Work", icon: FaBriefcase },
    { id: "personal", name: "Personal", icon: FaUser },
    { id: "research", name: "Research", icon: FaFlask },
  ];

  const handleWorkspaceClick = (workspaceId) => {
    if (onWorkspaceSelect) {
      onWorkspaceSelect(workspaceId);
    }
  };

  const handleToggleWorkspace = (workspaceId, event) => {
    event.stopPropagation();
    setExpandedWorkspaces((prev) => ({
      ...prev,
      [workspaceId]: !prev[workspaceId],
    }));
  };

  const handleAddTab = () => {
    // Count tabs in the current workspace
    const currentWorkspaceTabs = tabs.filter(
      (tab) => (tab.workspaceId || "default") === activeWorkspace
    );

    // Check if we've reached the tab limit
    if (currentWorkspaceTabs.length >= TAB_LIMIT) {
      alert(
        `You've reached the maximum limit of ${TAB_LIMIT} tabs for this workspace.`
      );
      return;
    }

    const newTab = defaultTab(window.id, null, activeWorkspace);
    window.api.send(mergeChannel(ADD_VIEW, window.id), {
      ...newTab,
      workspaceId: activeWorkspace,
    });
    tabsDispatch({
      type: ADD_TAB,
      payload: {
        tab: {
          ...newTab,
          workspaceId: activeWorkspace,
        },
      },
    });
  };

  return (
    <div className="workspace-list">
      <div className="workspace-header">
        <h2>Workspaces</h2>
      </div>
      <div className="workspaces">
        {workspsaceData.map((workspace) => {
          const Icon = workspace.icon;
          const workspaceTabs = tabs.filter(
            (tab) => (tab.workspaceId || "default") === workspace.id
          );
          return (
            <div key={workspace.id}>
              <div
                className={`workspace-item ${
                  activeWorkspace === workspace.id ? "active-workspace" : ""
                }`}
                onClick={() => handleWorkspaceClick(workspace.id)}
              >
                <Icon className="workspace-icon" />
                <span className="workspace-name">{workspace.name}</span>
                <span className="tab-count">
                  {workspaceTabs.length}/{TAB_LIMIT}
                </span>
                <button
                  className={`toggle-button ${
                    expandedWorkspaces[workspace.id] ? "expanded" : ""
                  }`}
                  onClick={(e) => handleToggleWorkspace(workspace.id, e)}
                >
                  <FaChevronDown />
                </button>
              </div>
              {expandedWorkspaces[workspace.id] && (
                <TabsList
                  tabs={workspaceTabs}
                  tabsDispatch={tabsDispatch}
                  workspaceId={workspace.id}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="workspace-footer">
        <button
          className="new-tab-button"
          onClick={handleAddTab}
          disabled={
            tabs.filter(
              (tab) => (tab.workspaceId || "default") === activeWorkspace
            ).length >= TAB_LIMIT
          }
        >
          <FaPlus />
          <span>New Tab</span>
        </button>
      </div>
    </div>
  );
};

export default WorkspaceList;
