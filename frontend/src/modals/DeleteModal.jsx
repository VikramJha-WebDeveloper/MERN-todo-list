import React from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const DeleteModalSection = styled.div`
width: 100%;
height: 100%;
position: absolute;
top: 0;
left: 0;
display: flex;
align-items: center;
justify-content: center;
background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));

`

const DeleteModal = ({itemToDelete, displayDeleteBox, deleteItem, hideDisplayDeleteBox}) => {
    return(
        <>
        <DeleteModalSection style={{display: displayDeleteBox}}>
            <div class="card">
                          <div class="card-body">
                            <h5 class="card-title">Delete {itemToDelete.itemName}</h5>
                            <p class="card-text">
                              Do you really want to delete this item?
                            </p>
                            
                            <a href="#" class="btn btn-secondary me-2" onClick={()=>hideDisplayDeleteBox()}>
                              Cancel
                            </a>
                            <a href="#" class="btn btn-danger" onClick={()=>deleteItem(itemToDelete)}>
                              Delete
                            </a>
                          </div>
                        </div>
        </DeleteModalSection>
        </>
    );
};

export default DeleteModal;