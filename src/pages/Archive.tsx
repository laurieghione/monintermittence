import React from "react";
import api from "../api";
import { connect } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";
import moment from "moment";

const Wrapper = styled.div.attrs({
  className: "container",
})``;

const Title = styled.h2.attrs({
  className: "title",
})``;

interface ArchiveProps {
  profile: any;
  isFetching: boolean;
}

interface ArchiveState {
  declarations: any[];
  folders: any[];
  isLoading: boolean;
}

class Archive extends React.Component<ArchiveProps, ArchiveState> {
  constructor(props: ArchiveProps) {
    super(props);
    this.state = {
      declarations: [],
      folders: [],
      isLoading: true,
    };
  }

  getFolders = (user: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      api
        .getFolders(user)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  componentDidMount = () => {
    const { profile } = this.props;
    if (profile) {
      this.getFolders(profile.email).then((folders) => {
        console.log("folder archive", folders);
        if (folders.data.data.length > 0) {
          folders.data.data.map((folder: any) => {
            api.getDeclarationsByFolder(folder._id).then((declarations) => {
              this.setState({
                folders: folders.data.data,
                declarations: declarations.data.data,
                isLoading: false,
              });
            });
          });
        }
      });
    }
  };

  render() {
    const { isFetching } = this.props;
    const { isLoading, folders } = this.state;
    console.log("render archive", folders);
    return (
      <React.Fragment>
        {isFetching || isLoading ? (
          <React.Fragment>
            <div className="loader">
              <CircularProgress size={70} />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {folders.length > 0 ? (
              <Wrapper>
                <Title>Dossier clôturé</Title>
                <p>
                  Dossier du {moment(folders[0].dateStart!).format("DD/MM/Y")}{" "}
                  au {moment(folders[0].dateEnd!).format("DD/MM/Y")}
                </p>
              </Wrapper>
            ) : (
              <React.Fragment>
                <div className="warning">
                  <p>Aucun dossier archivé</p>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
function mapStateToProps(applicationState: any) {
  return {
    profile: applicationState.authReducer.profile,
    isFetching: applicationState.authReducer.isFetching,
  };
}

export default connect(mapStateToProps)(Archive);
