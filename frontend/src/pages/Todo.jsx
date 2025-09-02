import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import styled from "styled-components";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// import modals
import DeleteModal from "../modals/DeleteModal";
import EditModal from "../modals/EditModal";

// import images
import EmptyClipboard from "/empty-clipboard.png";
import Loading from "../components/Loading";

const TodoSection = styled.div`
  background-image: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
  height: 100vh;

  .items-card {
    max-height: 70vh;
    overflow-y: scroll;
  }

  .form-check-input:checked {
    background-color: #5cb85c;
    border-color: #5cb85c;
  }
`;

const Todo = () => {
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [user, setUser] = useState("");

  const [itemToDelete, setItemToDelete] = useState("");
  const [displayDeleteBox, setDisplayDeleteBox] = useState("none");

  const [itemToEdit, setItemToEdit] = useState("");
  const [displayEditBox, setDisplayEditBox] = useState("none");

  const [isLoading, setIsLoading] = useState(false);

  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://mern-todo-list-backend-u2xt.onrender.com/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.errorMessage) {
          navigate("/login");
        }
        console.log(data);
        setUser(data);

        fetch(`https://mern-todo-list-backend-u2xt.onrender.com/showItems`, {
          method: "GET",
          credentials: "include",
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            setIsLoading(false);
            if(data.errorMessage){
              toast.error(data.errorMessage);
              return;
            }
            console.log("showItems", data);
            setItems(data.items);
          });
      });
  }, []);

  const collectData = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://mern-todo-list-backend-u2xt.onrender.com/addItem`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ itemName, itemQuantity }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.message) {
        toast.success(result.message);
        setItems((prevItem) => {
          return [...prevItem, result.newItem];
        });
        setTimeout(()=>{
          setItemName("");
          setItemQuantity("")
        }, 0);
      } else if (result.errorMessage) {
        toast.error(result.errorMessage);
      } else {
        toast.error("Something goes wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const processToDelete = (item) => {
    setItemToDelete(item);
    setDisplayDeleteBox("flex");
  };

  const hideDisplayDeleteBox = () => {
    setDisplayDeleteBox("none");
  };

  const deleteItem = async (item) => {
    console.log(item);
    try {
      const response = await fetch(`https://mern-todo-list-backend-u2xt.onrender.com/deleteItem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
        credentials: "include",
      });
      const result = await response.json();
      if (result.message) {
        toast.success(result.message);
        setItems((prevItems) => {
          return prevItems.filter((i) => {
            return i._id !== item._id;
          });
        });
        hideDisplayDeleteBox();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const processToEdit = (item) => {
    setItemToEdit(item);
    setDisplayEditBox("flex");
  };

  const hideDisplayEditBox = () => {
    setDisplayEditBox("none");
  };

  const editItem = async (e, itemName, itemQuantity, itemToEdit) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://mern-todo-list-backend-u2xt.onrender.com/editItem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName, itemQuantity, itemToEdit }),
      });
      const result = await response.json();
      if (result.message) {
        setItems((prevItems) => {
          return prevItems.map((i) => {
            if (i._id === itemToEdit._id) {
              return { ...i, itemName: itemName, itemQuantity: itemQuantity };
            }
            return i;
          });
        });
        hideDisplayEditBox();
        toast.success(result.success);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateCompletionStatus = async (item, e) => {
    try {
      const response = await fetch(`https://mern-todo-list-backend-u2xt.onrender.com/updateComplete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
        credentials: "include",
      });

      const result = await response.json();
      console.log(result.status);

      setItems((prevItems) => {
        return prevItems.map((i) => {
          if (i._id === item._id) {
            return {
              ...i,
              isCompleted: result.status,
            };
          }
          return i;
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TodoSection>
      <Navbar />
      <div className="container-fluid">
        <div className="row h-100">
          <div className="col h-100">
            <div className="card mt-3">
              <div className="card-body">
                <form onSubmit={collectData}>
                  <div className="row">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Item Name"
                        id="itemName"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Item Quantity"
                        id="itemQuantity"
                        value={itemQuantity}
                        onChange={(e) => setItemQuantity(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <button type="submit" className="btn btn-dark">
                        Add
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="card mt-3 items-card">
              <div className="card-body">
                <table className="table text-center">
                  {isLoading?<Loading />:<>{items.length === 0 ? (
                    <div>
                      <div className="display-6 text-secondary">
                        Start by adding your first task!
                      </div>
                      <img src={EmptyClipboard} style={{opacity: "0.5"}} />
                    </div>
                  ) : (
                    <>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Item Name</th>
                          <th>Item Quantity</th>
                          <th>Completed</th>
                          <th>Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={item._id}>
                            <th scope="row">{index + 1}</th>
                            <td>{item.itemName}</td>
                            <td>{item.itemQuantity}</td>
                            <td>
                              <div className="form-check d-flex align-items-center justify-content-center">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="checkDefault"
                                  checked={item.isCompleted}
                                  onChange={(e) =>
                                    updateCompletionStatus(item, e)
                                  }
                                />
                              </div>
                            </td>
                            <td>
                              <FaEdit
                                style={{ cursor: "pointer", color: "#6c757d" }}
                                onClick={() => processToEdit(item)}
                              />
                            </td>
                            <td>
                              <MdDelete
                                style={{ cursor: "pointer", color: "red" }}
                                // onClick={() => deleteItem(item)}
                                onClick={() => processToDelete(item)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )}</>}
                  
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        itemToDelete={itemToDelete}
        displayDeleteBox={displayDeleteBox}
        deleteItem={deleteItem}
        hideDisplayDeleteBox={hideDisplayDeleteBox}
      />

      <EditModal
        itemToEdit={itemToEdit}
        displayEditBox={displayEditBox}
        hideDisplayEditBox={hideDisplayEditBox}
        editItem={editItem}
      />
    </TodoSection>
  );
};

export default Todo;
