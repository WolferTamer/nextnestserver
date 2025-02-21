//Will start with just displaying information (User ID, Username, Email)
//Dropdown for salary, or int input
//Other options to be decided
// client/src/App.js
import { useParams } from 'react-router-dom';
import React from "react";
import logo from "/vite.svg";
import "../App.css";
import "../City.css"
import Cookies from 'universal-cookie';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const User = () => {
  const { id } = useParams();
  let cookies = new Cookies()
  const token = cookies.get('token', {path:'/'})
  console.log(token)
  const [user, setUser] = React.useState({});
  
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
          setUser({error:"No User Info"})
          return;
        }
        let userInfo = data.user
        setUser(userInfo);
      })
      .catch((e) => {
        console.log(e)
      });
  }, [id]);

  let handleSalary = (event) => {
    let newSalary = event.target.value
    setUser({...user,salary:parseInt(newSalary)})
  }

  let handleSubmit = () => {
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
          setUser({error:"User Not Updated"})
          return;
        }
        let userInfo = data.user
        setUser(userInfo);
      })
      .catch((e) => {
        console.log(e)
      });
  }

  return (
    <div className="user">
      <header className="user-header">
        <h1>
          {!user ? (<p>Loading</p>): user.error ? (<p>{user.error}</p>): user.username}
        </h1>
      </header>
      {!user ? (<p>Loading</p>): user.error ? (<p>"404 Not Found"</p>): 
      (<table id="user-table">
        <caption>User</caption>
        <tbody>
          
          
            {Object.keys(user).map((key) => (
              <tr>
                <td id={key}  className='table-header'>{key}</td>
                <td>{user[key]}</td>
              </tr>
            ))}
        </tbody>
      </table>)}
      <Form>
        <Form.Group>
            <Form.Label>Salary</Form.Label>
            <Form.Control type="number" value={user.salary? user.salary : 0} onChange={handleSalary}></Form.Control>
        </Form.Group>
      </Form>
      <Button onClick={handleSubmit}>
            Submit Changes
      </Button>
    </div>
  );
}

export default User;