import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import DeclarationForm from './pages/DeclarationForm';
import Summary from './pages/Summary';
import Archive from './pages/Archive';

class App extends React.Component {
  public render() {
    return (
      <Router>
         <Navbar />
         <Switch>
                <Route path="/declarations/list" exact component={Summary} />
                <Route path="/declarations/form/:id" component={DeclarationForm} />
                <Route path="/declarations/form" component={DeclarationForm} />
                <Route path="/archive" component={Archive} />
          </Switch>
      </Router>
    );
  }
}

export default App;

