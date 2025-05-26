import React, { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import {
  HIDE_VIEWS,
  SHOW_VIEWS,
  mergeChannel,
} from "../../constants/global/channels";
import "../css/NewWorkspaceModal.css";

const NewWorkspaceModal = ({ onClose, onSelect }) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    // Hide views when modal opens
    window.api.send(mergeChannel(HIDE_VIEWS, window.id));

    // Focus the input when modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Handle click outside to close
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Show views when modal closes
      window.api.send(mergeChannel(SHOW_VIEWS, window.id));
    };
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);

      if (!workspaceName.trim()) {
        setError("Workspace name cannot be empty");
        return;
      }

      onSelect({ name: workspaceName.trim() });
    },
    [workspaceName, onSelect]
  );

  return createPortal(
    <div
      className="new-workspace-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-workspace-title"
    >
      <div className="new-workspace-modal" ref={modalRef}>
        <button
          className="close-button"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <FaTimes />
        </button>
        <h2 id="new-workspace-title" className="new-workspace-title">
          New Workspace
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
              className="workspace-input"
              aria-label="Workspace name"
            />
          </div>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          <button type="submit" className="create-button">
            Create Workspace
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default NewWorkspaceModal;
