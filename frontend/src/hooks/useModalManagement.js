// hooks/useModalManagement.js
// Modal management custom hook
// --------------------------------------------------

import { useState, useCallback } from "react";

export const useModalManagement = () => {
  const [showNodePicker, setShowNodePicker] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const openModal = useCallback(() => {
    setShowNodePicker(true);
    setTimeout(() => setModalOpen(true), 10);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => {
      setShowNodePicker(false);
      setSearchTerm("");
    }, 300);
  }, []);

  return {
    showNodePicker,
    modalOpen,
    searchTerm,
    setSearchTerm,
    openModal,
    closeModal
  };
};