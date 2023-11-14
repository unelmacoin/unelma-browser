import React from "react";
import { TiDocumentText } from "react-icons/ti";
import {AiTwotoneDelete} from'react-icons/ai';
import {FiSettings} from 'react-icons/fi'
import uniqid from "uniqid";
export const settingsSidebarMenuItems = [
   {
    id: uniqid(),
    label: "Setting",
    name:'setting',
    icon: (active) => (
      <FiSettings fontSize={20} color={active ? "#e87874" : "lightgray"} />
    ),
    
  },
  {
    id: uniqid(),
    label: "Password",
    name:'password',
    icon: (active) => (
      <TiDocumentText fontSize={20} color={active ? "#e87874" : "lightgray"} />
    ),
    
  },
  {
    id: uniqid(),
    label: "Clear Data",
    name:'clearCache',
    icon: (active) => (
      <AiTwotoneDelete fontSize={20} color={active ? "#e87874" : "lightgray"} />
    ),
    
  },
];

