import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import 'moment/locale/fr'
import  Folder  from '../model/folder';
import Declaration from '../model/declaration';
import api from '../api';
import { Redirect } from 'react-router-dom';
import MaterialTable from 'material-table'
import {ArrowUpward, Edit, Delete, Close } from '@material-ui/icons'
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import { Button } from '@material-ui/core';
import CustomModal from '../components/CustomModal'
import { TextField } from '@material-ui/core';

const Title = styled.h2.attrs({
    className: 'title',
})``

const Wrapper = styled.div.attrs({
    className: 'container',
})`
padding: 0 40px 40px 40px;
`
const Month = styled.p.attrs({
})`
font-weight: bold;
`
const Tag = styled.span.attrs({
    className: 'tag',
})`
`
const Tagheaders = styled.span.attrs({
    className: 'tag',
})`
background-color: #084C88;
color: white;
`
interface SummaryProps {
}

interface SummaryState {
    declarations: any[],
    monthArray: any[],
    activeId: any[],
    totalMonthArray: any[],
    isLoading: boolean,
    openModalCloseFolder: boolean,
    openModalAddFolder: boolean,
    totalFolder: any,
    folder: any,
    tableRender: any,
    alloc: number,
    declarationUpdate: string | null
}

class Summary extends React.Component<SummaryProps,SummaryState> {

    private columns: any[];
    constructor(props : SummaryProps) {
        super(props)
        this.state = {
            declarations: [],
            monthArray: [],
            activeId: [],
            isLoading: true,
            alloc: 0,
            openModalCloseFolder: false,
            openModalAddFolder: false,
            tableRender: null,
            totalMonthArray: [],
            totalFolder: {},
            declarationUpdate: null,
            folder: new Folder()
        };

        this.columns = [
            {
                title: 'Date début',
                field: 'dateStart',
                render:  (row:any) => moment(row.dateStart).format('DD-MM-YYYY')
            },
            {
                title: 'Date fin',
                field: 'dateEnd',
                render: (row:any) => moment(row.dateEnd).format('DD-MM-YYYY')
            },
            {
                title: 'Employeur',
                field: 'employer'
            },
            {
                title: 'Nombre d\'heures',
                field: 'nbhours',
                render: (row: any) => (row.nbhours ? row.nbhours : 0 )
            },
            {
                title: 'Salaire net',
                field: 'netSalary',
                render: (row: any) => row.netSalary+ ' €'
            },
            {
                title: 'Salaire brut',
                field: 'grossSalary',
                render: (row: any) => row.grossSalary+ ' €'
            },
            {
                title: 'Taux horaire brut',
                field: 'rate',
                render: (row: any) =>((row.rate) ? row.rate : 0) + ' €'
            }
        ]
    }

    deleteDeclaration(declaration:any){
        api.deleteDeclarationById(declaration._id).then(()=>{
            window.location.reload(false);
        })
    }

    calculAllocation(salaryMax: number, salary: number, nbHours : number,
         nbHoursMax: number, txSalary : number, txc: number, min : number ):number{
        let indemJourn = 31.36;
        let a = 0;
        let b = 0;

        if(salary < salaryMax){
            a = ((indemJourn * ( txSalary * salary ) ) / 5000)
            b = ( indemJourn * ( 0.26 * nbHours ) ) / 507         
        } else {
            let diffSalary = salary - salaryMax;
            let diffHours = (nbHours ?  nbHours - nbHoursMax : 0);
            a = ((indemJourn * ( txSalary * salaryMax ) + 0.05 * diffSalary ) / 5000)
            b = ( indemJourn * ( 0.26 * nbHoursMax ) + 0.08 * diffHours ) / 507
        }

        let c = ( indemJourn * txc );

        let alloc = Math.round((a + b + c) * 100)/100;

      //  return (alloc < min ) ? min : alloc;
      return alloc;
    }

