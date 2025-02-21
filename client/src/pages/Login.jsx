import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import React from 'react';
import Cookies from 'universal-cookie';


const Login = () => {
    let navigate = useNavigate()
    let [password, setPassword] = React.useState('') 
    let [email, setEmail] = React.useState('')
    let [loading, setLoading] = React.useState(false)
    let [errors, setErrors] = React.useState({})
    const handleLogin = (event) => {
        event.preventDefault()
    }

    const onEmailChange = (event) => {
        let newEmail = event.target.value
        setEmail(newEmail)
        if(newEmail.length == 0) {
            errors.email = `Please enter an email`
            setErrors(errors)
        }
        else {
            delete errors.email
        }
    }

    const onPasswordChange = (event) => {
        let newPassword = event.target.value
        setPassword(newPassword)
        if(newPassword.length == 0) {
            errors.password = `Please enter a password`
            setErrors(errors)
        }else {
            delete errors.password
        }
    }

    const handleSignup = (event) => {
            if(email.length == 0) {
                errors.email = `Please enter an email`
                setErrors(errors)
            }
            else {
                delete errors.email
            }
            if(password.length == 0) {
                errors.password = `Please enter a password`
                setErrors(errors)
            }
            else {
                delete errors.password
            }
    
            const keys = Object.keys(errors)
            if(keys.length > 0) {
                return;
            }
    
    
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
    
            const raw = JSON.stringify({
            user: {
                email: email,
                password: password
            }
            });
    
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };
    
            setLoading(true)
    
            fetch("/api/auth", requestOptions)
                .then((response) => {return response.json()})
                .then((result) => {
                    
                    if(result.error) {
                        if(result.error.toLowerCase().includes("email")) {
                            console.log("email error")
                            errors.email = result.error;
                            setErrors({...errors})
                        } else {
                            console.log("password error")
                            errors.password = result.error;
                            setErrors({...errors})
                        }
                    } else {
                        console.log(result.user.username)
                        const cookies = new Cookies();
                        cookies.set('token', result.auth, { path: '/' });
                        cookies.set('username', result.user.username, { path: '/' });
                        cookies.set('userid', result.user.userid, { path: '/' });
                        navigate(`/`)
                    }
                    setLoading(false);
                })
                .catch((error) => console.error(error));
        }

    return (<div>
        <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={onEmailChange} disabled={loading} isInvalid={errors.email}/>
                <Form.Control.Feedback type="invalid">
                    {errors.email}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={onPasswordChange} disabled={loading} isInvalid={errors.password}/>
                <Form.Control.Feedback type="invalid">
                    {errors.password}
                </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="button" onClick={handleSignup} disabled={Object.keys(errors).length > 0}>
                Submit
            </Button>
        </Form>
        <a href="/signup">Click Here If You Need To Create An Account</a>
    </div>)
}

export default Login