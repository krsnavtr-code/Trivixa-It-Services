import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import React from "react";
import ContactFormModal from "../components/common/ContactFormModal.jsx";

const CONTACT_FORM_SHOWN_KEY = "contactFormShown";

const useContactFormPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const location = useLocation();

  // Removed the automatic popup functionality
  // The modal will now only open when explicitly triggered

  const closeModal = () => {
    setIsOpen(false);
  };

  const ContactFormPopup = () => (
    <ContactFormModal isOpen={isOpen} onClose={closeModal} />
  );

  return {
    ContactFormPopup,
    isInitialized,
    openContactForm: () => setIsOpen(true),
    closeContactForm: closeModal,
  };
};

export default useContactFormPopup;
