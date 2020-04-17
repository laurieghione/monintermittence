import Employer from "../../model/employer";

export const ADD_EMPLOYER = 'ADD_EMPLOYER';
export const LOAD_EMPLOYER_SUCCESS = 'LOAD_EMPLOYER_SUCCESS';

interface AddEmployerAction {
  type: typeof ADD_EMPLOYER
  payload: Employer
}

interface LoadEmployerAction {
  type: typeof LOAD_EMPLOYER_SUCCESS
  employers: Employer[]
}

export type EmployerActionTypes = AddEmployerAction | LoadEmployerAction