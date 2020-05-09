import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

const Title = styled.h2.attrs({
  className: "title",
})``;

const Wrapper = styled.div.attrs({
  className: "container",
})``;

interface ProfileProps {
  profile: any;
}

interface ProfileState {
  error: string;
}

class Profile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);
    this.state = {
      error: "",
    };
  }

  render() {
    const { profile } = this.props;
    return (
      <Wrapper>
        <Title>Profile</Title>
        {profile && (
          <React.Fragment>
            <p>{profile.nickname}</p>
            <img
              src={profile.picture}
              alt="profile"
              style={{ maxWidth: 50, maxHeight: 50 }}
            />
            <pre>{JSON.stringify(profile, null, 2)}</pre>
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}

function mapStateToProps(applicationState: any) {
  return {
    profile: applicationState.authReducer.profile,
  };
}

export default connect(mapStateToProps)(Profile);
