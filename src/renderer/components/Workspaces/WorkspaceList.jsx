import React, { useEffect, useState, useRef } from "react";
import {
  FaHome,
  FaBriefcase,
  FaUser,
  FaFlask,
  FaPlus,
  FaChevronDown,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaBox,
} from "react-icons/fa";
import TabsList from "../TabsList.jsx";
import {
  ADD_VIEW,
  mergeChannel,
  GET_CUSTOM_WORKSPACES,
  ADD_CUSTOM_WORKSPACE,
  UPDATE_CUSTOM_WORKSPACE,
  DELETE_CUSTOM_WORKSPACE,
} from "../../../constants/global/channels";
import { ADD_TAB } from "../../../constants/renderer/actions";
import { defaultTab } from "../../utils/tabs";
import "./WorkspaceList.css";
import { BsPersonWorkspace } from "react-icons/bs";
import NewTabModal from "../NewTabModal.jsx";
import NewWorkspaceModal from "../NewWorkspaceModal.jsx";

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
  const [customWorkspaces, setCustomWorkspaces] = useState([]);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [showNewTabModal, setShowNewTabModal] = useState(false);
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (workspaces) => {
      setCustomWorkspaces(workspaces);
      const newExpandedState = { ...expandedWorkspaces };
      workspaces.forEach((ws) => {
        newExpandedState[ws.id] = true;
      });
      setExpandedWorkspaces(newExpandedState);
    };
    window.api.receive(GET_CUSTOM_WORKSPACES, handler);
    window.api.send(GET_CUSTOM_WORKSPACES);
    return () => window.api.remove(GET_CUSTOM_WORKSPACES, handler);
  }, []);

  useEffect(() => {
    if (editingWorkspace && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingWorkspace]);

  const workspaceData = [
    { id: "default", name: "Default", icon: FaHome },
    { id: "work", name: "Work", icon: FaBriefcase },
    { id: "personal", name: "Personal", icon: FaUser },
    { id: "research", name: "Research", icon: FaFlask },
  ];

  const handleWorkspaceClick = (workspaceId) => {
    if (onWorkspaceSelect) onWorkspaceSelect(workspaceId);
  };

  const handleToggleWorkspace = (workspaceId, event) => {
    event.stopPropagation();
    setExpandedWorkspaces((prev) => ({
      ...prev,
      [workspaceId]: !prev[workspaceId],
    }));
  };

  const handleAddTab = () => {
    const currentWorkspaceTabs = tabs.filter(
      (tab) => (tab.workspaceId || "default") === activeWorkspace
    );
    if (currentWorkspaceTabs.length >= TAB_LIMIT) {
      alert(
        `You've reached the maximum limit of ${TAB_LIMIT} tabs for this workspace.`
      );
      return;
    }
    setShowNewTabModal(true);
  };

  const handleModalClose = () => setShowNewTabModal(false);

  const handleModalSelect = (site) => {
    const newTab = defaultTab(window.id, site.url, activeWorkspace);
    window.api.send(mergeChannel(ADD_VIEW, window.id), {
      ...newTab,
      workspaceId: activeWorkspace,
    });
    tabsDispatch({
      type: ADD_TAB,
      payload: { tab: { ...newTab, workspaceId: activeWorkspace } },
    });
    setShowNewTabModal(false);
  };

  const handleCreateWorkspace = () => setShowNewWorkspaceModal(true);

  const handleWorkspaceModalClose = () => setShowNewWorkspaceModal(false);

  const handleWorkspaceModalSelect = (workspace) => {
    const newWorkspace = {
      name: workspace.name,
      id: `custom-${Date.now()}`,
      icon: FaBox,
    };
    window.api.send(ADD_CUSTOM_WORKSPACE, newWorkspace);
    setCustomWorkspaces((prev) => [...prev, newWorkspace]);
    setExpandedWorkspaces((prev) => ({ ...prev, [newWorkspace.id]: true }));
    setShowNewWorkspaceModal(false);
  };

  const handleRenameWorkspace = (workspaceId, currentName) => {
    setEditingWorkspace(workspaceId);
    setNewWorkspaceName(currentName);
  };

  const handleDeleteWorkspace = (workspaceId) => {
    if (confirm("Are you sure you want to delete this workspace?")) {
      try {
        window.api.send(DELETE_CUSTOM_WORKSPACE, workspaceId);
        setCustomWorkspaces((prev) =>
          prev.filter((ws) => ws.id !== workspaceId)
        );
        if (activeWorkspace === workspaceId) onWorkspaceSelect("default");
      } catch (error) {
        console.error("Error deleting workspace:", error);
        alert(
          `Failed to delete workspace: ${error.message || "Unknown error"}`
        );
      }
    }
  };

  const handleSaveWorkspace = () => {
    if (!newWorkspaceName.trim()) return;
    try {
      const updatedWorkspace = {
        id: editingWorkspace,
        name: newWorkspaceName.trim(),
      };
      window.api.send(UPDATE_CUSTOM_WORKSPACE, updatedWorkspace);
      setCustomWorkspaces((prev) =>
        prev.map((ws) =>
          ws.id === editingWorkspace
            ? { ...ws, name: newWorkspaceName.trim() }
            : ws
        )
      );
      setEditingWorkspace(null);
      setNewWorkspaceName("");
    } catch (error) {
      console.error("Error saving workspace:", error);
      alert(`Failed to save workspace: ${error.message || "Unknown error"}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingWorkspace(null);
    setNewWorkspaceName("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveWorkspace();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const renderWorkspaceItem = (workspace, isCustom = false) => {
    const Icon = workspace.icon;
    const isExpanded = expandedWorkspaces[workspace.id];
    const workspaceTabs = tabs.filter(
      (tab) => (tab.workspaceId || "default") === workspace.id
    );
    const isEditing = editingWorkspace === workspace.id;

    return (
      <div key={workspace.id} className="sidebar-block">
        <div
          className={`workspace-item ${
            activeWorkspace === workspace.id ? "active-workspace" : ""
          }`}
          onClick={() => !isEditing && handleWorkspaceClick(workspace.id)}
          data-tooltip={workspace.name}
        >
          <Icon className="workspace-icon" />
          {isEditing ? (
            <div className="workspace-edit-form">
              <input
                ref={inputRef}
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="workspace-edit-actions">
                <button
                  className="workspace-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveWorkspace();
                  }}
                  data-tooltip="Save"
                >
                  <FaCheck />
                </button>
                <button
                  className="workspace-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
                  data-tooltip="Cancel"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ) : (
            <>
              <span className="workspace-name">{workspace.name}</span>
              <span className="tab-count">
                {workspaceTabs.length}/{TAB_LIMIT}
              </span>
              {isCustom && (
                <div className="workspace-actions">
                  <button
                    className="workspace-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameWorkspace(workspace.id, workspace.name);
                    }}
                    data-tooltip="Rename workspace"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="workspace-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkspace(workspace.id);
                    }}
                    data-tooltip="Delete workspace"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </>
          )}
          <button
            className={`toggle-button ${isExpanded ? "expanded" : ""}`}
            onClick={(e) => handleToggleWorkspace(workspace.id, e)}
            data-tooltip={isExpanded ? "Collapse" : "Expand"}
          >
            <FaChevronDown className={isExpanded ? "expanded" : ""} />
          </button>
        </div>
        {isExpanded && (
          <TabsList
            tabs={workspaceTabs}
            tabsDispatch={tabsDispatch}
            workspaceId={workspace.id}
          />
        )}
      </div>
    );
  };

  return (
    <div className="workspace-list">
      <div className="workspace-buttons sidebar-block">
        {showNewTabModal && (
          <NewTabModal
            onClose={handleModalClose}
            onSelect={handleModalSelect}
          />
        )}
        {showNewWorkspaceModal && (
          <NewWorkspaceModal
            onClose={handleWorkspaceModalClose}
            onSelect={handleWorkspaceModalSelect}
          />
        )}
        <button
          className="new-tab-button"
          onClick={handleAddTab}
          disabled={
            tabs.filter(
              (tab) => (tab.workspaceId || "default") === activeWorkspace
            ).length >= TAB_LIMIT
          }
          data-tooltip="New Tab"
        >
          <FaPlus />
          <span>New Tab</span>
        </button>
      </div>
      <div className="workspace-header">
        <h2>
          <BsPersonWorkspace className="workspace-icon" />
          Workspaces
        </h2>
      </div>
      <div className="workspaces sidebar-block">
        <button
          className="new-workspace-button"
          onClick={handleCreateWorkspace}
          data-tooltip="New Workspace"
        >
          <FaPlus />
          <span>New Workspace</span>
        </button>
        {workspaceData.map((workspace) => renderWorkspaceItem(workspace))}
        {customWorkspaces.map((workspace) =>
          renderWorkspaceItem(workspace, true)
        )}
      </div>
    </div>
  );
};

export default WorkspaceList;
