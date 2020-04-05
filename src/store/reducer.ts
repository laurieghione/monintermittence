import { ADD_DECLARATION, DeclarationAction } from './action';
import  Declaration from '../model/declaration';

export interface DeclarationState {
    declaration : Declaration
}

export const initialState = {
    declaration : new Declaration()
}

export function declarationReducer(state : DeclarationState = initialState, action: DeclarationAction): DeclarationState {
  console.log('reducer', state, action);
  switch (action.type) {
    case ADD_DECLARATION: {
      return {
        ...state,
        declaration: state.declaration,
      };
    }
    default:
      return state;
  }
}
