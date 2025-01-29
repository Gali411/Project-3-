
  import { Outlet } from 'react-router-dom';
import Navigator from './components/Navigator';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


  function App() {
    return (
      <ApolloProvider client={client}>
      <main>

        <Navigator />
        <Outlet />
      </main>
      </ApolloProvider>
    );
  }


  /*
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route for routing
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/Error'; // Import the error page for unknown routes

const App = () => {
  const handleLogin = (user: { email: string }) => {
    console.log(`User logged in with email: ${user.email}`);
    // Implement login logic here (e.g., set user in state, redirect, etc.)
  };

  return (
    <div className="app">
      <Routes>
        {/* Define your routes for all pages */}
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};
  */

export default App;

