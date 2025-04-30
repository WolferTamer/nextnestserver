import React, { useState } from "react";
import "../App.css";
import Form from "react-bootstrap/Form";

function MultipleChoice(params) {
  let options = params.options
  let title = params.title
  let callback = params.callback
  let [value,setValue] = useState( params.defaultValue)
  let key = params.index
  
  const onChoose = (e) => {
    callback(key,e.target.value)
    setValue(e.target.value)
  }

  return (
    <div className="multiple-choice">
      <div>
        <h1 className="mx-auto center-text">{title}</h1>
        <Form className="center-text">
            <Form.Group>
                {options.map( (opt) =>
                (<Form.Check className="multi-choice-option" type="radio" name="multi-choice" label={opt.text} value={opt.value} checked={opt.value == value} onClick={onChoose}/>)
                )}
            </Form.Group>
        </Form>
      </div>
    </div>
  );
}

export default MultipleChoice;