    getAllocation(totalFolder: any) : number {
        let maxAllocJ: number = 149.78;
        let alloc10 = 0;
        let alloc8 = 0;
 
        //annexe 8
        if(totalFolder.nbhours8 > 0){
        let grossSalaryMax = 14400;
        let nbHoursMax = 720;
        let allocMin = 38;
    
        alloc8 = this.calculAllocation(grossSalaryMax,totalFolder.grossSalary8,
            totalFolder.nbhours8, nbHoursMax, 0.42, 0.40, allocMin);
        }

        //annexe 10
        if(totalFolder.nbhours10 > 0){
        let grossSalaryMax = 13700;
        let nbHoursMax = 690;
        let allocMin = 44;
         
        alloc10 = this.calculAllocation(grossSalaryMax,totalFolder.grossSalary10,
            totalFolder.nbhours10, nbHoursMax, 0.36, 0.70, allocMin);
        }

        //total
        let total: number = Math.round((alloc8 + alloc10)*100)/100;

        return (total > maxAllocJ ) ?  maxAllocJ : total;
    }

    toggleClick = (ev: any) =>{
        let id = Number(ev.currentTarget.id);
        let actives = this.state.activeId.slice();
        let find: boolean = false;
        if(actives.length > 0){
            actives.map((active: Number )=>{
                if(active === id){
                    actives.splice(actives.indexOf(id), 1);
                    find = true;
                }
                return find
            })
        }
        if(!find){
         actives.push(id)
        }

        this.setState({activeId: actives});
    }

    getTableHeader = (index: number, totalMonthArray: any[]) =>{
        let month = moment(index.toString().substring(4)).format('MMMM').toUpperCase()
        let year = index.toString().substring(0,4)
        return(<React.Fragment key={index}>
            <div className="month" id={index.toString()} onClick={this.toggleClick}>
                <div className="monthHeader">
                    <Month>{month+' '+ year}</Month>
                    <div className="tags">
                    <Tag>Brut : {Math.round(totalMonthArray[index].grossSalary*100/100)+` €`}</Tag>
                    <Tag>Net : {Math.round(totalMonthArray[index].netSalary*100/100)+` €`}</Tag>
                    <Tag>{(totalMonthArray[index].nbhours ? totalMonthArray[index].nbhours : 0) +` h`}</Tag>
                    </div>
                </div>
            
            </div>
            </React.Fragment>)
    }

    getDeclarationByMonth = async (declarations: any): Promise<any> => {
        let monthArray: any[] = [];

        return new Promise((resolve) => {
            declarations.map((d: Declaration)=>{
                let month: any = (moment(d.dateStart!).format('MM'));
                let year: any = (moment(d.dateStart!).format('Y'));
                let index = year + month;
                if(!monthArray[index]){
                    monthArray[index] = [];
                }
                let rate = (d.nbhours && d.grossSalary) ? (d.grossSalary/d.nbhours) : 0 ; 
                d.rate = (Math.round(rate*100)/100);
                monthArray[index].push(d);
            })
            resolve(monthArray)
        })
    }

    getTotalByMonth = (monthsArray: any[]) :any =>{
        let totalMonthArray: any = [];

        monthsArray.map((monthdata: any, index: number )=>{
            if(!totalMonthArray[index]){
                totalMonthArray[index] = {
                    grossSalary : 0,
                    nbhours : 0,
                    netSalary : 0
                };
            }
            monthdata.map((declaration: any) => {
                totalMonthArray[index].grossSalary += declaration.grossSalary;
                totalMonthArray[index].nbhours += (declaration.nbhours) ? declaration.nbhours : 0;
                totalMonthArray[index].netSalary += declaration.netSalary;
            })
        })
        return totalMonthArray;

    }

    getTotalByFolder = (totalMonthArray: any[]) :any =>{
        let totalFolder={
            grossSalary: 0,
            nbhours: 0,
            netSalary: 0,
            rate: 0, 
            grossSalary8: 0,
            grossSalary10: 0,
            nbhours8: 0,
            nbhours10: 0}

        totalMonthArray.map((totalMonthdata: any )=>{
            totalFolder.netSalary += totalMonthdata.netSalary;

            if(Number(totalMonthdata.annexe) === 8){
                totalFolder.grossSalary8 += totalMonthdata.grossSalary;
                totalFolder.nbhours8 += totalMonthdata.nbhours;
            } else {
                totalFolder.grossSalary10 += totalMonthdata.grossSalary;
                totalFolder.nbhours10 += totalMonthdata.nbhours;
            }
        })

        totalFolder.grossSalary = totalFolder.grossSalary8 +  totalFolder.grossSalary10;
        totalFolder.nbhours = totalFolder.nbhours8 +  totalFolder.nbhours10;  
        totalFolder.rate = (totalFolder.grossSalary / totalFolder.nbhours);

        return totalFolder;
    }

