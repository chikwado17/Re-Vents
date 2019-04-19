import React from 'react';
import { connect } from 'react-redux';
import {registerUser} from '../authActions';
import { combineValidators, isRequired } from 'revalidate';
import { Form, Segment, Button, Label, Divider} from 'semantic-ui-react';
import { Field, reduxForm} from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import SocialLogin from '../SocialLogin/SocialLogin';


const mapDispatchToProps = {
  registerUser
}

//form validation
const validate = combineValidators({
  displayName: isRequired('displayName'),
  email: isRequired('email'),
  password: isRequired('password')
})

                      //having access to handleSubmit from redux-form pass down to Form
const RegisterForm = ({ handleSubmit, registerUser , error, invalid, submitting }) => {
  return (
                    
      <Form size="large" onSubmit={handleSubmit(registerUser)}>
        <Segment>
          <Field
            name="displayName"
            type="text"
            component={TextInput}
            placeholder="Known As"
          />
          <Field
            name="email"
            type="text"
            component={TextInput}
            placeholder="Email"
          />
          <Field
            name="password"
            type="password"
            component={TextInput}
            placeholder="Password"
          />
          {error && <Label basic color='red'>{error}</Label>}
                          {/* invalid or trying to submit set the button to disabled */}
          <Button disabled={ invalid || submitting } fluid size="large" color="teal">
            Register
          </Button>
          <Divider horizontal>
            OR
          </Divider>
          <SocialLogin/>
        </Segment>
      </Form>
 
  );
};

export default connect(null,mapDispatchToProps)(reduxForm({form:'registerForm',validate})(RegisterForm));