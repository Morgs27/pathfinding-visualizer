import { useEffect, useState } from "react";
import "./ErrorMessage.css";
import { FaExclamationCircle } from "react-icons/fa";

interface ErrorMessageProps {
  message: string | null;
  setMessage: (message: string | null) => void;
}

const ErrorMessage = ({ message, setMessage }: ErrorMessageProps) => {
  const [startHiding, setStartHiding] = useState<boolean>(false);

  useEffect(() => {
    if (message != null) {
      setTimeout(() => {
        setStartHiding(true);
      }, 2000);
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } else {
      setStartHiding(false);
    }
  }, [message]);

  return (
    <div
      className={`error-message ${(message == null || startHiding) && "hide"}`}
    >
      <div className="error-text">{message}</div>
      <FaExclamationCircle />
    </div>
  );
};

export default ErrorMessage;
