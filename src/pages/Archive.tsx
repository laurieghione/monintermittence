import React from 'react';
//import Folder from '../model/folder';
import api from '../api';

interface ArchiveProps {

}

interface ArchiveState {
    declarations: any[],
    folders: any[]
}

export default class Archive extends React.Component<ArchiveProps, ArchiveState>{

    constructor(props: ArchiveProps ){
        super(props)
        this.state = {
            declarations : [],
            folders : []
        }
    }

    getFolders = (): Promise<any> => {
      return new Promise((resolve, reject) =>{
        api.getFolders().then((data)=>{
            resolve(data)
        }).catch((err)=>{
            reject(err)
        })
      })
    }

    componentDidMount = ()=>{
         this.getFolders().then((folders)=>{
            folders.data.data.map((folder: any)=>{
                api.getDeclarationsByFolder(folder._id).then((declarations)=>{
                    this.setState({folders: folders.data.data, declarations : declarations.data.data})
                })
            })
         })
      }

    render(){
        return(
            <React.Fragment>
                <p>Toto</p>
            </React.Fragment>
        )
    }

}