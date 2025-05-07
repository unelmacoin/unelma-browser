import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import {
  HIDE_VIEWS,
  SHOW_VIEWS,
  mergeChannel,
} from "../../constants/global/channels";
import "../css/NewTabModal.css";

const SUGGESTED_SITES = [
  { name: "Google", url: "https://www.google.com" },
  { name: "YouTube", url: "https://www.youtube.com" },
  { name: "GitHub", url: "https://www.github.com" },
  { name: "Gmail", url: "https://mail.google.com" },
  { name: "Twitter", url: "https://twitter.com" },
  { name: "LinkedIn", url: "https://www.linkedin.com" },
];

const NewTabModal = ({ onClose, onSelect }) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredSites, setFilteredSites] = useState(SUGGESTED_SITES);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    // Focus the input when modal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Hide web content when modal opens
    const viewId = window.id;
    window.api.send(mergeChannel(HIDE_VIEWS, viewId));

    // Handle click outside to close
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Show web content when modal closes
      window.api.send(mergeChannel(SHOW_VIEWS, viewId));
    };
  }, []);

  useEffect(() => {
    // Filter suggested sites based on search
    const filtered = SUGGESTED_SITES.filter(
      (site) =>
        site.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        site.url.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredSites(filtered);
  }, [searchValue]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const url = searchValue.startsWith("http")
        ? searchValue
        : `https://${searchValue}`;
      onSelect({ url });
    }
  };

  const handleSiteSelect = (site) => {
    onSelect(site);
  };

  return createPortal(
    <div className="new-tab-modal-overlay">
      <div className="new-tab-modal" ref={modalRef}>
        <button className="close-button" onClick={handleClose}>
          <FaTimes />
        </button>
        <form onSubmit={handleSubmit}>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search or enter URL"
              className="search-input"
            />
          </div>
        </form>
        <div className="suggested-sites">
          {filteredSites.map((site) => (
            <button
              key={site.url}
              className="suggested-site"
              onClick={() => handleSiteSelect(site)}
            >
              <span className="site-name">{site.name}</span>
              <span className="site-url">{site.url}</span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NewTabModal;
