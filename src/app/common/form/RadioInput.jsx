import React from 'react';
import { Form } from 'semantic-ui-react';

const RadioInput = ({input, type, label, width}) => {
  return (
    <Form.Field>
        <div className='ui radio checkbox'>
            <input {...input} type={type} />{' '}
            <label>{label}</label>
        </div>
    </Form.Field>
  )
}

export default RadioInput;
