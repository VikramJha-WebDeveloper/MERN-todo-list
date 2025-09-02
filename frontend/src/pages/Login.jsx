import React, {useState, useEffect} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRemembered, setIsRemembered] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
      fetch("https://mern-todo-list-backend-u2xt.onrender.com/me", {
      method: "GET",
      credentials: "include",
    }).then((response)=>{
      return response.json();
    }).then((data)=>{
      console.log(data);
      if(data.fullName && data.email){
        navigate("/home")
      }
    }).catch((err)=>{
      console.log(err);
    })
  }, []);

  const collectData = async(e)=>{
    e.preventDefault();
    setIsLoading(true);
      try{
      const response = await fetch(`https://mern-todo-list-backend-u2xt.onrender.com/login`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({email, password, isRemembered}),
        credentials: "include"
      });
      const result = await response.json();
      if(result.message){
        setIsLoading(false);
        toast.success(result.message);
        navigate("/home");
      }else if(result.errorMessage){
        toast.error(result.errorMessage);
      }else{
        toast.error("Something goes wrong")
      }
    }catch(err){
      console.log(err);
    }
  }
    return(
        <>
        <div class="container vh-100">
    <div class="row justify-content-center h-100">
      <div class="col-md-4 col-sm-8 d-flex align-items-center justify-content-center flex-column">
      {isLoading?<div>
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
    </div>:<><div class="card shadow-sm w-100">
          <div class="card-body">
            <h5 className="text-center fw-bold">Todo List</h5>
            <h3 class="text-center mb-4">Login</h3>
            <form onSubmit={collectData}>
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <input type="email" class="form-control" id="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="remember" checked={isRemembered} onChange={(e)=>setIsRemembered(isRemembered?false:true)}/>
                <label class="form-check-label" for="remember">Remember me</label>
              </div>
              <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>
          </div>
        </div>
        <p class="text-center mt-3">
          Don't have an accout? <NavLink to="/register">Register here</NavLink>
        </p></>}
        
      </div>
    </div>
  </div>

        </>
    );
};

export default Login;