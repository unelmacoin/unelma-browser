import React from "react";
import { TiDocumentText } from "react-icons/ti";
import uniqid from "uniqid";
export const settingsSidebarMenuItems = [
  {
    id: uniqid(),
    label: "Password",
    icon: (active) => (
      <TiDocumentText fontSize={20} color={active ? "#e87874" : "lightgray"} />
    ),
  },
];

