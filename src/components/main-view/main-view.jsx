import config from '../../config';
import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import { RegistrationView } from '../registration-view/registration-view';
import { ProfileView } from '../profile-view/profile-view';
import { UpdateView } from '../update-view/update-view';

// #0
import { setMovies, setUser } from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';
/* 
  #1 The rest of components import statements but without the MovieCards 
  because it will be imported and used in the MoviesList component rather
  than in here. 
*/

import './main-view.scss';

// #2 export keyword removed from here
class MainView extends React.Component {

  constructor() {
    super();
    //initial state for all of these parameters set to null; but with Redux, we don't even do that!
    //this.state = {
      //movies: [],
      //selectedMovie: null,
      // user: null,
      //registered: null
    //}
  }

  //this code fetches movie data from my heroku app and puts it in the movies array
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken);
      this.getMovies(accessToken);
    }
  }

  /*this function is triggered when a movie is clicked!!
  It changes the state of the selectedMovie propery to the clicked movie */
  /*setSelectedMovie(newSelectedMovie) {
    this.setState({
      selectedMovie: newSelectedMovie
    });
  }*/

  /*When a user logs in, this function changes the user property to that user!! */
  onLoggedIn(authData) {
    console.log(authData)
    this.props.setUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
  }

  getMovies(token) {
    axios.get(`${config.API_URL}/movies`, {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {
      // Assign the result to the state
      this.props.setMovies(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getUser(token) {
    axios.get(`${config.API_URL}/users/${localStorage.getItem('user')}`, {
      headers: { Authorization: `Bearer ${token}`}
    }).then(response => {
      let user = response.data.Username;
      this.props.setUser(response.data);
      // return response.data;
    }).catch(function (error) {
      console.log(error);
    });
  }

  //comment 99 to see if git is hooked up properly.

  onLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.props.setUser({});
    //window.open("/","_self");
  }

  render() {
    let { movies, user } = this.props;
    let { Username } = user;

    return (
      <>
        <Router>
          {Username && <Button onClick={() => { this.onLoggedOut() }}>Logout</Button>}
          {Username && <Button as={Link} to={`/profile`}>Profile</Button>}
          <Row className="main-view justify-content-md-center">
            <Route exact path="/" render={() => {
              console.log(user);
              if (!Username) return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
              if (movies.length === 0) return <div className="main-view" />;
              return <MoviesList movies={movies}/>;
            }} />
            <Route path="/register" render={() => {
              if (Username) return <Redirect to="/" />
              return <Col>
                <RegistrationView />
              </Col>
            }} />
            <Route path="/movies/:movieId" render={({ match, history }) => {
              if (!Username) return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
              if (movies.length === 0) return <div className="main-view" />;
              return <Col md={8}>
                <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
              </Col>
            }} />
            <Route path="/directors/:name" render={({ match, history }) => {
              if (!Username) return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
              if (movies.length === 0) return <div className="main-view" />;
              return <Col md={8}>
                <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} onBackClick={() => history.goBack()} />
              </Col>
            }} />
            <Route path="/genres/:name" render={({ match, history }) => {
              if (!Username) return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
              if (movies.length === 0) return <div className="main-view" />;
              return <Col md={8}>
                <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} onBackClick={() => history.goBack()} />
              </Col>
            }} />
            <Route path="/profile" render={({ match, history }) => {
              if (!Username) return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
              if (movies.length === 0) return <div className="main-view" />;
              return <Col md={8}>
                <ProfileView user={user} movies={movies} onBackClick={() => history.goBack()} />
              </Col>
            }} />
            <Route path="/update/:currentuser" render={({ match, history }) => {
              if (!Username) return <Col>
                <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
              </Col>
              if (movies.length === 0) return <div className="main-view" />;
              return <Col md={8}>
                <UpdateView user={user} movies={movies} onBackClick={() => history.goBack()} />
              </Col>
            }} />
          </Row>
        </Router>
      </>
    );
  }
}

let mapStateToProps = state => {
  return {
    movies: state.movies,
    user: state.user
  }
}

export default connect(mapStateToProps, { setMovies, setUser } )(MainView);