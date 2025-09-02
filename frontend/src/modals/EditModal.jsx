import React, {useState} from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const EditModalSection = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
  display: none;

  button.save-changes {
    background-color: #5cb85c;
    color: white;
  }
`;

const EditModal = ({
  itemToEdit,
  displayEditBox,
  hideDisplayEditBox,
  editItem
}) => {

    const [itemName, setItemName] = useState("");
    const [itemQuantity, setItemQuantity] = useState("");

    const eraseItemData = () => {
      setTimeout(()=>{
        setItemName("");
      setItemQuantity("");
      },0);
    }

  return (
    <>
      <EditModalSection style={{ display: displayEditBox }}>
        <div class="card border border-dark border-3">
          <div class="card-body">
            <form onSubmit={(e)=>editItem(e, itemName, itemQuantity, itemToEdit)}>
            <div class="mb-3">
              <h5>
                Edit Item: {itemToEdit.itemName} / {itemToEdit.itemQuantity}
              </h5>
              <label for="exampleInputEmail1" class="form-label">
                Item Name
              </label>
              <input type="text" class="form-control" id="itemName" value={itemName} onChange={(e)=>setItemName(e.target.value)}/>
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                Item Quantity
              </label>
              <input type="text" class="form-control" id="itemQuantity" value={itemQuantity} onChange={(e)=>setItemQuantity(e.target.value)}/>
            </div>
            <button
              type="button"
              class="btn btn-secondary me-2"
              onClick={hideDisplayEditBox}
            >
              Cancle
            </button>
            <button
              type="submit"
              class="btn save-changes"
              onClick={eraseItemData}
            >
              Save Changes
            </button>
            </form>
          </div>
          
        </div>
      </EditModalSection>
    </>
  );
};

export default EditModal;
