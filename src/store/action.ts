import Declaration from "../model/declaration";


/*export interface DeclarationState {
    declaration: Declaration;
}

export interface DeclarationAction {
    type: string;
    declaration: Declaration;

}

/*export const addDeclaration = (data: Declaration) => ({
    declaration: data,
    type: ADD_DECLARATION,
  });*/



 /* export function addDeclaration(payload: Declaration) {
    return { type: ADD_DECLARATION, payload };
  }

export type DeclarationTypes = DeclarationAction;*/
export const ADD_DECLARATION = 'ADD_DECLARATION';

export interface AddDeclarationAction {type : "ADD_DECLARATION", declaration: Declaration}

export const actionCreators = {
    addDeclaration: (newDeclaration: Declaration) => ({ type : ADD_DECLARATION, declaration: newDeclaration} as AddDeclarationAction )
}

export type DeclarationAction = AddDeclarationAction