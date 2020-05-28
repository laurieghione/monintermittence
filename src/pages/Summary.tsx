import React from "react";

import { bindActionCreators } from "redux";
import moment from "moment";
import { connect } from "react-redux";
import styled from "styled-components";

import "moment/locale/fr";
import Declaration from "../model/declaration";
import api from "../api";
import { Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import { ArrowUpward, Edit, Delete, Close, GetApp } from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import { Button } from "@material-ui/core";
import {
  loadDeclarations,
  deleteDeclaration,
} from "../store/actions/declarationAction";
import ModalAddFolder from "../components/ModalAddFolder";
import ModalCloseFolder from "../components/ModalCloseFolder";

const Title = styled.h2.attrs({
  className: "title",
})``;

const Wrapper = styled.div.attrs({
  className: "container",
})``;
const Month = styled.p.attrs({})`
  font-weight: bold;
`;
const Tag = styled.span.attrs({
  className: "tag",
})``;
const Tagheaders = styled.span.attrs({
  className: "tag",
})`
  background-color: #084c88;
  color: white;
`;

function calculAllocation(
  salaryMax: number,
  salary: number,
  nbHours: number,
  nbHoursMax: number,
  txSalary: number,
  txc: number,
  min: number
): number {
  let indemJourn = 31.36;
  let a = 0;
  let b = 0;

  if (salary < salaryMax) {
    a = (indemJourn * (txSalary * salary)) / 5000;
    b = (indemJourn * (0.26 * nbHours)) / 507;
  } else {
    let diffSalary = salary - salaryMax;
    let diffHours = nbHours ? nbHours - nbHoursMax : 0;
    a = (indemJourn * (txSalary * salaryMax) + 0.05 * diffSalary) / 5000;
    b = (indemJourn * (0.26 * nbHoursMax) + 0.08 * diffHours) / 507;
  }

  let c = indemJourn * txc;

  let alloc = Math.round((a + b + c) * 100) / 100;

  //  return (alloc < min ) ? min : alloc;
  return alloc;
}

export function getAllocation(totalFolder: any): number {
  let maxAllocJ: number = 149.78;
  let alloc10 = 0;
  let alloc8 = 0;

  //annexe 8
  if (totalFolder.nbhours8 > 0) {
    let grossSalaryMax = 14400;
    let nbHoursMax = 720;
    let allocMin = 38;

    alloc8 = calculAllocation(
      grossSalaryMax,
      totalFolder.grossSalary8,
      totalFolder.nbhours8,
      nbHoursMax,
      0.42,
      0.4,
      allocMin
    );
  }

  //annexe 10
  if (totalFolder.nbhours10 > 0) {
    let grossSalaryMax = 13700;
    let nbHoursMax = 690;
    let allocMin = 44;

    alloc10 = calculAllocation(
      grossSalaryMax,
      totalFolder.grossSalary10,
      totalFolder.nbhours10,
      nbHoursMax,
      0.36,
      0.7,
      allocMin
    );
  }

  //total
  let total: number = Math.round((alloc8 + alloc10) * 100) / 100;

  return total > maxAllocJ ? maxAllocJ : total;
}
export function getTotalFolder(totalMonthArray: any[]): any {
  let totalFolder = {
    grossSalary: 0,
    nbhours: 0,
    netSalary: 0,
    rate: 0,
    grossSalary8: 0,
    grossSalary10: 0,
    nbhours8: 0,
    nbhours10: 0,
  };

  totalMonthArray.forEach((totalMonthdata: any) => {
    totalFolder.netSalary += totalMonthdata.netSalary;
    totalFolder.grossSalary8 += totalMonthdata.grossSalary8;
    totalFolder.nbhours8 += totalMonthdata.nbhours8;
    totalFolder.grossSalary10 += totalMonthdata.grossSalary10;
    totalFolder.nbhours10 += totalMonthdata.nbhours10;
  });

  totalFolder.grossSalary =
    totalFolder.grossSalary8 + totalFolder.grossSalary10;
  totalFolder.nbhours = totalFolder.nbhours8 + totalFolder.nbhours10;
  totalFolder.rate = totalFolder.grossSalary / totalFolder.nbhours;

  return totalFolder;
}
export function getTotalByDeclaration(declarations: any): any {
  let total = {
    grossSalary: 0,
    nbhours: 0,
    netSalary: 0,
    grossSalary8: 0,
    grossSalary10: 0,
    nbhours8: 0,
    nbhours10: 0,
  };

  declarations.forEach((declaration: any) => {
    if (Number(declaration.annexe) === 8) {
      total.grossSalary8 += declaration.grossSalary;
      total.nbhours8 += declaration.nbhours;
    } else {
      total.grossSalary10 += declaration.grossSalary;
      total.nbhours10 += declaration.nbhours;
    }
    total.grossSalary += declaration.grossSalary;
    total.nbhours += declaration.nbhours ? declaration.nbhours : 0;
    total.netSalary += declaration.netSalary;
  });

  return total;
}
export function getTotalByMonth(declarationsMonthArray: any[]): any {
  let totalMonthArray: any = [];

  declarationsMonthArray.forEach((monthdata: any, index: number) => {
    totalMonthArray[index] = getTotalByDeclaration(monthdata);
  });
  return totalMonthArray;
}
export function getSJM(totalFolder: any) {
  return totalFolder.grossSalary && totalFolder.nbhours
    ? Math.round((totalFolder.grossSalary / (totalFolder.nbhours / 8)) * 100) /
        100
    : 0;
}
export function getDeclarationByMonth(declarations: any): Promise<any> {
  let monthArray: any[] = [];

  return new Promise((resolve) => {
    declarations.forEach((d: Declaration) => {
      let month: any = moment(d.dateStart!).format("MM");
      let year: any = moment(d.dateStart!).format("Y");
      let index = year + month;
      if (!monthArray[index]) {
        monthArray[index] = [];
      }
      let rate = d.nbhours && d.grossSalary ? d.grossSalary / d.nbhours : 0;
      d.rate = Math.round(rate * 100) / 100;
      monthArray[index].push(d);
    });
    resolve(monthArray);
  });
}

interface SummaryProps {
  declarations: Declaration[];
  folder: any;
  isFetching: boolean;
  loadDeclarations: (folderId: string) => any;
  deleteDeclaration: (declaration: Declaration) => void;
}

interface SummaryState {
  monthArray: any[];
  activeId: any[];
  totalMonthArray: any[];
  isLoading: boolean;
  openModal: boolean;
  totalFolder: any;
  tableRender: any;
  alloc: number;
  declarationUpdate: Declaration | null;
}

class Summary extends React.Component<SummaryProps, SummaryState> {
  private columns: any[];
  constructor(props: SummaryProps) {
    super(props);
    this.state = {
      monthArray: [],
      activeId: [],
      isLoading: true,
      alloc: 0,
      openModal: false,
      tableRender: null,
      totalMonthArray: [],
      totalFolder: {},
      declarationUpdate: null,
    };

    this.columns = [
      {
        title: "Date début",
        field: "dateStart",
        render: (row: any) => moment(row.dateStart).format("DD-MM-YYYY"),
      },
      {
        title: "Date fin",
        field: "dateEnd",
        render: (row: any) => moment(row.dateEnd).format("DD-MM-YYYY"),
      },
      {
        title: "Employeur",
        field: "employer",
      },
      {
        title: "Nombre d'heures",
        field: "nbhours",
        render: (row: any) => (row.nbhours ? row.nbhours : 0),
      },
      {
        title: "Salaire net",
        field: "netSalary",
        render: (row: any) => row.netSalary + " €",
      },
      {
        title: "Salaire brut",
        field: "grossSalary",
        render: (row: any) => row.grossSalary + " €",
      },
      {
        title: "Taux horaire brut",
        field: "rate",
        render: (row: any) => (row.rate ? row.rate : 0) + " €",
      },
    ];
  }

  deleteDeclaration(declaration: Declaration) {
    api.deleteDeclarationById(declaration._id).then(() => {
      this.props.deleteDeclaration(declaration);
    });
  }

  downloadFiles(declaration: Declaration) {
    api.getFileByDeclaration(declaration._id).then((data: any) => {
      let datas = data.data.file;
      if (datas.length > 0) {
        datas.forEach((element: any) => {
          let file = element.data;
          const downloadLink = document.createElement("a");
          const fileName = element.name;

          downloadLink.href = file;
          downloadLink.download = fileName;
          downloadLink.click();
        });
      }
    });
  }

  toggleClick = (ev: any) => {
    let id = Number(ev.currentTarget.id);
    let actives = this.state.activeId.slice();
    let find: boolean = false;
    if (actives.length > 0) {
      actives.map((active: Number) => {
        if (active === id) {
          actives.splice(actives.indexOf(id), 1);
          find = true;
        }
        return find;
      });
    }
    if (!find) {
      actives.push(id);
    }

    this.setState({ activeId: actives });
  };

  getTableHeader = (index: number, totalMonthArray: any[]) => {
    let month = moment(index.toString().substring(4))
      .format("MMMM")
      .toUpperCase();
    let year = index.toString().substring(0, 4);
    return (
      <React.Fragment key={index}>
        <div className="month" id={index.toString()} onClick={this.toggleClick}>
          <div className="monthHeader">
            <Month>{month + " " + year}</Month>
            <div className="tags">
              <Tag>
                Brut :{" "}
                {Math.round((totalMonthArray[index].grossSalary * 100) / 100) +
                  ` €`}
              </Tag>
              <Tag>
                Net :{" "}
                {Math.round((totalMonthArray[index].netSalary * 100) / 100) +
                  ` €`}
              </Tag>
              <Tag>
                {(totalMonthArray[index].nbhours
                  ? totalMonthArray[index].nbhours
                  : 0) + ` h`}
              </Tag>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  componentDidMount = () => {
    moment.locale("fr");
    console.log("componentDidMount summary");
    const { isFetching, folder, declarations } = this.props;

    if (!isFetching) {
      if (!folder) {
        this.setState({ isLoading: false });
        return;
      }
      //Get declarations
      const declarationPromise =
        !declarations || declarations.length === 0
          ? this.props.loadDeclarations(folder._id)
          : Promise.resolve(this.props.declarations);

      declarationPromise
        .then(() => {
          getDeclarationByMonth(this.props.declarations).then(
            (monthArray: any) => {
              let totalMonthArray: any[] = getTotalByMonth(monthArray);
              let totalFolder: any = getTotalFolder(totalMonthArray);
              let alloc: number = getAllocation(totalFolder);

              let tableRender = monthArray.map((obj: any, index: number) => {
                return this.getTableHeader(index, totalMonthArray);
              });

              this.setState({
                monthArray,
                alloc,
                totalMonthArray,
                totalFolder,
                isLoading: false,
                tableRender,
              });
            }
          );
        })
        .catch(() => {
          this.setState({ isLoading: false });
        });
    }
  };

  componentDidUpdate = (prevProps: any, prevState: any) => {
    console.log("component update");

    const { declarations } = this.props;
    const { activeId } = this.state;

    if (prevState.activeId != activeId) {
      const { totalMonthArray, monthArray } = this.state;

      let tableRender = monthArray.map((obj, index) => {
        return (
          <React.Fragment key={index}>
            {this.getTableHeader(index, totalMonthArray)}
            <div
              className={
                this.state.activeId.some((a) => a === index)
                  ? "tableExpand"
                  : "tableCollapse"
              }
            >
              {this.state.activeId.some((a) => a === index) && (
                <MaterialTable
                  icons={{
                    SortArrow: React.forwardRef((props, ref) => (
                      <ArrowUpward {...props} fontSize="small" ref={ref} />
                    )),
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
                    toolbar: false,
                  }}
                  actions={[
                    {
                      icon: () => <Edit fontSize="small" />,
                      onClick: (event, rowData) =>
                        this.updateDeclaration(rowData as Declaration),
                    },
                    {
                      icon: () => <Delete fontSize="small" />,
                      onClick: (event, rowData) =>
                        this.deleteDeclaration(rowData as Declaration),
                    },
                    {
                      icon: () => <GetApp fontSize="small" />,
                      onClick: (event, rowData) =>
                        this.downloadFiles(rowData as Declaration),
                    },
                  ]}
                />
              )}
            </div>
          </React.Fragment>
        );
      });
      this.setState({ tableRender });
    } else if (
      prevProps.declarations &&
      prevProps.declarations.length !== declarations.length
    ) {
      getDeclarationByMonth(declarations).then((monthArray: any) => {
        let totalMonthArray: any[] = getTotalByMonth(monthArray);
        let totalFolder: any = getTotalFolder(totalMonthArray);
        let alloc: number = getAllocation(totalFolder);

        let tableRender = monthArray.map((obj: any, index: number) => {
          return this.getTableHeader(index, totalMonthArray);
        });

        this.setState({
          monthArray,
          alloc,
          openModal: false,
          totalMonthArray,
          totalFolder,
          isLoading: false,
          tableRender,
        });
      });
    }
  };

  updateDeclaration = (declaration: Declaration) => {
    this.setState({ declarationUpdate: declaration });
  };

  displayModal = () => {
    this.setState({ openModal: true });
  };

  closeModal = () => {
    this.setState({ openModal: false });
  };

  render() {
    const { declarations, folder } = this.props;
    const {
      tableRender,
      alloc,
      openModal,
      totalFolder,
      declarationUpdate,
    } = this.state;

    if (this.state.isLoading) {
      return (
        <div className="loader">
          <CircularProgress size={70} />
        </div>
      );
    }

    if (declarationUpdate !== null) {
      console.log(declarationUpdate);
      return <Redirect to={`/declarations/form/${declarationUpdate._id}`} />;
    }

    console.log("render -> declarations", declarations);

    let sjm = getSJM(totalFolder);

    return (
      <Wrapper>
        {folder && folder.active ? (
          <React.Fragment>
            <div className="folderHeader">
              <Title>Dossier en cours </Title>
              {alloc !== 0 && (
                <div className="tags">
                  <Tagheaders>SJM : {sjm + `  €`}</Tagheaders>
                  <Tagheaders>AJ : {alloc + `  €`}</Tagheaders>
                  <Tagheaders>
                    Brut :{" "}
                    {Math.round(totalFolder.grossSalary * 100) / 100 + ` €`}
                  </Tagheaders>
                  <Tagheaders>
                    Net : {Math.round(totalFolder.netSalary * 100) / 100 + ` €`}
                  </Tagheaders>
                  <Tagheaders>{totalFolder.nbhours + ` h`}</Tagheaders>
                </div>
              )}
            </div>
            <div className="buttonContainer">
              <p>depuis le {moment(folder.dateStart!).format("DD/MM/Y")}</p>
              <IconButton onClick={this.displayModal}>
                <Close />
              </IconButton>
            </div>
            <ModalCloseFolder
              openModal={openModal}
              closeModal={this.closeModal}
            />
            {declarations.length > 0 && tableRender}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="warning">
              <p>Aucun dossier en cours</p>
              <Button
                variant="contained"
                color="primary"
                onClick={this.displayModal}
              >
                Ajouter un dossier
              </Button>
              <ModalAddFolder
                openModal={openModal}
                closeModal={this.closeModal}
              />
            </div>
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ loadDeclarations, deleteDeclaration }, dispatch);

function mapStateToProps(applicationState: any) {
  return {
    declarations: applicationState.declarationReducer.declarations,
    folder: applicationState.folderReducer.folder,
    isFetching: applicationState.authReducer.isFetching,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