    componentDidMount = () => {
        // get active folder
        moment.locale('fr');
        console.log("componentDidMount")
        api.getActiveFolder().then((folder: any) => {
            if(folder.data.data){
                api.getDeclarationsByFolder(folder.data.data._id).then((declarations: any)=>{
                    this.getDeclarationByMonth(declarations.data.data)
                    .then((monthArray :any)=>{
                        let totalMonthArray: any[] = this.getTotalByMonth(monthArray);
                        let totalFolder: any = this.getTotalByFolder(totalMonthArray);
                        let alloc: number = this.getAllocation(totalFolder);
          
                        let tableRender = monthArray.map((obj: any, index: number) => {
                            return ( this.getTableHeader(index, totalMonthArray) )           
                            })
                
                            this.setState({
                            declarations: declarations.data.data,
                            monthArray,
                            alloc,
                            totalMonthArray,
                            totalFolder,
                            isLoading:false,
                            tableRender,
                            folder: folder.data.data
                        })
                    })
      
                })
            
            }
        }).catch(error => {
            this.setState({isLoading:false})
        })
    }

    componentDidUpdate = (prevProps: any, prevState: any)=>{
        console.log('update')

        const {activeId, declarations, folder} = this.state

        if(prevState.activeId != activeId){
            const { totalMonthArray, monthArray } = this.state
            
            let tableRender = monthArray.map((obj, index) => {
                return (
                    <React.Fragment key={index}>
                        {this.getTableHeader(index, totalMonthArray)}
                        <div className={( this.state.activeId.some(a => (a === index)) ? 'tableExpand' : 'tableCollapse')}>
                        { this.state.activeId.some(a => (a === index)) && (
                            <MaterialTable 
                                icons={{
                                    SortArrow: React.forwardRef((props, ref) => <ArrowUpward {...props} fontSize="small" ref={ref}/>)
                                }}
                                key={index}
                                columns={this.columns}
                                data={obj}
                                options={{
                                    filtering: false,
                                    actionsColumnIndex: -1,
                                    search: false,
                                    paging: false,
                                    showTextRowsSelected: false,
                                    showTitle: false,
                                    toolbar: false
                                }}
                                actions={[
                                    {
                                        icon:  () => <Edit fontSize="small"/>,
                                        onClick: (event, rowData) => this.updateDeclaration(rowData)
                                    },
                                    {
                                        icon: () => <Delete fontSize="small"/>,
                                        onClick: (event, rowData) => this.deleteDeclaration(rowData)
                                    }
                                ]}
                                />
                        )}
                        </div>
                    </React.Fragment>
              )          
              })
              this.setState({tableRender})
        }
        else if(prevState.declarations.length !== declarations.length){
            api.getDeclarationsByFolder(this.state.folder._id).then((declarations: any)=>{
                this.getDeclarationByMonth(declarations.data.data)
                .then((monthArray :any)=>{
                    let totalMonthArray: any[] = this.getTotalByMonth(monthArray);
                    let totalFolder: any = this.getTotalByFolder(totalMonthArray);
                    let alloc: number = this.getAllocation(totalFolder);
      
                    let tableRender = monthArray.map((obj: any, index: number) => {
                        return ( this.getTableHeader(index, totalMonthArray) )           
                        })
            
                        this.setState({
                        declarations: declarations.data.data,
                        monthArray,
                        alloc,
                        totalMonthArray,
                        totalFolder,
                        isLoading:false,
                        tableRender
                    })
                })
  
            })
        }
        else if (prevState.folder.active !== folder.active){
                this.setState({declarations: [] }) 
        }
    }

    updateDeclaration = (declaration: any)=>{
        this.setState({declarationUpdate: declaration._id})
      
    }

    openModalClose=()=>{
        this.setState({openModalCloseFolder: true})
    }
    openModalAdd=()=>{
        this.setState({openModalAddFolder: true})
    }

    closeModalClose=()=>{
        this.setState({openModalCloseFolder: false})
    }

