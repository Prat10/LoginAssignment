import './Login.css'
import { useState} from 'react';
import { useNavigate } from "react-router-dom";
export default function LoginPage(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);

    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
   
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
    const handleLogin= async(e)=>{
        e.preventDefault();
        const res = await fetch('http://localhost:3001/signin', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body:JSON.stringify({
              email,
              password
            })
          });
          const data = await res.json();
        //   console.log(data);
        //   console.log(data.status)
          if (res.status === 400 || !data) {
            window.alert("Invalid Credntials");
          }
          else {
            navigate("/home");
          }
    }
    const handleLoginFormSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
          });
          if (response.ok) {
            setLoginSuccess(true);
          } else {
            alert('Email link has sent');
            const errorData = await response.json();
            console.error(errorData.error);
          }
        } catch (err) {
          console.error('Error logging in:', err);
        }
      };

    return (
        <div className='login-page'>
      <h1>Registration and Login</h1>
      <div className='login-pack'>
        <form method='POST' onSubmit={(!loginSuccess) ? handleLoginFormSubmit : handleLogin}>
             <input className='inpu' type="email" value={email} onChange={handleEmailChange}
              placeholder='Enter Your Email' />
             {loginSuccess &&  ( 
              <input
              type="password" value={password} onChange={handlePasswordChange}
              placeholder='Enter Your Password'>
              </input>)}
              {!loginSuccess ? <button className='button'>Verify</button>: <button className='button'>Login</button>}
        </form>
      </div>
    </div>
    )
}