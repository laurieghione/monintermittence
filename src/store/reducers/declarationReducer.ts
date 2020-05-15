import * as declarationTypes from "../types/declarationTypes";
import Declaration from "../../model/declaration";

export interface DeclarationState {
  declarations: Declaration[];
}

export const initialState = {
  declarations: [],
};

export default function declarationReducer(
  state: DeclarationState = initialState,
  action: declarationTypes.DeclarationActionTypes
): DeclarationState {
  if (!action.type.includes("INIT") && !action.type.includes("PROBE_UNKNOWN")) {
    console.log("declaration reducer ", state, action);
  }
  switch (action.type) {
    case declarationTypes.ADD_DECLARATION: {
      return {
        ...state,
        declarations: [...state.declarations, action.payload],
      };
    }
    case declarationTypes.DELETE_DECLARATION:
      return {
        ...state,
        declarations: state.declarations.filter(
          (declaration: Declaration) => declaration._id !== action.payload._id
        ),
      };
    case declarationTypes.CLEAN_DECLARATIONS:
      return {
        ...state,
        declarations: [],
      };
    case declarationTypes.UPDATE_DECLARATION:
      console.log("update decla", state.declarations);

      return {
        ...state,
        declarations: state.declarations.map((item) =>
          item._id === action.payload._id
            ? { ...item, netSalary: action.payload.netSalary }
            : item
        ),
      };
    case declarationTypes.LOAD_DECLARATION_SUCCESS:
      console.log("action load success", action.declarations);
      return {
        ...state,
        declarations: action.declarations,
      };
    default:
      return state;
  }
}
