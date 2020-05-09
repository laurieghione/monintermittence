import React from "react";
import styled from "styled-components";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { loginUser } from "../store/actions/authAction";
import { CircularProgress } from "@material-ui/core";

const Title = styled.h2.attrs({
  className: "title",
})``;

const Wrapper = styled.div.attrs({
  className: "container",
})``;

interface HomeProps {
  location: any;
  profile: any;
}

class Home extends React.Component<HomeProps & any> {
  constructor(props: HomeProps & any) {
    super(props);
  }

  componentDidMount = () => {
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.props.loginUser();
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.props.isFetching ? (
          <React.Fragment>
            <div className="loader">
              <CircularProgress size={70} />
            </div>
          </React.Fragment>
        ) : (
          <Wrapper>
            <Title>
              Bienvenue {this.props.profile ? this.props.profile.nickname : ""}{" "}
              dans mon intermittence !
            </Title>
          </Wrapper>
        )}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      loginUser,
    },
    dispatch
  );

function mapStateToProps(applicationState: any) {
  return {
    profile: applicationState.authReducer.profile,
    isFetching: applicationState.authReducer.isFetching,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
