const Store = require("electron-store");
const store = new Store();

const WORKSPACES_KEY = "custom-workspaces";

module.exports = {
  getCustomWorkspaces: () => store.get(WORKSPACES_KEY) || [],

  addCustomWorkspace: (workspace) => {
    const workspaces = store.get(WORKSPACES_KEY) || [];
    if (!workspaces.find((w) => w.id === workspace.id)) {
      store.set(WORKSPACES_KEY, [...workspaces, workspace]);
    }
  },

  updateCustomWorkspace: (workspaceId, updates) => {
    const workspaces = store.get(WORKSPACES_KEY) || [];
    const updatedWorkspaces = workspaces.map((w) =>
      w.id === workspaceId ? { ...w, ...updates } : w
    );
    store.set(WORKSPACES_KEY, updatedWorkspaces);
  },

  deleteCustomWorkspace: (workspaceId) => {
    const workspaces = store.get(WORKSPACES_KEY) || [];
    store.set(
      WORKSPACES_KEY,
      workspaces.filter((w) => w.id !== workspaceId)
    );
  },
};
