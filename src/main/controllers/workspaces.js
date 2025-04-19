const Store = require("electron-store");
const store = new Store();

const WORKSPACES_KEY = "custom-workspaces";

module.exports = {
  getCustomWorkspaces: () => {
    try {
      return store.get(WORKSPACES_KEY) || [];
    } catch (error) {
      console.error("Error getting workspaces:", error);
      return [];
    }
  },

  addCustomWorkspace: (workspace) => {
    if (!workspace || !workspace.id || typeof workspace.id !== "string") {
      console.error("Invalid workspace object:", workspace);
      return;
    }
    const workspaces = store.get(WORKSPACES_KEY) || [];
    if (!workspaces.find((w) => w.id === workspace.id)) {
      store.set(WORKSPACES_KEY, [...workspaces, workspace]);
    }
  },

  updateCustomWorkspace: (workspaceId, updates) => {
    try {
      const workspaces = store.get(WORKSPACES_KEY) || [];
      const updatedWorkspaces = workspaces.map((w) =>
        w.id === workspaceId ? { ...w, ...updates } : w
      );
      store.set(WORKSPACES_KEY, updatedWorkspaces);
    } catch (error) {
      console.error("Error updating workspace:", error);
    }
  },

  deleteCustomWorkspace: (workspaceId) => {
    try {
      const workspaces = store.get(WORKSPACES_KEY) || [];
      store.set(
        WORKSPACES_KEY,
        workspaces.filter((w) => w.id !== workspaceId)
      );
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  },
};
