import React from 'react';
import Declaration from '../model/declaration';
import Folder from '../model/folder';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components'
import api from '../api'
import moment from 'moment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, MenuItem} from '@material-ui/core';
import Employer from '../model/employer';
import { RouteProps } from 'react-router';

const Title = styled.h2.attrs({
    className: 'h2',
})`margin-bottom:30px;`

const Wrapper = styled.div.attrs({
    className: 'container-fluid',
})`
    padding: 50px;
`

const Error = styled.p.attrs({
})`
  color: red;font-size:12px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-secondary`,
})`
    margin: 15px 15px 15px 5px;
`

interface DFProps  {
}

interface DFState  {
  declaration : Declaration,
  error : boolean,
  disabledHours : boolean,
  disabledDateEnd : boolean,
  folder: Folder,
  isEdit: boolean,
  employer: Employer[],
  redirect: boolean,
  employerSelected: any | null
}

const annexe = [
  {
    value: '',
    label: '',
  },
  {
    value: '8',
    label: 'Technicien',
  },
  {
    value: '10',
    label: 'Artiste',
  }
];

export class DeclarationForm extends React.Component<DFProps & RouteProps, DFState>{
  private params: any;

  constructor ( props : DFProps){
    super(props)
    this.state = {
      declaration: new Declaration(), 
      error: false,
      folder : new Folder(),
      disabledHours : false,
      disabledDateEnd: false,
      redirect: false,
      isEdit: false,
      employerSelected: null,
      employer: []
    }
  }

    autocompleteChange = (event: any, value: any) => {
      let declaration = this.state.declaration
        if(value){
          declaration.employer = value.name
          this.setState({declaration})
        }

    }

    handleChange = (event : any) => {
      const {declaration,disabledDateEnd,disabledHours} = this.state

      let dDateEnd = disabledDateEnd;
      let dHours = disabledHours;

        if(event.target.name === 'annexe'){
          declaration.annexe = event.target.value;
            if(Number(declaration.annexe) === 10){
              declaration.nbhours = 12;
              dDateEnd = true;
              dHours = true;
            }else{
              declaration.nbhours = 0;
              dDateEnd = false;
              dHours = false;
            }
        }
        else if(event.target.name === 'dateStart'){
          declaration.dateStart = event.target.value;
          declaration.dateEnd = event.target.value;
        }
        else if(event.target.name === 'dateEnd'){
          declaration.dateEnd = event.target.value;
        }
        else if(event.target.name === 'employer'){
          declaration.employer = event.target.value;
        }
        else if(event.target.name === 'label'){
          declaration.label = event.target.value;
        }
        else if(event.target.name === 'netSalary'){
          declaration.netSalary = event.target.value;
        }
        else if(event.target.name === 'grossSalary'){
          declaration.grossSalary = event.target.value;
        }
        else if(event.target.name === 'nbhours'){
          declaration.nbhours = event.target.value;
        }
      this.setState({declaration, disabledHours : dHours, disabledDateEnd : dDateEnd });
    }

    handleValidation = () => {
      let formIsValid: boolean = true;

      if(this.state.declaration.annexe === ''){
        formIsValid = false;
     }
      else if( (this.state.declaration.employer === '')){
        formIsValid = false;
      }
      else if( (this.state.declaration.dateStart === null)){
        formIsValid = false;
      }
      else if( (this.state.declaration.dateEnd === null)){
        formIsValid = false;
      }

      return formIsValid;
    }
  
    handleSubmit = (event : any) => {
      event.preventDefault();
      let {declaration, employer, error } = this.state

      let formIsValid = this.handleValidation();
      let employerExist:any;

      if(formIsValid){
        // Manage employer
        employerExist = employer.find(empl => empl.name === declaration.employer)

        if(employerExist === undefined){
          let empl: Employer = new Employer()
          empl.name = declaration.employer

          api.insertEmployer(empl).then(() => {
          }).catch((error) => {
            console.error(error);
          });
        }

        if(this.state.isEdit){
          api.updateDeclarationById(declaration.id, declaration).then(() => {
             window.alert(`La déclaration a bien été modifiée`);
             this.setState({redirect: true});
          }).catch((error: any) => {
            console.error(error);
          });
        }else{
          api.insertDeclaration(declaration).then(() => {
            window.alert(`La déclaration a bien été ajoutée`);
            this.setState({redirect: true});
          }).catch((error) => {
            window.alert(error);
            console.error(error);
          });
        }
      }else
      {
        error = true
      }
      this.setState({error});
    }

    getParams = async(): Promise<string> => {
        this.params = this.props
        return new Promise((resolve) => {
          console.log("get params")
          if(this.params.match.params.id){
            resolve(this.params.match.params.id)
        }else{
          resolve()
        }
       })
    };

    getEmployers = async(): Promise<any> =>{
      return new Promise((resolve, reject) => {
        api.getEmployers().then(res => {
          console.log("get getEmployers")
          if(res.data.data){
            resolve(res.data.data)
          }
        }).catch((error) => {
          reject(error)
        });
      })
    }

    getActiveFolder = async() : Promise<Folder> =>{
      return new Promise((resolve, reject) => {
        console.log("get active folder")
        api.getActiveFolder().then(res => {
          if(res.data.data){
            resolve(res.data.data) 
          }
        }).catch((error) => {
          reject(error)
        });
    });
    }

