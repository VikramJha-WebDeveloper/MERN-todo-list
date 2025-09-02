import React from "react";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// import components
import Loading from "../components/Loading";

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
    fetch(`https://mern-todo-list-backend-u2xt.onrender.com/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);
        if (data.errorMessage) {
          navigate("/login");
          return;
        }
        console.log(data);
        setUser(data);
      });
  }, []);

  return isLoading ? (
    <Loading />
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
