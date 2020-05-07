import Employer from "../../model/employer";
import * as employerTypes from "../types/employerTypes";
import apis from "../../api";

export function addEmployer(
  newEmployer: Employer
): employerTypes.EmployerActionTypes {
  return {
    type: employerTypes.ADD_EMPLOYER,
    payload: newEmployer,
  };
}

export function loadEmployerSuccess(
  employers: Employer[]
): employerTypes.EmployerActionTypes {
  return {
    type: employerTypes.LOAD_EMPLOYER_SUCCESS,
    employers,
  };
}

export function loadEmployers() {
  return function (dispatch: any) {
    return apis
      .getEmployers()
      .then((employer: any) => {
        dispatch(loadEmployerSuccess(employer.data.data));
      })
      .catch((err: any) => {
        console.error(err);
      });
  };
}
