import React from "react";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";

const Home = ({ loading, allUsers, client }) => {
  // loading ? null :
  if (loading) return null;
  return (
    <div>
      <ul>
        {allUsers.map(user => {
          return <li key={user.id}>{user.email}</li>;
        })}
      </ul>
      <div>
        <button
          onClick={() => {
            client.resetStore();
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

const allUserQuery = gql`
  {
    allUsers {
      id
      email
    }
  }
`;

export default graphql(allUserQuery, {
  props: ({ data }) => ({ ...data })
})(withApollo(Home));
