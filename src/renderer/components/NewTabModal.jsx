import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Memoize filtered sites to prevent unnecessary re-renders
  const filteredSites = useMemo(() => {
    return SUGGESTED_SITES.filter(
      (site) =>
        site.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        site.url.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

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

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredSites.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case "Escape":
          handleClose();
          break;
        default:
          break;
      }
    },
    [filteredSites.length, handleClose]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      try {
        if (highlightedIndex >= 0 && highlightedIndex < filteredSites.length) {
          onSelect(filteredSites[highlightedIndex]);
        } else if (searchValue.trim()) {
          let url = searchValue.trim();
          if (!/^https?:\/\//i.test(url)) {
            // Not a URL, treat as Unelma Search query
            url = `https://unelmas.com/web?q=${encodeURIComponent(
              searchValue
            )}`;
          }
          onSelect({ url });
        }
      } catch (err) {
        setError("Failed to process the request. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [highlightedIndex, filteredSites, searchValue, onSelect]
  );

  const handleSiteSelect = useCallback(
    (site) => {
      onSelect(site);
    },
    [onSelect]
  );

  return createPortal(
    <div
      className="new-tab-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-tab-title"
    >
      <div className="new-tab-modal" ref={modalRef}>
        <button
          className="close-button"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <FaTimes />
        </button>
        <h2 id="new-tab-title" className="new-tab-title">
          New Tab
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search or enter URL"
              className="search-input"
              aria-label="Search or enter URL"
            />
          </div>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
        </form>
        <div
          className="suggested-sites"
          role="listbox"
          aria-label="Suggested sites"
        >
          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : (
            filteredSites.map((site, index) => (
              <button
                key={site.url}
                className={`suggested-site ${
                  index === highlightedIndex ? "highlighted" : ""
                }`}
                onClick={() => {
                  setHighlightedIndex(index);
                  handleSiteSelect(site);
                }}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                <span className="site-name">{site.name}</span>
                <span className="site-url">{site.url}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NewTabModal;
