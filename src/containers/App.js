import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

//routes
import NavBar from '../components/NavBar';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import GenerateMonster from '../components/GenerateMonster';
import MonsterContainer from '../components/MonsterContainer';

import { connect } from 'react-redux'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      username: '',
      bio: '',
      single: false,
      logged_in: false,
      userid: null,
      // heads: [],
      // body: [],
      // feet: []
    };
  }

  // createPartsArray = (json, partName) => {
  //   const partsArray = json.map(part =>
  //     Object.assign({}, { part: part.url, username: part.username })
  //   );
  //   if(partName === "heads"){}
  // };

  componentDidMount() {
    fetch('https://monster-mash-api.herokuapp.com/api/v1/heads')
      .then(r => r.json())
      .then(heads => this.props.addHeads(heads));
    fetch('https://monster-mash-api.herokuapp.com/api/v1/hands')
      .then(r => r.json())
      .then(bodies => this.props.addBodies(bodies));
    fetch('https://monster-mash-api.herokuapp.com/api/v1/feet')
      .then(r => r.json())
      .then(feet => this.props.addFeet(feet));

    let token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
      fetch('https://monster-mash-api.herokuapp.com/api/v1/trytoken', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        }
      })
        .then(response => response.json())
        .then(json =>
          this.setState({
            token: json.token,
            username: json.user_details.username,
            bio: json.user_details.bio,
            single: json.user_details.single,
            userid: json.user_details.id,
            display_value: json.user_details.username,
            logged_in: true
          })
        );
    }
  }

  //when someone logs in this is triggered
  handleLogin = (event, loginState) => {
    event.preventDefault();
    fetch('https://monster-mash-api.herokuapp.com/api/v1/login', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        username: loginState.username,
        password: loginState.password
      })
    })
      .then(response => response.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          token: json.token,
          username: json.user_details.username,
          bio: json.user_details.bio,
          single: json.user_details.single,
          userid: json.user_details.id,
          display_value: json.user_details.username,
          logged_in: true
        });
      });
  };

  //when someone signs up this is triggered
  handleSignUpSubmit = (event, formInfo) => {
    event.preventDefault();
    fetch('https://monster-mash-api.herokuapp.com/api/v1/users', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        username: formInfo.username,
        password: formInfo.password,
        bio: formInfo.bio,
        single: formInfo.single
      })
    })
      .then(response => response.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          token: json.token,
          username: json.user_details.username,
          bio: json.user_details.bio,
          single: json.user_details.single,
          userid: json.user_details.id,
          display_value: json.user_details.username,
          logged_in: true
        });
      });
  };

  handleLogout = event => {
    localStorage.removeItem('token');
    this.setState({
      token: '',
      username: '',
      bio: '',
      single: false,
      logged_in: false,
      userid: null
    });
  };

  render() {
    console.log("APP PROPS", this.props)
    return (
      <Router>
        <div className="App">
          <NavBar username={this.state.username} onClick={this.handleLogout} />
          <div className="gutter">
            <Route
              exact
              path="/"
              component={() => (
                <GenerateMonster
                  heads={this.props.heads}
                  body={this.props.bodies}
                  feet={this.props.feet}
                />
              )}
            />
            <Route
              exact
              path="/draw"
              component={() => (
                <MonsterContainer
                  userid={this.state.userid}
                  username={this.state.username}
                />
              )}
            />
            <Route
              exact
              path="/login"
              render={routerProps =>
                this.state.logged_in ? (
                  <Redirect to="/" />
                ) : (
                  <Login {...routerProps} onSubmit={this.handleLogin} />
                )
              }
            />
            <Route
              exact
              path="/sign-up"
              render={routerProps => (
                <SignUp
                  {...routerProps}
                  value={this.state.signUpValue}
                  onSubmit={this.handleSignUpSubmit}
                />
              )}
            />
          </div>
          <div className="fix bottom left m1">
            <a
              href="https://github.com/squamuglia"
              target="_blank"
              rel="noopener noreferrer"
            >
              Max
            </a>,{' '}
            <a
              href="https://github.com/creiser2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tony
            </a>,{' '}
            <a
              href="https://github.com/steven0608"
              target="_blank"
              rel="noopener noreferrer"
            >
              Steven
            </a>
          </div>
        </div>
      </Router>
    );
  }
}

function msp(state){
  return {
    heads: state.heads,
    bodies: state.bodies,
    feet: state.feet,
  }
}

function mdp(dispatch){
  console.log("MDP", dispatch)
  return {
    addHeads: (headsData) => {
      dispatch({type: "ADD_HEADS", payload: headsData })
    },
    addBodies: (bodiesData) => {
      dispatch({type: "ADD_BODIES", payload: bodiesData })
    },
    addFeet: (feetData) => {
      dispatch({type: "ADD_FEET", payload: feetData })
    }
  }
}


export default connect(msp, mdp)(App);
