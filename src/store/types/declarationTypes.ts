import Declaration from "../../model/declaration";

export const ADD_DECLARATION = 'ADD_DECLARATION';
export const DELETE_DECLARATION = 'DELETE_DECLARATION';
export const CLEAN_DECLARATIONS = 'CLEAN_DECLARATIONS';
export const UPDATE_DECLARATION = 'UPDATE_DECLARATION';
export const LOAD_DECLARATION_SUCCESS = 'LOAD_DECLARATION_SUCCESS';

interface AddDeclarationAction {
  type: typeof ADD_DECLARATION
  payload: Declaration
}

interface DeleteDeclarationAction {
  type: typeof DELETE_DECLARATION
  payload: Declaration
}

interface UpdateDeclarationAction {
  type: typeof UPDATE_DECLARATION
  payload: Declaration
}

interface CleanDeclarationsAction {
  type: typeof CLEAN_DECLARATIONS
}

interface LoadDeclarationAction {
  type: typeof LOAD_DECLARATION_SUCCESS
  declarations: Declaration[]
}


export type DeclarationActionTypes = AddDeclarationAction | UpdateDeclarationAction |
 DeleteDeclarationAction | LoadDeclarationAction | CleanDeclarationsAction