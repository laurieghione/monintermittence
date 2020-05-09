import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { bindActionCreators } from "redux";
import { logout, login } from "../store/actions/authAction";
import { application } from "express";

interface LinksProps {
  isAuthenticated: boolean;
  profile: any;
}

class Links extends React.Component<LinksProps & any> {
  constructor(props: LinksProps & any) {
    super(props);
  }

  render() {
    const { isAuthenticated, profile, login, logout, folder } = this.props;
    return (
      <React.Fragment>
        <Link to="/" className="navbar-brand">
          Mon intermittence
        </Link>
        <div className="collpase navbar-collapse justify-content-between">
          <div className="navbar-links navbar-nav">
            <Link to="/declarations/list" className="nav-link nav-item">
              Récapitulatif
            </Link>
            {folder && (
              <Link to="/declarations/form" className="nav-link nav-item">
                Ajouter déclaration
              </Link>
            )}
            <Link to="/archive" className="nav-link nav-item">
              Archive
            </Link>
            <Link to="/statistic" className="nav-link nav-item">
              Statistique
            </Link>
            {isAuthenticated && (
              <Link to="/profile" className="nav-link nav-item">
                Profile
              </Link>
            )}
          </div>
          <div className="navbar-button">
            {isAuthenticated && profile ? (
              <React.Fragment>
                <p>{profile.nickname}</p>
                <Button variant="contained" onClick={logout}>
                  LogOut
                </Button>
              </React.Fragment>
            ) : (
              <Button variant="contained" onClick={login}>
                LogIn
              </Button>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      logout,
      login,
    },
    dispatch
  );

function mapStateToProps(applicationState: any) {
  return {
    profile: applicationState.authReducer.profile,
    isAuthenticated: applicationState.authReducer.isAuthenticated,
    folder: applicationState.folderReducer.folder,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Links);
