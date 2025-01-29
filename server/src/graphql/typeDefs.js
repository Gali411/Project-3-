import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Auth {
    token: String!
    user: User!
  }

  type Query {
    getUsers: [User]
    getUser(id: ID!): User
  }

  type Mutation {
    registerUser(username: String!, email: String!, password: String!): Auth
    loginUser(username: String!, password: String!): Auth
    updateUser(id: ID!, username: String, email: String): User
    deleteUser(id: ID!): User
  }
`;

export default typeDefs;
