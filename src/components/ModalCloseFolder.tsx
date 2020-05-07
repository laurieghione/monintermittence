import React from "react";
import { bindActionCreators } from "redux";
import CustomModal from "./CustomModal";
import apis from "../api";
import { connect } from "react-redux";
import { deleteFolder } from "../store/actions/folderAction";
import { cleanDeclarations } from "../store/actions/declarationAction";
import moment from "moment";

interface modalCloseFolderProps {
  openModal: boolean;
  closeModal: () => void;
}

class ModalCloseFolder extends React.Component<modalCloseFolderProps & any> {
  closeFolder = () => {
    let { folder } = this.props;
    let closeFolder = { ...folder };
    closeFolder.active = false;
    closeFolder.dateEnd = new Date();
    closeFolder.id = folder._id; // TODO
    closeFolder.name =
      moment(closeFolder.dateStart!).format("DD-MM-YYYY") +
      " / " +
      moment(closeFolder.dateEnd).format("DD-MM-YYYY");

    apis.updateFolderById(closeFolder.id, closeFolder).then(() => {
      this.props.deleteFolder();
      this.props.cleanDeclarations();
    });
  };

  render() {
    let body = (
      <React.Fragment>
        <p>Etes vous sur de vouloir clôturer le dossier en cours ?</p>
      </React.Fragment>
    );

    const { openModal, closeModal } = this.props;

    return (
      <CustomModal
        title="Clôturer le dossier"
        open={openModal}
        handleClose={closeModal}
        buttonSubmit="Clôturer"
        body={body}
        handleSubmit={this.closeFolder}
      />
    );
  }
}

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators({ deleteFolder, cleanDeclarations }, dispatch);
}

function mapStateToProps(applicationState: any) {
  return {
    folder: applicationState.folderReducer.folder,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalCloseFolder);
