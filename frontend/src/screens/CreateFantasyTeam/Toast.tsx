import React, { useState, useEffect } from "react";

import { ToastMessage } from "../../types/ToastMessage";
import {IoCloseSharp} from 'react-icons/io5'

import './Toast.css'

type ToastProps = {
  message: ToastMessage | undefined;
};

const Toast: React.FC<ToastProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!!message);

    if (message) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className={`custom-toast ${visible ? "show" : ""}`}>
      <button className="btn-flex" onClick={() => {setVisible(false)}}><IoCloseSharp style={{color: "white"}}/></button>
      <div className="toast-content">
      <p>
        <span className="bold">Points Remaining: &nbsp;</span>
        {message?.points}
      </p>
      <p>
        <span className="bold">Roster: &nbsp;</span>
        {message?.roster} / 25
      </p>
      </div>
    </div>
  );
};

export default Toast;
