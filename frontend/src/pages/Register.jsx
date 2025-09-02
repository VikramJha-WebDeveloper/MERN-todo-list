import React, {useState} from "react";
import { NavLink } from "react-router-dom";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  const navigate = useNavigate();

  const collectData = async(e) => {
    e.preventDefault();

    try{
      const response = await fetch(`https://mern-todo-list-backend-fhkl.onrender.com/register`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({fullName, email, password, confirmPassword, isAgreed}),
      });
      const result = await response.json();
      if(result.message){
        toast.success(result.message);
        navigate("/login")
      }else if(result.errorMessage){
        toast.error(result.errorMessage);
      }else{
        toast.error("Something goes wrong");
      }

    }catch(err){
      console.log(err);
    }
  } 

    return(
        <>
        <div class="container vh-100">
    <div class="row justify-content-center h-100">
      <div class="col-md-5 col-sm-10 d-flex align-items-center justify-content-center flex-column">
        <div class="card shadow-sm w-100">
          <div class="card-body">
            <h5 className="text-center fw-bold">Todo List</h5>
            <h3 class="text-center mb-4">Register</h3>
            <form onSubmit={collectData}>
              <div class="mb-3">
                <label for="fullname" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="fullname" placeholder="Enter full name" value={fullName} onChange={(e)=>setFullName(e.target.value)}/>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input type="email" class="form-control" id="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Create password" value={password} onChange={(e)=>setPassword(e.target.value)} />
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
              </div>
              <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="terms" checked={isAgreed} onChange={()=>setIsAgreed(isAgreed?false:true)}/>
                <label class="form-check-label" for="terms">I agree to the terms and conditions</label>
              </div>
              <button type="submit" class="btn btn-primary w-100">Register</button>
            </form>
          </div>
        </div>
        <p class="text-center mt-3">
          Already have an account? <NavLink to="/login">Login here</NavLink>
        </p>
      </div>
    </div>
  </div>
        </>
    );
};

export default Register;