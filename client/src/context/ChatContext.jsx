import React, { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import QuoteChat from "../components/quote/QuoteChat";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <ChatContext.Provider value={{ openChat, closeChat, isChatOpen }}>
      {children}
      {isChatOpen &&
        createPortal(<QuoteChat onClose={closeChat} />, document.body)}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
