import React, { useState, useEffect } from "react";
import { ToastMessage } from "../../types/ToastMessage";

type ToastProps = {
  message: ToastMessage | undefined;
  onClose: () => void;
};
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(false);
  console.log(visible);
  useEffect(() => {
    setVisible(!!message);

    if (message) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className={`custom-toast ${visible ? "show" : ""}`}>
      <p>
        <span className="bold">Points Remaining: &nbsp;</span>
        {message?.points}
      </p>
      <p>
        <span className="bold">Roster: &nbsp;</span>
        {message?.roster}
      </p>
    </div>
  );
};

export default Toast;
