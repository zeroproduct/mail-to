import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import EmailForm from './components/EmailForm';
import MailLink from './components/MailLink';
import './App.css';

function App() {

  return (
    <Router>
      <Route exact path="/" component={EmailForm} />
      <Route exact path="/:id" component={MailLink} />
    </Router>

  );
}

export default App;
