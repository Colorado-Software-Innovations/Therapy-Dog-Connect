import React, { createContext, useState } from "react";

export const NotificationContext = createContext({
  // eslint-disable-next-line no-unused-vars
  show: (open, severity, message) => {},
  hide: () => {},
});

function NotificationContextProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("info");
  const [message, setMessage] = useState("");

  function show(severity, message) {
    setSeverity(severity);
    setMessage(message);
    setOpen(true);
  }

  function hide() {
    setOpen(false);
  }

  const value = {
    open,
    severity,
    message,
    show,
    hide,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContextProvider;
