import Declaration from "../../model/declaration";
import * as declarationTypes from "../types/declarationTypes";
import apis from "../../api";

export function addDeclaration(
  newDeclaration: Declaration
): declarationTypes.DeclarationActionTypes {
  return {
    type: declarationTypes.ADD_DECLARATION,
    payload: newDeclaration,
  };
}

export function deleteDeclaration(
  declaration: Declaration
): declarationTypes.DeclarationActionTypes {
  return {
    type: declarationTypes.DELETE_DECLARATION,
    payload: declaration,
  };
}

export function updateDeclaration(
  declaration: Declaration
): declarationTypes.DeclarationActionTypes {
  return {
    type: declarationTypes.UPDATE_DECLARATION,
    payload: declaration,
  };
}

export function cleanDeclarations(): declarationTypes.DeclarationActionTypes {
  return {
    type: declarationTypes.CLEAN_DECLARATIONS,
  };
}

export function loadDeclarationSuccess(
  declarations: Declaration[]
): declarationTypes.DeclarationActionTypes {
  return {
    type: declarationTypes.LOAD_DECLARATION_SUCCESS,
    declarations: declarations,
  };
}

export function loadDeclarations(folderId: string) {
  return function (dispatch: any) {
    return apis
      .getDeclarationsByFolder(folderId)
      .then((declarations: any) => {
        dispatch(loadDeclarationSuccess(declarations.data.data));
      })
      .catch((err) => {
        console.error(err);
      });
  };
}
