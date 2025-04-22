// client/src/App.js

import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../App.css";
import questions from "../assets/questions.json"
import MultipleChoice from "../components/MultipleChoice";
import Scale from "../components/Scale";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

function generateUniqueRandomNumbers(count, min, max) {
  if (max - min + 1 < count) {
    throw new Error("Range is smaller than the number of requested unique numbers.");
  }

  const uniqueNumbers = new Set();
  while (uniqueNumbers.size < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    uniqueNumbers.add(randomNumber);
  }
  return Array.from(uniqueNumbers);
}

function Questions() {
  const navigate = useNavigate()
  const [curQuestion, setCurQuestion] = useState(0)
  const [questionValues, setQuestionValues] = useState([])
  
  let [questionOrder, setQuestionOrder] = useState([])
  const [canSubmit, setCanSubmit] = useState(true)
  const [error, setError] = useState(null)
  const handleValueChange = (index,value) => {
    questionValues[index] = parseFloat(value)
    setQuestionValues(questionValues)
    setCanSubmit(questionValues.includes(null))
  }

  useEffect(() => {
    let order
    try {
      order = generateUniqueRandomNumbers(5,0,questions.length ? questions.length-1 : 0)
      setQuestionOrder(order)
    } catch {
      order = [0,1,2,3,4]
      setQuestionOrder(order)
    }
    let values = []
    for(let x = 0; x < order.length; x++) {
      let i = order[x]
      if(questions[i].type === "multiple-choice") {
        values.push(null)
      }
      else if (questions[i].type === "scale") {
        values.push(0)
      }
    }
    setQuestionValues(values)
  }, [])

  const handleClick = (key) => {
    setCurQuestion(key)
  }

  const handleSubmit = () => {
    setError(null)
    let answers = {}
    let counts = {}
    for(let i = 0; i < questionValues.length; i++) {
      let r = questionValues[i]
      let question = questions[questionOrder[i]]
      if(r == null) {
        return
      }
      if(!answers[question.key]) {
        answers[question.key] = 0
      }
      answers[question.key] += r

      if(!counts[question.key]) {
        counts[question.key] = 0
      }
      counts[question.key] += 1
    }
    for(let key of Object.keys(answers)) {
      answers[key] = (answers[key]/(counts[key]*5))*2
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(answers),
      redirect: "follow"
    };

    fetch(`${import.meta.env.VITE_AI_SERVER}/search`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if(result) {
          navigate('/results', {state:{cities:result}})
        }
      })
      .catch((error) => {
        console.error(error)
        setError(error)
      });
  }

  return (
    <div className="Questions">
      {questionOrder.map((i,x) => {
        if (curQuestion != x) {return}
        if(questions[i].type === "multiple-choice") {
          return (<MultipleChoice className={curQuestion == x ? "" : "invisible"} title={questions[i].question} options={questions[i].options} defaultValue={questionValues[x]} index={x} callback={handleValueChange}/>)
        }
        else if (questions[i].type === "scale") {
          return (<Scale className={curQuestion == x ? "" : "invisible"} title={questions[i].question} max={questions[i].max} min={questions[i].min} step={questions[i].step} defaultValue={questionValues[x]} index={x} callback={handleValueChange}/>)
        }
      })}
      <Pagination>
        <Pagination.Prev onClick={()=> handleClick(Math.max(curQuestion-1,0))} key={-1}></Pagination.Prev>
        {questionValues.map((obj,i) => (<Pagination.Item onClick={()=> handleClick(i)} key={i} active={curQuestion==i}>{i+1}</Pagination.Item>))}
        <Pagination.Next onClick={()=> handleClick(Math.min(curQuestion+1, questionOrder.length))} key={100}></Pagination.Next>
      </Pagination>
      <Button onClick={handleSubmit} disabled={canSubmit}>
        Submit
      </Button>
      {
        error ? 
        (<Alert key="danger" variant="danger" onClose={() => {setError(null)}} dismissible>
            An error occured while submitting! Please try again.
        </Alert>) : ""
      }
    </div>
  );
}

export default Questions;