import "./style.css";

// eslint-disable-next-line react/prop-types
const Modal = ({ title, onClose, children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <hr className="modal-divider" />
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
