"use client";

import Sidebar from "@/app/components/Sidebar";
import Burger from "@/app/components/Burger";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="font-sans flex flex-row bg-[#DFDFDE] w-full h-screen overflow-hidden text-slate-800">
      {/* kiri */}
      <div className="h-screen">
        <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      </div>

      {/* kanan */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <Burger toggle={toggleSidebar} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
