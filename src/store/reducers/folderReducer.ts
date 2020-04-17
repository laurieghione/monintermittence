import * as folderTypes from '../types/folderTypes'
import Folder from '../../model/folder';

export interface FolderState {
    folder : Folder | null
}

export const initialState = {
    folder : null
}

export default function folderReducer(state: FolderState = initialState, 
  action: folderTypes.FolderActionTypes): FolderState {

  console.log('Folder reducer : ', state, action);
  switch (action.type) {
    case folderTypes.ADD_FOLDER: {
      return {
        ...state,
        folder: action.payload
      };
    }
    case folderTypes.DELETE_FOLDER:
      return {
        ...state,
        folder: null
    }
    case folderTypes.LOAD_FOLDER_SUCCESS:
      return {
        ...state,
        folder: action.folder
    }
    default:
      return state;
  }
}
