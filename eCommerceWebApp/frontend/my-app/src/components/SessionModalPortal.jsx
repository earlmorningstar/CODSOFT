import { createPortal } from "react-dom";
import SessionVerificationModal from "./SessionVerificationModal";

const SessionModalPortal = ({ onClose }) => {
  return createPortal(
    <SessionVerificationModal open={true} onClose={onClose} />,
    document.body
  );
};

export default SessionModalPortal;
