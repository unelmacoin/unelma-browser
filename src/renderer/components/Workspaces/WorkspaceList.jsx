import React, { useEffect, useState, useRef } from "react";
import {
  FaHome,
  FaBriefcase,
  FaUser,
  FaFlask,
  FaPlus,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
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
  const inputRef = useRef(null);

  useEffect(() => {
    // Load custom workspaces
    window.api.receive(GET_CUSTOM_WORKSPACES, (workspaces) => {
      setCustomWorkspaces(workspaces);
      // Initialize expanded state for custom workspaces
      const newExpandedState = { ...expandedWorkspaces };
      workspaces.forEach((ws) => {
        newExpandedState[ws.id] = true;
      });
      setExpandedWorkspaces(newExpandedState);
    });
    window.api.send(GET_CUSTOM_WORKSPACES);
  }, []);

  useEffect(() => {
    if (editingWorkspace && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingWorkspace]);

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
    const currentWorkspaceTabs = tabs.filter(
      (tab) => (tab.workspaceId || "default") === activeWorkspace
    );

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

  const handleCreateWorkspace = () => {
    setEditingWorkspace("new");
    setNewWorkspaceName("");
  };

  const handleRenameWorkspace = (workspaceId, currentName) => {
    setEditingWorkspace(workspaceId);
    setNewWorkspaceName(currentName);
  };

  const handleDeleteWorkspace = (workspaceId) => {
    if (confirm("Are you sure you want to delete this workspace?")) {
      window.api.send(DELETE_CUSTOM_WORKSPACE, workspaceId);
      setCustomWorkspaces(
        customWorkspaces.filter((ws) => ws.id !== workspaceId)
      );
      if (activeWorkspace === workspaceId) {
        onWorkspaceSelect("default");
      }
    }
  };

  const handleSaveWorkspace = () => {
    if (!newWorkspaceName.trim()) return;

    if (editingWorkspace === "new") {
      // Create new workspace
      const newWorkspace = {
        id: `custom-${Date.now()}`,
        name: newWorkspaceName.trim(),
        icon: FaBox,
      };
      window.api.send(ADD_CUSTOM_WORKSPACE, newWorkspace);
      setCustomWorkspaces([...customWorkspaces, newWorkspace]);
    } else {
      // Rename existing workspace
      window.api.send(UPDATE_CUSTOM_WORKSPACE, {
        id: editingWorkspace,
        name: newWorkspaceName.trim(),
      });
      setCustomWorkspaces(
        customWorkspaces.map((ws) =>
          ws.id === editingWorkspace
            ? { ...ws, name: newWorkspaceName.trim() }
            : ws
        )
      );
    }

    setEditingWorkspace(null);
    setNewWorkspaceName("");
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
    const workspaceTabs = tabs.filter(
      (tab) => (tab.workspaceId || "default") === workspace.id
    );
    const isEditing = editingWorkspace === workspace.id;

    return (
      <div key={workspace.id}>
        <div
          className={`workspace-item ${
            activeWorkspace === workspace.id ? "active-workspace" : ""
          }`}
          onClick={() => !isEditing && handleWorkspaceClick(workspace.id)}
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
                >
                  <FaCheck />
                </button>
                <button
                  className="workspace-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelEdit();
                  }}
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
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="workspace-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkspace(workspace.id);
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </>
          )}
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
  };

  const renderNewWorkspaceForm = () => {
    if (editingWorkspace !== "new") return null;

    return (
      <div className="workspace-item new-workspace-form">
        <FaBox className="workspace-icon" />
        <div className="workspace-edit-form">
          <input
            ref={inputRef}
            type="text"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter workspace name"
          />
          <div className="workspace-edit-actions">
            <button
              className="workspace-action-btn"
              onClick={handleSaveWorkspace}
            >
              <FaCheck />
            </button>
            <button className="workspace-action-btn" onClick={handleCancelEdit}>
              <FaTimes />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="workspace-list">
      <div className="workspace-header">
        <h2>Workspaces</h2>
      </div>
      <div className="workspaces">
        {workspsaceData.map((workspace) => renderWorkspaceItem(workspace))}
        {renderNewWorkspaceForm()}
        {customWorkspaces.map((workspace) =>
          renderWorkspaceItem(workspace, true)
        )}
      </div>
      <div className="workspace-footer">
        <button
          className="new-workspace-button"
          onClick={handleCreateWorkspace}
          disabled={editingWorkspace !== null}
        >
          <FaPlus />
          <span>New Workspace</span>
        </button>
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
