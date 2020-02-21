import React, { useState, useRef, useEffect } from "react";
import { useReceiptContext } from "../../utils/ReceiptState";
import API from "../../utils/API";

function PayerList(props) {
  const [receiptState, receiptStateDispatch] = useReceiptContext();

  const [addPayer, setAddPayer] = useState(false);

  const [payers, setPayers] = useState([]);

  useEffect(() => {
    if (receiptState.receipts[0]) {
      loadPayers();
    }
  }, [receiptState]);

  const nameInput = useRef();

  function loadPayers() {
    setPayers(receiptState.receipts[0].Payers);
  }

  function toggleAddPayer() {
    if (!props.isEditMode) {
      setAddPayer(!addPayer);
    }
  }

  function selectPayer(id) {
    if (!props.isEditMode) {
      if (id === receiptState.currentPayer) {
        receiptStateDispatch({ type: "setCurrentPayer", payerId: null });
      } else {
        receiptStateDispatch({ type: "setCurrentPayer", payerId: id });
      }
    }
  }

  function savePayer(e) {
    e.preventDefault();
    API.createPayer({
      name: nameInput.current.value,
      ReceiptId: props.receiptId
    })
      .then(results => {
        nameInput.current.value = "";
        toggleAddPayer();
        props.loadReceipt(receiptState.receipts[0].id, results.data.id);
      })
      .catch(err => console.log(err));
  }

  function deletePayer(id) {
    API.deletePayer(id)
      .then(_ => {
        props.loadReceipt(receiptState.receipts[0].id);
        window.location.reload();
      })
      .catch(err => console.log(err));
  }

  return (
    <ul className="list-group payer-list">
      {payers.map(payer => {
        // {receiptState.receipts.length ? receiptState.receipts[0].Payers.map(payer => {
        return (
          <li
            key={payer.id}
            className={
              receiptState.currentPayer === payer.id
                ? "list-group-item selected"
                : "list-group-item"
            }
            onClick={() => selectPayer(payer.id)}
          >
            {receiptState.currentPayer === payer.id ? (
              <span
                className="remove-btn bg-danger text-white mr-1"
                onClick={() => deletePayer(payer.id)}
              >
                <i className="fas fa-times"></i>
              </span>
            ) : (
              ""
            )}
            {payer.name} <span className="cancel-payer">Close</span>
          </li>
        );
        // }) : ""}
      })}

      {addPayer ? (
        <li className="list-group-item">
          <form onSubmit={savePayer}>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Payer Name"
              ref={nameInput}
            />
            <button type="submit" className="btn btn-sm btn-secondary">
              Save
            </button>
          </form>
        </li>
      ) : (
        ""
      )}

      <li className="list-group-item add-payer">
        <button className="btn btn-secondary" onClick={toggleAddPayer}>
          <i className="fas fa-plus" aria-hidden="true"></i> Add Payer
        </button>
      </li>
    </ul>
  );
}

export default PayerList;
