"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import Users from "@/components/containers/Users";

const DashboardPage = () => {
  const [selectedLink, setSelectedLink] = useState("users");

  const handleLinkClick = (name: string) => {
    setSelectedLink(name);
  };
  return (
    <div className="h-screen overflow-auto z-50">
      <div className="flex m-2 md:m-10 gap-3">
        <Sidebar selected={selectedLink} handler={handleLinkClick} />
        {selectedLink === "users" && <Users />}
        {selectedLink === "statistics" && <div>Statistic Content</div>}
      </div>
    </div>
  );
};

export default DashboardPage;
