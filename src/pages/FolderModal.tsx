import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Folder from '../model/folder';
import { insertFolder } from '../api';
import { TextField } from '@material-ui/core';

interface FolderModalProps  {

}

interface FolderModalState  {
    folder: Folder
}

class FolderModal extends React.Component<FolderModalProps,FolderModalState>{

    constructor ( props : FolderModalProps){
        super(props)
        this.state = {folder: new Folder()}
      }

    createFolder= () =>{
        insertFolder(this.state.folder).then(() => {
            window.alert(`Folder inserted successfully`)
          }).catch((error: any) => {
            console.error(error);
          });
    }

    handleChange = (event: any) => {
        let folder = this.state.folder;
        if(event.target.name === 'dateStart'){
            folder.dateStart = event.target.value;
        }
        //TODO: add real user
        folder.user = '5e86360d56dc0a72648fede2';
        this.setState({ folder});
    }

    handleClose(){
        
    }

    render(){
        return(
            <Modal.Dialog>
            <Modal.Header closeButton={true}>
                <Modal.Title>Ajouter un dossier</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form>
                    <div className="form-group col-md-6">
                        <TextField
                        label="Date début"
                        name="dateStart"
                        type="date"
                        required
                        variant="outlined"
                        onChange={this.handleChange}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                    </div>
                </form>
            </Modal.Body>

            <Modal.Footer>
                <button className="btn btn-secondary" onClick={this.handleClose}>
                    Annuler
                </button>
                <button className="btn btn-primary" onClick={this.createFolder}>
                    Ajouter
                </button>
            </Modal.Footer>
            </Modal.Dialog>
        )
    }
}

export default FolderModal