    getDeclaration = async(id: string): Promise<any> => {
      let declarationUpdate: any
      return new Promise((resolve, reject) => {
        console.log("get getDeclaration")
        if(id){
          api.getDeclarationById(id).then(res =>{
            declarationUpdate = res.data.data
            declarationUpdate.id = res.data.data._id
            resolve(declarationUpdate)
          }).catch((error) => {
            reject(error)
          });
        }else{
          resolve()
        }
      })
     }

    componentDidMount = async () =>{
      let {declaration, folder, employer, employerSelected, isEdit } = this.state
      console.log('componentmount')
      await this.getParams().then(
        (id: any) => {
          isEdit = (id ? true : false) 
           this.getActiveFolder().then((fold)=>{
            folder = fold
            declaration.folder = fold._id
          })
          this.getEmployers().then((employers)=>{
            employer = employers
            this.getDeclaration(id).then((decla)=>{
              if(isEdit){
                declaration = decla
                employerSelected = this.getEmployerDeclarationUpdate(employers, decla)
              }
                this.setState({ isEdit, declaration, employer, folder, employerSelected });
              })
          })        
        })
    }

    componentDidUpdate= async(prevProps: any)=> {
      this.params = this.props
      
      if( this.params.match.params.id !== prevProps.match.params.id){
        let {employer, isEdit } = this.state
        let declaration = new Declaration();
        let employerSelected:any = null

        await this.getParams().then(
          (id: string) => {
            isEdit = (id ? true : false) 
           
              this.getDeclaration(id).then((decla)=>{
                if(isEdit){
                  declaration = decla
                  employerSelected = this.getEmployerDeclarationUpdate(employer, decla)  
                }
                this.setState({ isEdit, declaration, employerSelected });          
              })
             })
          }
    }

    getEmployerDeclarationUpdate = (employers :any, declaration:any): Declaration => {     
      let employerSelected = this.state.employerSelected
      console.log("employerSelected")

      employerSelected = employers.find((emp: any) => emp.name === declaration.employer)

      return employerSelected;
  }

    render() {
      const {declaration, folder,employerSelected, disabledHours,disabledDateEnd, employer, redirect, isEdit } = this.state
     console.log('render')
     console.log(redirect,'redirect')
      if (redirect) {
        return <Redirect to="/declarations/list" />;
      }

      let render: any = (
          <React.Fragment>
          {folder.dateStart && (
          <Wrapper>
            <Title>{isEdit ? "Modifier une déclaration" : "Ajouter une déclaration"}</Title>
            <form >
              <div className="form-row">
                <div className="form-group col-md-4">
                <TextField name="annexe" 
                  select={true}
                  value={declaration.annexe ? declaration.annexe : '' } 
                  onChange={this.handleChange} 
                  label="Annexe"
                  variant="outlined"
                  required
                  InputLabelProps={{
                    shrink: true
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
                  value={ isEdit ? moment(declaration.dateStart!).format('Y-MM-DD') : 
                  (declaration.dateStart ? declaration.dateStart : '' )}
                  variant="outlined"
                  onChange={this.handleChange}
                  InputProps={{
                    inputProps: { 
                        min: (moment(folder.dateStart!).format('Y-MM-DD')) 
                    }
                  }}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                </div>
                <div className="form-group col-md-4">
                <TextField
                  label="Date fin"
                  name="dateEnd"
                  type="date"
                  value={ isEdit ? moment(declaration.dateEnd!).format('Y-MM-DD') : 
                  (declaration.dateEnd ? declaration.dateEnd : '' )}
                  required
                  disabled={disabledDateEnd}
                  variant="outlined"
                  onChange={this.handleChange}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                </div>
               
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                <Autocomplete
                  options={employer}
                  onChange={this.autocompleteChange}
                  freeSolo={true}
                  value={employerSelected ? employerSelected : null} 
                  getOptionLabel={(option: any) => option.name}
                  renderInput={(params: any) => 
                  <TextField {...params} 
                  name="employer" 
                  onChange={this.handleChange} 
                  label="Employeur"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  required/>}
                />
                </div>
                <div className="form-group col-md-6">
                <TextField
                  label="Nom de l'événement"
                  name="label"
                  variant="outlined"
                  type="text"
                  onChange={this.handleChange}
                  value={declaration.label ? declaration.label : ''}
                  InputLabelProps={{
                    shrink: true
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
                    value={declaration.grossSalary ? declaration.grossSalary : ''}
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      inputProps: {
                        min: 1
                      }
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
                    value={ declaration.netSalary ? declaration.netSalary : ''}
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      inputProps: {
                        min: 1
                      }
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
                    value={declaration.nbhours ? declaration.nbhours : ''}
                    InputLabelProps={{
                      shrink: true
                    }}
                    disabled={disabledHours}
                    InputProps={{
                      inputProps: {
                        min: 1
                      }
                    }}
                  />
                </div>
              </div>
              {this.state.error && <Error>Veuillez renseigner tous les champs obligatoires</Error> }
                <CancelButton href={'/declarations/list'}>Annuler</CancelButton>
                <Button onClick={this.handleSubmit}>{isEdit ? "Modifier" : "Ajouter"}</Button>
            </form>
          </Wrapper>)
          }
           </React.Fragment>
        )

      return ( <React.Fragment>{render}</React.Fragment>)
    }
  }

  function mapStateToProps(state : any) {
    return {
      declaration: state.declaration
    };
  }

  export default connect( mapStateToProps, null)(DeclarationForm)


  