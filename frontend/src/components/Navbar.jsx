import { useState } from "react";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { FaPowerOff } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

import styled from "styled-components";

const NavSection = styled.div`
  .dropdown-menu[data-bs-popper] {
    right: 0;
    left: auto;
  }

  @media screen and (max-width: 992px){
  .dropdown-menu[data-bs-popper] {
    left: 0;
    width: 220px;
  }
  }
`

const Navbar = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  useEffect(()=>{
    fetch(`https://mern-todo-list-backend-u2xt.onrender.com/me`, {
      method: "GET",
      credentials: "include",
    }).then((response)=>{
      return response.json();
    }).then((data)=>{
      setFullName(data.fullName);
      setEmail(data.email);
    })
  });

  const logout = () => {
    fetch(`https://mern-todo-list-backend-u2xt.onrender.com/logout`, {
      method: "GET",
      credentials: "include",
    }).then((response)=>{
      return response.json()
    }).then((data)=>{
      console.log(data);
      if(data.message){
        navigate("/login")
      }
    }).catch((err)=>{
      console.log("error during logout", err);
    });
  }
    return(
        <NavSection>
        <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{position: "sticky", top: 0, left: 0, zIndex: 1}}>
  <div className="container-fluid">
    <a className="navbar-brand fw-bold" href="#">Market List</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <NavLink className="nav-link active" aria-current="page" to="/home">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/add">Add Item</NavLink>
        </li>
      </ul>
      <div className="dropdown">
        <button className="btn btn-dark ms-2" data-bs-toggle="dropdown" style={{width: "50px", height: "50px", borderRadius: "50%"}}><FaUser style={{borderRadius: "50%"}}/></button>
        <ul className="dropdown-menu" style={{right: 0}}>
          <li><a href="#" className="dropdown-item"><h5>{fullName}</h5></a></li>
          <li><a href="#" className="dropdown-item"><small className="text-secondary">{email}</small></a></li>
          <li><a href="#" className="dropdown-item" onClick={logout}>Logout <FaPowerOff /></a></li>
        </ul>
      </div>
    </div>
  </div>
</nav>
        </NavSection>
    );
};

export default Navbar;