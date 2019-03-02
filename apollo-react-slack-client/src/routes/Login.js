import React from "react";
import { extendObservable } from "mobx";
import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { observer } from "mobx-react";
import {
  Form,
  Button,
  Input,
  Container,
  Header,
  Message
} from "semantic-ui-react";
//using mobx state management

//if the some of the componet imported but not used
//the app will not response

//react knows only the constructor and the render
//other functions used by bind or anonymus functions
//the class is located inside observer
//export default observer(
class Login extends React.Component {
  constructor(props) {
    super(props);

    //insted of this.state this will used
    //initial state
    extendObservable(this, {
      email: "",
      password: "",
      emailError: "",
      errors: {}
    });
  }

  onSubmit = async () => {
    const { email, password } = this;
    const response = await this.props.mutate({
      variables: { email, password }
    });
    console.log(response);

    //saving the token in local storage
    const { ok, token, refreshToken, errors } = response.data.login;
    if (ok) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      //redirecting to home
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
      //this how setting the state in mobx
      this.errors = err;
    }
  };

  //getting the value from the user input
  onChange = e => {
    const { name, value } = e.target;
    this[name] = value; //no need setstate because of mobx
  };

  render() {
    //insted of this.state this will be added
    const { email, password, errors: { emailError, passwordError } } = this;

    const errorList = [];

    if (emailError) {
      errorList.push(emailError);
    }

    if (passwordError) {
      errorList.push(passwordError);
    }

    return (
      <Container text>
        <Header as="h2">Login</Header>
        <Form>
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
          <Button onClick={this.onSubmit}>Login</Button>
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

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;
//smart componant with mobx
export default graphql(loginMutation)(observer(Login));
