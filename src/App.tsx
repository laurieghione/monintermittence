import React from "react";
import { bindActionCreators } from "redux";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import DeclarationForm from "./pages/DeclarationForm";
import Summary from "./pages/Summary";
import Archive from "./pages/Archive";
import { connect } from "react-redux";
import Home from "./pages/Home";
import { getUserInfo } from "./store/actions/authAction";
import { loadActiveFolder } from "./store/actions/folderAction";
import Statistic from "./pages/Statistic";

interface AppProps {
  isFetching: boolean;
  isAuthenticated: boolean;
  profile: any;
  getUserInfo: () => void;
  loadActiveFolder: (user: string) => void;
}

class App extends React.Component<AppProps> {
  componentDidMount() {
    const { isFetching, isAuthenticated, profile } = this.props;
    if (!isFetching && isAuthenticated && !profile) {
      this.props.getUserInfo();
    }
  }

  componentDidUpdate(prevProps: any) {
    const { profile } = this.props;
    if (profile && prevProps.profile !== profile) {
      this.props.loadActiveFolder(profile.email);
    }
  }

  public render() {
    return (
      <React.Fragment>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            path="/declarations/list"
            render={(props) => {
              if (!this.props.isAuthenticated) {
                return <Redirect to="/" />;
              }

              return <Summary {...props} />;
            }}
          />
          <Route
            path="/declarations/form/:id"
            render={(props) => {
              if (!this.props.isAuthenticated) {
                return <Redirect to="/" />;
              }

              return <DeclarationForm {...props} />;
            }}
          />
          <Route
            path="/declarations/form"
            render={(props) => {
              if (!this.props.isAuthenticated) {
                return <Redirect to="/" />;
              }

              return <DeclarationForm {...props} />;
            }}
          />
          <Route
            path="/archive"
            render={(props) => {
              if (!this.props.isAuthenticated) {
                return <Redirect to="/" />;
              }

              return <Archive {...props} />;
            }}
          />
          <Route
            path="/statistic"
            render={(props) => {
              if (!this.props.isAuthenticated) {
                return <Redirect to="/" />;
              }

              return <Statistic {...props} />;
            }}
          />
        </Switch>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      getUserInfo,
      loadActiveFolder,
    },
    dispatch
  );

function mapStateToProps(applicationState: any) {
  return {
    isAuthenticated: applicationState.authReducer.isAuthenticated,
    profile: applicationState.authReducer.profile,
    isFetching: applicationState.authReducer.isFetching,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
