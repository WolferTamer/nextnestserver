import React from 'react';
import {ChangeEvent} from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Cookies from 'universal-cookie';

import { useNavigate } from "react-router-dom";


const Signup = () => {
    let navigate = useNavigate()
    let [password, setPassword] = React.useState('') 
    let [email, setEmail] = React.useState('')
    let [username, setUsername] = React.useState('')
    let [loading, setLoading] = React.useState(false)
    let [errors, setErrors] = React.useState({})

    const handleSignup = (event) => {
        let emailvalid = validateEmail(email)
        let passwordvalid = validatePassword(password)
        if(email.length == 0) {
            errors.email = `Please enter an email`
            setErrors(errors)
        }
        else if(!emailvalid) {
            errors.email = `Please enter a valid email such as example@email.com`
            setErrors(errors)
        } 
        else {
            delete errors.email
        }
        if(password.length == 0) {
            errors.password = `Please enter a password`
            setErrors(errors)
        }
        else if(!passwordvalid) {
            errors.password = `The password must be at least 8 characters long and have a special character, a number, and a letter.`
            setErrors(errors)
        } else {
            delete errors.password
        }

        if(username.length == 0) {
            errors.username = `Please enter a username`
            setErrors(errors)
        }else {
            delete errors.username
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
            password: password,
            username: username
        }
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        setLoading(true)

        fetch("/api/user", requestOptions)
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
                    console.log(result)
                    const cookies = new Cookies();
                    cookies.set('token', result.auth, { path: '/' });
                    cookies.set('username', username, { path: '/' });
                    cookies.set('userid', result.user, { path: '/' });
                    navigate(`/`)
                }
                setLoading(false);
            })
            .catch((error) => console.error(error));
    }

    const validateEmail = (testEmail) => {
        let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(testEmail)
    }

    const validatePassword = (testPassword) => {
        let re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        return re.test(testPassword)
    }

    const onEmailChange = (event) => {
        let newEmail = event.target.value
        let emailvalid = validateEmail(newEmail)
        setEmail(newEmail)
        if(newEmail.length == 0) {
            errors.email = `Please enter an email`
            setErrors(errors)
        }
        else if(!emailvalid) {
            errors.email = `Please enter a valid email such as example@email.com`
            setErrors(errors)
        } 
        else {
            delete errors.email
        }
    }

    const onPasswordChange = (event) => {
        let newPassword = event.target.value
        let passwordvalid = validatePassword(newPassword)
        setPassword(newPassword)
        if(newPassword.length == 0) {
            errors.password = `Please enter a password`
            setErrors(errors)
        }
        else if(!passwordvalid) {
            errors.password = `The password must be at least 8 characters long and have a special character, a number, and a letter.`
            setErrors(errors)
        } else {
            delete errors.password
        }
    }

    const onUsernameChange = (event) => {
        let newUsername = event.target.value
        setUsername(newUsername)
        if(newUsername.length == 0) {
            errors.username = `Please enter a username`
            setErrors(errors)
        }else {
            delete errors.username
        }
    }

    return (
    <div><Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={onEmailChange} disabled={loading} isInvalid={errors.email}/>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
                {errors.email}
            </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" value={username} onChange={onUsernameChange} disabled={loading} isInvalid={errors.username}/>
            <Form.Control.Feedback type="invalid">
                {errors.username}
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
    <a href="/login">Click Here If You Already Have An Account</a>
    </div>)
}

export default Signup