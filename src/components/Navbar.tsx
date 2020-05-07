import React from "react";
import styled from "styled-components";
import Logo from "./Logo";
import Links from "./Links";

const Nav = styled.nav.attrs({
  className: "navbar navbar-expand-lg navbar-dark bg-dark",
})`
  margin-bottom: 20 px;
`;

class Navbar extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <Nav>
          <Logo />
          <Links />
        </Nav>
      </div>
    );
  }
}

export default Navbar;
