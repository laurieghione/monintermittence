import React from "react";
import { bindActionCreators } from "redux";
import Declaration from "../model/declaration";
import Folder from "../model/folder";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import api from "../api";
import moment from "moment";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, MenuItem } from "@material-ui/core";
import Employer from "../model/employer";
import { RouteProps } from "react-router";
import { Button } from "@material-ui/core";
import {
  addDeclaration,
  updateDeclaration,
} from "../store/actions/declarationAction";
import { loadEmployers, addEmployer } from "../store/actions/employerAction";
import { loadActiveFolder } from "../store/actions/folderAction";

const Title = styled.h2.attrs({
  className: "h2",
})`
  margin-bottom: 30px;
`;

const Wrapper = styled.div.attrs({
  className: "container-fluid",
})`
  padding: 50px;
`;

const Error = styled.p.attrs({})`
  color: red;
  font-size: 12px;
`;

interface DFProps {
  declarations: Declaration[];
  folder: Folder;
  employers: Employer[];
  profile: any;
}

interface DFState {
  declaration: Declaration;
  error: boolean;
  disabledHours: boolean;
  disabledDateEnd: boolean;
  isEdit: boolean;
  redirect: boolean;
  employerSelected: any | null;
}

const annexe = [
  {
    value: "",
    label: "",
  },
  {
    value: "8",
    label: "Technicien",
  },
  {
    value: "10",
    label: "Artiste",
  },
];

export class DeclarationForm extends React.Component<
  DFProps & RouteProps & any,
  DFState
