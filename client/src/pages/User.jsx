//Add loading page to display while waiting for change
//if error on load, revert to original salary
//error should be moved to seperate variable instead of being inside user.


import { useParams } from 'react-router-dom';
import React from "react";
import logo from "/vite.svg";
import "../App.css";
import "../City.css"
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";

const User = () => {
  let navigate = useNavigate()
  const { id } = useParams();
  let cookies = new Cookies()
  const token = localStorage.getItem('token')
  let [user, setUser] = React.useState({});
  let [ogSalary, setOgSalary] = React.useState(0)
  let [loading,setLoading] = React.useState(false)
  let [errors, setErrors] = React.useState({})
  
  React.useEffect(() => {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    // GET token and submit as header
    fetch(`/api/user?id=${id}`, {method: "GET", headers: headers})
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if(data.error) {
          setErrors({...errors, user: "No User Gathered"})
          return;
        }
        let userInfo = data.user
        setUser(userInfo);
        setOgSalary(userInfo.salary)
      })
      .catch((e) => {
        setErrors({...errors, user: "No User Gathered"})
        console.log(e)
      });
  }, [id]);

  let handleSalary = (event) => {
    let newSalary = event.target.value
    setUser({...user,salary:parseInt(newSalary)})
  }

  let handleSubmit = () => {
    setLoading(true)
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }

    console.log(headers)

    const body = JSON.stringify({
      "salary": user.salary
    })

    const requestOptions = {
      method: "PUT",
      headers: headers,
      body: body,
      redirect: "follow"
  };
    // GET token and submit as header
    fetch(`/api/user?id=${id}`, requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if(data.error) {
          setErrors({...errors, salary: "Salary Unchanged"})
          setUser({...user, salary:ogSalary})
          setLoading(false)
          return;
        }
        let userInfo = data.user
        delete errors.salary
        setErrors({...errors})
        setUser(userInfo);
        setOgSalary(userInfo.salary)
        setLoading(false)
        localStorage.setItem("salary", userInfo.salary)
      })
      .catch((e) => {
        console.log(e)
        setErrors({...errors, salary: "Salary Unchanged"})
        setUser({...user, salary:ogSalary})
        setLoading(false)
      });
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userid')
    navigate("/")
  }

  return (
    <div className="user">
      <header className="user-header">
        <h1>
          {!user ? (<p>Loading</p>): errors.user ? (<p>{errors.user}</p>): user.username}
        </h1>
      </header>
      <div>
        <h4>
          Username
        </h4>
        <p>
          {!user? (<p>Loading</p>): errors.user ? (<p>{errors.user}</p>): user.email}
        </p>
      </div>
      <div>
        <h4>
          User ID
        </h4>
        <p>
          {!user? (<p>Loading</p>): errors.user ? (<p>{errors.user}</p>): user.userid}
        </p>
      </div>
      <Form>
        <Form.Group>
            <Form.Label>Salary</Form.Label>
            <Form.Control type="number" value={user.salary? user.salary : 0} onChange={handleSalary} disabled={loading} isInvalid={errors.salary}></Form.Control>
            <Form.Control.Feedback type="invalid">
                Error changing salary.
            </Form.Control.Feedback>
        </Form.Group>
      </Form>
      <Button onClick={handleSubmit}>
            Submit Changes
      </Button>
      <div>
        <Button variant='danger' onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default User;