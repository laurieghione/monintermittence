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
  employer: Employer[],
  redirect: boolean
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


export class DeclarationForm extends React.Component<DFProps, DFState>{

  constructor ( props : DFProps){
    super(props)
    this.state = {
      declaration: new Declaration(), 
      error: false,
      folder : new Folder(),
      disabledHours : false,
      disabledDateEnd: false,
      redirect: false,
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
      console.log(this.state.declaration)

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

      const {declaration, employer} = this.state

      event.preventDefault();

      let formIsValid = this.handleValidation();
      let employerExist: boolean = false;

      if(formIsValid){
        // Manage employer
        employer.map((empl)=>{
          if(empl.name === declaration.employer){
              employerExist = true;
          }
          return employerExist;
        })

        if(!employerExist){
          let empl: Employer = new Employer()
          empl.name = declaration.employer

          api.insertEmployer(empl).then(() => {
          }).catch((error) => {
            console.error(error);
          });
        }

        api.insertDeclaration(declaration).then(() => {
          window.alert(`La déclaration a bien été ajoutée`);
           this.setState({redirect: true});
        }).catch((error) => {
          console.error(error);
        });
      }else
      {
        this.setState({error:true})
      }
    }

    componentDidMount= () =>{

      api.getActiveFolder().then(res => {
        let newDeclaration = this.state.declaration;
        if(res.data.data){
          newDeclaration.folder = res.data.data._id
          this.setState({declaration: newDeclaration, folder: res.data.data})
        }
      }).catch((error) => {
        console.error(error);
      });

      api.getEmployers().then(res => {
        if(res.data.data){
          this.setState({employer: res.data.data})
        }
      }).catch((error) => {
        console.error(error);
      });
    }

    render() {
      const {declaration, folder, disabledHours,disabledDateEnd, employer, redirect } = this.state

      if (redirect) {
        return <Redirect to="/declarations/list" />;
      }

      return (
        <React.Fragment>
        {this.state.folder.dateStart && (
        <Wrapper>
          <Title>Ajouter une déclaration</Title>
          <form >
            <div className="form-row">
              <div className="form-group col-md-4">
              <TextField name="annexe" 
                select={true}
                value={declaration.annexe} 
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
                required
                disabled={disabledDateEnd}
                variant="outlined"
                onChange={this.handleChange}
                value={declaration.dateEnd ? declaration.dateEnd : ''} 
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
                getOptionLabel={(option: any) => option.name}
                renderInput={(params: any) => <TextField {...params} name="employer" 
                value={declaration.employer} onChange={this.handleChange} label="Employeur"
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
                  value={declaration.netSalary ? declaration.netSalary : ''}
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
              <Button onClick={this.handleSubmit}>Ajouter</Button>
          </form>
        </Wrapper>)
        }
         </React.Fragment>
      );
    }
  }

  function mapStateToProps(state : any) {
    return {
      declaration: state.declaration
    };
  }

  export default connect( mapStateToProps, null)(DeclarationForm)


  