import * as employerTypes from '../types/employerTypes'
import Employer from '../../model/employer';

export interface EmployerState {
    employers : Employer[]
}

export const initialState = {
    employers : []
}

export default function employerReducer(state: EmployerState = initialState, 
  action: employerTypes.EmployerActionTypes): EmployerState {
    
  console.log('Employer reducer : ', state, action);
  switch (action.type) {
    case employerTypes.ADD_EMPLOYER: {
      return {
        ...state,
        employers: [...state.employers, action.payload]
      };
    }
      case employerTypes.LOAD_EMPLOYER_SUCCESS:
        return {
          ...state,
          employers: action.employers
        }
    default:
      return state;
  }
}
