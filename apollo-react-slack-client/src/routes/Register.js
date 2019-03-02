import React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
//semantic ui componants
import {
  Form,
  Message,
  Button,
  Input,
  Container,
  Header
} from "semantic-ui-react";

class Register extends React.Component {
  state = {
    username: "",
    usernameError: "",
    email: "",
    emailError: "",
    password: "",
    passwordError: ""
  };

  onSubmit = async () => {
    this.setState({
      usernameError: "",
      emailError: "",
      passwordError: ""
    });
    //the variable which we have to pass
    const { username, email, password } = this.state;

    //the mutation can be accessed by the props
    //here I change the mutation name so
    //I can use the name insted of mutation
    //async and await  will not stop the process
    //basical the mutation return a promise
    const response = await this.props.mutate({
      //onlly the varibles we want
      variables: { username, email, password }
    });
    console.log(response);

    //taking the errors from the response
    //response.data.register the errors accessed
    const { ok, errors } = response.data.register;

    if (ok) {
      //if its successfull rederect to home page
      //the history comes from the react router
      this.props.history.push("/");
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        //err['passwordError']='message'
        //what ever error comes it will gothourgh
        //that return the message
        err[`${path}Error`] = message;
      });
      console.log("err", err);
      //here the emailError usernameError and the passwordError
      //'s states are set to the errors which occurs
      this.setState(err);
    }
  };

  onChange = e => {
    //get the name and the vale of the input
    const { name, value } = e.target;

    //set the new value to the new state
    //setState() method
    //[name] so the onchange mwthode will not be repeated
    //according to each input name
    this.setState({ [name]: value });
  };

  render() {
    //the args are accessed using this.state
    //if the value changes the state will be updated
    const {
      username,
      password,
      email,
      usernameError,
      emailError,
      passwordError
    } = this.state;
    //!!''=false it's not taking automatically
    //so use !! this will changes the string to a boolean false

    //if the error are present pushto the list to show the errors to the user
    const errorList = [];

    if (usernameError) {
      errorList.push(usernameError);
    }

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }
    return (
      <Container text>
        <Header as="h2">Register</Header>
        <Form>
          <Form.Field error={!!usernameError}>
            <Input
              name="username"
              onChange={this.onChange}
              value={username}
              placeholder="Username"
              fluid
            />
          </Form.Field>
          <Form.Field error={!!emailError}>
            <Input
              name="email"
              onChange={this.onChange}
              value={email}
              placeholder="Email"
              fluid
            />
          </Form.Field>
          <Form.Field error={!!passwordError}>
            <Input
              name="password"
              type="password"
              onChange={this.onChange}
              value={password}
              placeholder="Password"
              fluid
            />
          </Form.Field>
          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>
        {errorList.length ? (
          <Message
            error
            header="There was some error with submisstion"
            list={
              //the errors comes from the errorList
              errorList
            }
          />
        ) : null}
      </Container>
    );
  }
}

//mutation
const registerMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

//bind the mutation with component as a prop
export default graphql(registerMutation)(Register);
