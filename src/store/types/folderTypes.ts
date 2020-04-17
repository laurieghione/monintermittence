import Folder from "../../model/folder";

export const ADD_FOLDER = 'ADD_FOLDER';
export const DELETE_FOLDER = 'DELETE_FOLDER';
export const LOAD_FOLDER_SUCCESS = 'LOAD_FOLDER_SUCCESS';

interface AddFolderAction {
  type: typeof ADD_FOLDER
  payload: Folder
}

interface DeleteFolderAction {
  type: typeof DELETE_FOLDER
}

interface LoadFolderAction {
  type: typeof LOAD_FOLDER_SUCCESS
  folder: Folder
}

export type FolderActionTypes = AddFolderAction | DeleteFolderAction | LoadFolderAction