> {
  private params: any;

  constructor(props: DFProps & RouteProps & any) {
    super(props);
    this.state = {
      declaration: new Declaration(),
      error: false,
      disabledHours: false,
      disabledDateEnd: false,
      redirect: false,
      isEdit: false,
      employerSelected: null,
    };
  }

  autocompleteChange = (event: any, value: any) => {
    let declaration = this.state.declaration;
    if (value) {
      declaration.employer = value.name;
      this.setState({ declaration });
    }
  };

  handleChange = (event: any) => {
    const { disabledDateEnd, disabledHours } = this.state;
    let declaration = this.state.declaration;

    let dDateEnd = disabledDateEnd;
    let dHours = disabledHours;

    if (event.target.name === "annexe") {
      declaration.annexe = event.target.value;
      if (Number(declaration.annexe) === 10) {
        declaration.nbhours = 12;
        dDateEnd = true;
        dHours = true;
      } else {
        declaration.nbhours = 0;
        dDateEnd = false;
        dHours = false;
      }
    } else if (event.target.name === "dateStart") {
      declaration.dateStart = event.target.value;
      declaration.dateEnd = event.target.value;
    } else if (event.target.name === "dateEnd") {
      declaration.dateEnd = event.target.value;
    } else if (event.target.name === "employer") {
      declaration.employer = event.target.value;
    } else if (event.target.name === "label") {
      declaration.label = event.target.value;
    } else if (event.target.name === "netSalary") {
      declaration.netSalary = event.target.value;
    } else if (event.target.name === "grossSalary") {
      declaration.grossSalary = event.target.value;
    } else if (event.target.name === "nbhours") {
      declaration.nbhours = event.target.value;
    }
    this.setState({
      declaration,
      disabledHours: dHours,
      disabledDateEnd: dDateEnd,
    });
  };

  handleValidation = () => {
    let formIsValid: boolean = true;

    if (this.state.declaration.annexe === "") {
      formIsValid = false;
    } else if (this.state.declaration.employer === "") {
      formIsValid = false;
    } else if (this.state.declaration.dateStart === null) {
      formIsValid = false;
    } else if (this.state.declaration.dateEnd === null) {
      formIsValid = false;
    }

    return formIsValid;
  };

  handleSubmit = (event: any) => {
    event.preventDefault();
    let { declaration, error } = this.state;
    let { employers, auth } = this.props;

    let formIsValid = this.handleValidation();
    let employerExist: any;

    if (formIsValid) {
      // Manage employer
      employerExist = employers.find(
        (empl: Employer) => empl.name === declaration.employer
      );

      if (employerExist === undefined) {
        let empl: Employer = new Employer();
        empl.name = declaration.employer;

        //TO DO insert employer in state
        api
          .insertEmployer(empl)
          .then((data: any) => {
            this.props.addEmployer(data.data.employer);
          })
          .catch((error: any) => {
            console.error(error);
          });
      }

      if (this.state.isEdit) {
        api
          .updateDeclarationById(declaration._id, declaration)
          .then(() => {
            window.alert(`La déclaration a bien été modifiée`);
            this.props.updateDeclaration(declaration);
            this.setState({ redirect: true });
          })
          .catch((error: any) => {
            console.error(error);
          });
      } else {
        api
          .insertDeclaration(declaration)
          .then((data: any) => {
            window.alert(
              `La déclaration a bien été ajoutée ` + data.data.declaration._id
            );
            this.props.addDeclaration(data.data.declaration);
            this.setState({ redirect: true });
          })
          .catch((error) => {
            window.alert(error);
            console.error(error);
          });
      }
    } else {
      error = true;
    }
    this.setState({ error });
  };

  getParams = async (): Promise<string> => {
    this.params = this.props;
    return new Promise((resolve) => {
      console.log("get params");
      if (this.params.match.params.id) {
        resolve(this.params.match.params.id);
      } else {
        resolve();
      }
    });
  };

  getDeclaration = async (id: string): Promise<Declaration> => {
    const { declarations } = this.props;

    return new Promise((resolve, reject) => {
      console.log("get getDeclaration");
      if (id) {
        const indexFind = declarations.findIndex(
          (decla: Declaration) => decla._id.toString() === id
        );
        resolve(declarations[indexFind]);
      } else {
        reject();
      }
    });
  };

  componentDidMount = async () => {
    let { declaration, employerSelected, isEdit } = this.state;
    let { auth, profile } = this.props;
    console.log("componentmount declaration form");
    await this.getParams().then((id: any) => {
      isEdit = id ? true : false;

      const user = profile.email;

      //Get active folder
      const folderPromise = !this.props.folder
        ? this.props.loadActiveFolder(user, auth)
        : Promise.resolve(this.props.folder);

      folderPromise.then(() => {
        declaration.folder = this.props.folder.id;

        //Get employers
        const employerPromise =
          !this.props.employers || this.props.employers.length === 0
            ? this.props.loadEmployers(auth)
            : Promise.resolve(this.props.employers);

        return employerPromise.then(() => {
          console.log("getEmployers");
          if (isEdit) {
            this.getDeclaration(id).then((decla) => {
              declaration = decla;
              employerSelected = this.getEmployerDeclarationUpdate(decla);

              this.setState({ isEdit, declaration, employerSelected });
            });
          }
        });
      });
    });
  };

  componentDidUpdate = async (prevProps: any) => {
    this.params = this.props;

    if (this.params.match.params.id !== prevProps.match.params.id) {
      let { isEdit } = this.state;
      let declaration = new Declaration();
      let employerSelected = { ...this.state.employerSelected };

      await this.getParams().then((id: string) => {
        isEdit = id ? true : false;

        if (isEdit) {
          this.getDeclaration(id).then((decla) => {
            declaration = decla;
            employerSelected = this.getEmployerDeclarationUpdate(decla);
            this.setState({ isEdit, declaration, employerSelected });
          });
        } else {
          this.setState({ isEdit });
        }
      });
    }
  };

  getEmployerDeclarationUpdate = (declaration: Declaration): Declaration => {
    let employerSelected = { ...this.state.employerSelected };
    console.log("employerSelected");

    employerSelected = this.props.employers.find(
      (emp: any) => emp.name === declaration.employer
    );

    return employerSelected;
  };

  render() {
    console.log("props form", this.props);
    const { folder, employers } = this.props;
    const {
      declaration,
      employerSelected,
      disabledHours,
      disabledDateEnd,
      redirect,
      isEdit,
    } = this.state;
    console.log("render");
    console.log(redirect, "redirect");
    if (redirect) {
      return <Redirect to="/declarations/list" />;
    }

    let render: any = (
      <React.Fragment>
        {folder && folder.active && (
          <Wrapper>
            <Title>
              {isEdit ? "Modifier une déclaration" : "Ajouter une déclaration"}
            </Title>
            <form>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <TextField
                    name="annexe"
                    select={true}
                    value={declaration.annexe ? declaration.annexe : ""}
                    onChange={this.handleChange}
                    label="Annexe"
                    variant="outlined"
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  >
                    {annexe.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="form-group col-md-4">
                  <TextField
                    label="Date début"
                    name="dateStart"
                    type="date"
                    required
                    value={
                      isEdit
                        ? moment(declaration.dateStart!).format("Y-MM-DD")
                        : declaration.dateStart
                        ? declaration.dateStart
                        : ""
                    }
                    variant="outlined"
                    onChange={this.handleChange}
                    InputProps={{
                      inputProps: {
                        min: moment(folder.dateStart!).format("Y-MM-DD"),
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
                <div className="form-group col-md-4">
                  <TextField
                    label="Date fin"
                    name="dateEnd"
                    type="date"
                    value={
                      isEdit
                        ? moment(declaration.dateEnd!).format("Y-MM-DD")
                        : declaration.dateEnd
                        ? declaration.dateEnd
                        : ""
                    }
                    required
                    disabled={disabledDateEnd}
                    variant="outlined"
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <Autocomplete
                    options={employers}
                    onChange={this.autocompleteChange}
                    freeSolo={true}
                    value={employerSelected ? employerSelected : null}
                    getOptionLabel={(option: any) => option.name}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        name="employer"
                        onChange={this.handleChange}
                        label="Employeur"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                      />
                    )}
                  />
                </div>
                <div className="form-group col-md-6">
                  <TextField
                    label="Nom de l'événement"
                    name="label"
                    variant="outlined"
                    type="text"
                    onChange={this.handleChange}
                    value={declaration.label ? declaration.label : ""}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-4">
                  <TextField
                    label="Salaire brut"
                    name="grossSalary"
                    variant="outlined"
                    type="number"
                    onChange={this.handleChange}
                    value={
                      declaration.grossSalary ? declaration.grossSalary : ""
                    }
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: {
                        min: 1,
                      },
                    }}
                  />
                </div>
                <div className="form-group col-md-4">
                  <TextField
                    label="Salaire net"
                    name="netSalary"
                    variant="outlined"
                    type="number"
                    onChange={this.handleChange}
                    value={declaration.netSalary ? declaration.netSalary : ""}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: {
                        min: 1,
                      },
                    }}
                  />
                </div>
                <div className="form-group col-md-4">
                  <TextField
                    label="Nombre d'heures déclarées"
                    name="nbhours"
                    variant="outlined"
                    type="number"
                    onChange={this.handleChange}
                    value={declaration.nbhours ? declaration.nbhours : ""}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={disabledHours}
                    InputProps={{
                      inputProps: {
                        min: 1,
                      },
                    }}
                  />
                </div>
              </div>
              {this.state.error && (
                <Error>Veuillez renseigner tous les champs obligatoires</Error>
              )}
              <div className="footerForm">
                <Button variant="contained" href={"/declarations/list"}>
                  Annuler
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleSubmit}
                >
                  {isEdit ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </Wrapper>
        )}
      </React.Fragment>
    );

    return <React.Fragment>{render}</React.Fragment>;
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      addDeclaration,
      updateDeclaration,
      loadEmployers,
      addEmployer,
      loadActiveFolder,
    },
    dispatch
  );

function mapStateToProps(applicationState: any) {
  return {
    declarations: applicationState.declarationReducer.declarations,
    folder: applicationState.folderReducer.folder,
    employers: applicationState.employerReducer.employers,
    profile: applicationState.authReducer.profile,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeclarationForm);
