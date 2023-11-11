import React from "react";
import "../css/Modal.css";

const Modal = ({
  changeHandler,
  deleteHandler,
  closeModalHandler,
  inputText,
}) => {
  return (
    <div className="backdrop">
      <div className="modal-container">
        <button className="modal__close" onClick={closeModalHandler}>
          &times;
        </button>
        <div className="modal__header">Confirmation</div>
        <p className="modal__text">
          This action is irreversible. To confirm deletion, type DEL and press
          Delete.
        </p>
        <form className="confirmationForm">
          <input
            type="text"
            name="confirmationText"
            id="confirmationText"
            placeholder="DEL"
            onChange={changeHandler}
          />
          <div className="btnSet">
            <button
              type="submit"
              disabled={inputText !== "DEL"}
              className={`btnOk ${inputText === "DEL" ? "" : "disabled"}`}
              onClick={deleteHandler}
            >
              Delete
            </button>
            <button
              type="reset"
              className="btnCancel"
              onClick={closeModalHandler}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