    closeModalAdd=()=>{
        this.setState({openModalAddFolder: false})
    }

    closeFolder=()=>{
        let {folder} = this.state
        console.log(folder)
        let newFolder = new Folder()
        newFolder.active = false
        newFolder.dateEnd = new Date()
        newFolder.id = folder._id
        newFolder.user = folder.user
        newFolder.dateStart = folder.dateStart
        newFolder.name = moment(newFolder.dateStart!).format('DD-MM-YYYY') + 
        ' / ' + moment(newFolder.dateEnd).format('DD-MM-YYYY')
       
        api.updateFolderById(newFolder.id, newFolder).then(()=>{
            this.setState({folder: newFolder, openModalCloseFolder: false})
        })
    }

    addFolder= () =>{
        let folder = this.state.folder;
        let newFolder:any
        folder.active = true
        //TODO: add real user
        folder.user = '5e86360d56dc0a72648fede2';
        api.insertFolder(newFolder).then(() => {
            window.alert(`Folder inserted successfully`)
            folder.id = newFolder._id
            this.setState({folder})
          }).catch((error: any) => {
            console.error(error);
          });
    }

    changeDateStart = (event: any) => {
        let folder = this.state.folder;
        if(event.target.name === 'dateStart'){
            folder.dateStart = event.target.value;
        }
        
        this.setState({ folder});
    }


    render() {

        if(this.state.isLoading){
            return (
            <div className="loader">
                <CircularProgress size={70} />
            </div>)
        }     

        const { declarations, tableRender, alloc, openModalCloseFolder,
             totalFolder, folder, declarationUpdate, openModalAddFolder } = this.state
        
        if(declarationUpdate!== null){
            return <Redirect to={`/declarations/form/${declarationUpdate}`}/>
        }

        console.log('render -> declarations', declarations)

        let sjm = Math.round((totalFolder.grossSalary/(totalFolder.nbhours/8))*100)/100;

        let closeModalBody = "Etes vous sur de vouloir clôturer le dossier en cours ?"
        let addModalBody = (<React.Fragment>
                <form>
                <div className="form-group col-md-6">
                    <TextField
                    label="Date début"
                    name="dateStart"
                    type="date"
                    required
                    variant="outlined"
                    onChange={this.changeDateStart}
                    InputLabelProps={{
                        shrink: true
                    }}
                />
                </div>
            </form>
            </React.Fragment>
        )

        return (
            <Wrapper>
                { folder.active ?
                (<React.Fragment>
                    <div className="folderHeader">
                    <Title>Dossier en cours </Title>
                     { alloc !==0 && 
                    
                        <div className="tags">
                        <Tagheaders>SJM : { sjm +`  €`}</Tagheaders>
                        <Tagheaders>AJ : {alloc+`  €`}</Tagheaders>
                        <Tagheaders>Brut : {Math.round(totalFolder.grossSalary*100)/100 +` €`}</Tagheaders>
                        <Tagheaders>Net : {Math.round(totalFolder.netSalary*100)/100+` €`}</Tagheaders>
                        <Tagheaders>{totalFolder.nbhours + ` h`}</Tagheaders>
                        </div>
                     }
                    </div>
                    <div className="buttonContainer">
                        <p>depuis le {(moment(folder.dateStart!).format('DD/MM/Y'))}</p>
                        <IconButton onClick={this.openModalClose} ><Close /></IconButton>
                    </div>
                    <CustomModal title="Clôturer le dossier" open={openModalCloseFolder} 
                    handleClose={this.closeModalClose} buttonSubmit="Clôturer" 
                    body={closeModalBody} handleSubmit={this.closeFolder}/>
                    { declarations.length > 0 && tableRender }
                 </React.Fragment>) : 
                 (<React.Fragment>
                     <div className="warning">
                         <p>Aucun dossier en cours</p>
                         <Button variant="contained" color="primary" onClick={this.openModalAdd}>Ajouter un dossier</Button>
                         <CustomModal title="Ajouter un dossier" open={openModalAddFolder} 
                        handleClose={this.closeModalAdd} buttonSubmit="Ajouter" 
                        body={addModalBody} handleSubmit={this.addFolder}/>
                     </div></React.Fragment>)}
            </Wrapper>
        )
    }
}

export default Summary