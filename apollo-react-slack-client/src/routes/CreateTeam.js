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
class CreateTeam extends React.Component {
  constructor(props) {
    super(props);

    //insted of this.state this will used
    //initial state
    extendObservable(this, {
      name: "",
      errors: {}
    });
  }

  onSubmit = async () => {
    const { name } = this;
    const response = await this.props.mutate({
      variables: { name }
    });
    console.log(response);

    //create team schema name
    const { ok, errors } = response.data.createTeam;
    if (ok) {
      //redirecting to home
      this.props.history.push("/");
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        //err['nameError']='message'
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
    const { name, errors: { nameError } } = this;

    const errorList = [];

    if (nameError) {
      errorList.push(nameError);
    }

    return (
      <Container text>
        <Header as="h2">Create Team</Header>
        <Form>
          <Form.Field error={!!nameError}>
            <Input
              name="name"
              onChange={this.onChange}
              value={name}
              placeholder="Name"
              fluid
            />
          </Form.Field>

          <Button onClick={this.onSubmit}>Create</Button>
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

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      errors {
        path
        message
      }
    }
  }
`;
//smart componant with mobx
export default graphql(createTeamMutation)(observer(CreateTeam));
