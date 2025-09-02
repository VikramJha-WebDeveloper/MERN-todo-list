import React from "react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const HomeSection = styled.div`
  background-image: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
  overflow: hidden;
`;

const Home = () => {
  const [user, setUser] = useState({ fullName: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
        fetch(`https://mern-todo-list-backend-fhkl.onrender.com/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.errorMessage) {
          setIsLoading(false);
          navigate("/login");
          return;
        }
        setIsLoading(false);
        console.log(data);
        setUser(data);
      });
  }, []);

  return isLoading ? (
    <div className="container vh-100">
        <div className="row h-100">
            <div className="col col-12 d-flex align-items-center justify-content-center">
              <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-warning" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-info" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="spinner-grow text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>  
            </div>
        </div>
    </div>
  ) : (
    <HomeSection className="vh-100">
      <Navbar />
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="text-light col col-12 h-100 d-flex align-items-center justify-content-center flex-column">
            <h1>Welcome back, {user.fullName} 👋</h1>
            <p>
              Here’s your smart shopping assistant. Let’s keep your market list
              up to date!
            </p>
            <button className="btn btn-dark" onClick={() => navigate("/add")}>
              Start Adding Items
            </button>
          </div>
        </div>
      </div>
    </HomeSection>
  );
};

export default Home;
