import React, { useState } from "react";
import "../App.css";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image"

function Scale(params) {
  let title = params.title
  let max = params.max 
  let maxtext = params.maxtext
  let mintext = params.mintext
  let min = params.min
  let step = params.step
  let callback = params.callback
  const  [value, setValue] = useState(params.defaultValue)
  let key = params.index
  const onChange = (e) => {
    callback(key,e.target.value)
    setValue(e.target.value)
  }

  return (
    <div className="scale">
      <div>
        <h1 className="center-text">{title}</h1>
        <Form>
            <Form.Label htmlFor={title} className="float-start h2">{mintext}</Form.Label>
            <Form.Label htmlFor={title} className="float-end h2">{maxtext}</Form.Label>
            <Form.Range id={title} className="slider" max={max} min={min} step={step} value={value} onChange={onChange}/>
        </Form>
      </div>
    </div>
  );
}

export default Scale;