import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { bindActionCreators } from "redux";
import { logout, login } from "../store/actions/authAction";

interface LinksProps {
  isAuthenticated: boolean;
  profile: any;
  isFetching: boolean;
  folder: any;
}

class Links extends React.Component<LinksProps & any> {
  constructor(props: LinksProps & any) {
    super(props);
  }

  render() {
    const {
      isAuthenticated,
      profile,
      login,
      logout,
      folder,
      isFetching,
    } = this.props;
    return (
      <React.Fragment>
        {!isFetching && (
          <React.Fragment>
            <Link to="/" className="navbar-brand">
              Mon intermittence
            </Link>
            <div className="collpase navbar-collapse justify-content-between">
              <div className="navbar-links navbar-nav">
                {isAuthenticated && (
                  <React.Fragment>
                    <Link to="/declarations/list" className="nav-link nav-item">
                      Récapitulatif
                    </Link>
                    {folder && (
                      <Link
                        to="/declarations/form"
                        className="nav-link nav-item"
                      >
                        Ajouter déclaration
                      </Link>
                    )}
                    <Link to="/archive" className="nav-link nav-item">
                      Archive
                    </Link>
                    <Link to="/statistic" className="nav-link nav-item">
                      Statistique
                    </Link>
                  </React.Fragment>
                )}
              </div>

              <div className="navbar-button">
                {isAuthenticated && profile ? (
                  <React.Fragment>
                    <img
                      className="profile_picture"
                      src={profile.picture}
                      width="50"
                      height="50"
                      alt="profile"
                    />
                    <p className="nickName">{profile.nickname}</p>

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
        )}
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
    isFetching: applicationState.authReducer.isFetching,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Links);
