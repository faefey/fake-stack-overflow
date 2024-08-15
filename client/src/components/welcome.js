import {ErrorBoundary} from "react-error-boundary";
import {useState, useEffect} from 'react';
import axios from 'axios';
import FormDiv from './formdiv.js';
import FakeStackOverflow from './fakestackoverflow.js'

import {register, login} from '../handle.js'

/**
 * Welcome page that allows users to register, login, or continue as a guest.
 */
export default function Welcome() {
  const [display, setDisplay] = useState("loading");

  const [fields, setFields] = useState({
    username: "",
    email: "",
    password: "",
    reenter: ""
  });
  
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
    reenter: ""
  });

  // attempt to log the user in using session cookies
  useEffect(() => {
    axios.post('http://localhost:8000/login', {}, {withCredentials: true})
      .then(res => {
        if(res.data === "success")
          setDisplay("loggedin");
        else
          setDisplay("welcome");
      });
  }, []);

  // handle function to register the user
  function handleRegister() {
    if(display !== "register")
      setDisplay("register");
    else
      register(setDisplay, fields, setFieldErrors);
  }

  // handle function to log in the user
  function handleLogin() {
    if(display !== "login")
      setDisplay("login");
    else
      login(setDisplay, fields, setFieldErrors);
  }

  // handle function to allow the user to continue as a guest
  function handleGuest() {
    setDisplay("guest");
  }

  // handle function to reset states upon clicking back button
  function handleBack() {
    setFields({username: "", email: "", password: "", reenter: ""});
    setFieldErrors({username: "", email: "", password: "", reenter: ""});
    setDisplay("welcome");
  }

  // handle function to update username state
  function handleUsernameChange(e) {
    setFields({...fields, username: e.target.value});
  }

  // handle function to update email state
  function handleEmailChange(e) {
    setFields({...fields, email: e.target.value});
  }

  // handle function to update password state
  function handlePasswordChange(e) {
    setFields({...fields, password: e.target.value});
  }

  // handle function to update reenter state
  function handleReenterChange(e) {
    setFields({...fields, reenter: e.target.value});
  }

  // show next page based on user input and whether the user is logged in
  switch(display) {
    case "loading":
      return (
        <div className="welcome"></div>
      );
    case "error":
      return (
        <div className="welcome">
          <h1 id="welcome">Something went wrong.</h1>
          <button className="click" onClick={handleRegister}>Register as a New User</button>
          <button className="click" onClick={handleLogin}>Login as an Existing User</button>
          <button className="click" onClick={handleGuest}>Continue as a Guest User</button>
        </div>
      );
    case "welcome":
      return (
        <div className="welcome">
          <h1 id="welcome">Welcome</h1>
          <button className="click" onClick={handleRegister}>Register as a New User</button>
          <button className="click" onClick={handleLogin}>Login as an Existing User</button>
          <button className="click" onClick={handleGuest}>Continue as a Guest User</button>
        </div>
      );
    case "register":
      return (
        <form className="welcome">
          <FormDiv h1="Username" p="" rows={"1"} onchange={handleUsernameChange} error={fieldErrors.username} />
          <FormDiv h1="Email" p="" rows={"1"} onchange={handleEmailChange} error={fieldErrors.email} />
          <FormDiv h1="Password" p="" rows={"1"} onchange={handlePasswordChange} error={fieldErrors.password} />
          <FormDiv h1="Reenter Password" p="" rows={"1"} onchange={handleReenterChange} error={fieldErrors.reenter} />
          <button className="click" type="button" onClick={handleRegister}>Sign Up</button>
          <button className="click" type="button" onClick={handleBack}>Back</button>
        </form>
      );
    case "login":
      return (
        <form className="welcome">
          <FormDiv h1="Email" p="" rows={"1"} onchange={handleEmailChange} error={fieldErrors.email} />
          <FormDiv h1="Password" p="" rows={"1"} onchange={handlePasswordChange} error={fieldErrors.password} />
          <button className="click" type="button" onClick={handleLogin}>Log In</button>
          <button className="click" type="button" onClick={handleBack}>Back</button>
        </form>
      );
    case "loggedin":
      return (
        <ErrorBoundary FallbackComponent={Welcome} onError={(error) => setDisplay("error")}>
          <FakeStackOverflow logout={() => axios.post('http://localhost:8000/logout', {}, {withCredentials: true}).then(setDisplay("welcome"))} />
        </ErrorBoundary>
      );
    case "guest":
      return (
        <ErrorBoundary FallbackComponent={Welcome} onError={(error) => setDisplay("error")}>
          <FakeStackOverflow logout={null} />
        </ErrorBoundary>
      );
    default:
  }
}
