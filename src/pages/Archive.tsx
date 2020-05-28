import React from "react";
import api from "../api";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import {
  getAllocation,
  getDeclarationByMonth,
  getTotalByDeclaration,
  getTotalByMonth,
  getSJM,
} from "./Summary";
import styled from "styled-components";
import { ArrowUpward } from "@material-ui/icons";
import moment from "moment";
import Folder from "../model/folder";

const Wrapper = styled.div.attrs({
  className: "container",
})``;

const Tag = styled.span.attrs({
  className: "tag",
})``;

const Title = styled.h2.attrs({
  className: "title",
})``;

const columns = [
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
];

interface ArchiveProps {
  profile: any;
  isFetching: boolean;
}

interface ArchiveState {
  folders: Folder[];
  activeId: number | null;
  isLoading: boolean;
}

class Archive extends React.Component<ArchiveProps, ArchiveState> {
  constructor(props: ArchiveProps) {
    super(props);
    this.state = {
      folders: [],
      isLoading: true,
      activeId: null,
    };
  }

  getFolders = (user: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      api
        .getFolders(user)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  toggleClick = (ev: any) => {
    let id: any = Number(ev.currentTarget.id);
    let activeId = this.state.activeId;
    if (activeId !== null && activeId === id) {
      id = null;
    }

    console.log("id", id);
    console.log("activeId", this.state.activeId);

    this.setState({ activeId: id });
  };

  getARE = async (folder: any) => {
    let workDays = 0;
    let nbDaysMonth = 0;
    await getDeclarationByMonth(folder.declarations).then(
      async (monthArray: any) => {
        let totalMonthArray: any[] = getTotalByMonth(monthArray);
        console.log("totalMonthArray", totalMonthArray);
        //for each total month data
        await Promise.all(
          totalMonthArray.map((totalMonth: any, index: number) => {
            nbDaysMonth += moment(index.toString(), "YYYYMM").daysInMonth();
            let workDays8 = Math.floor((totalMonth.nbhours8 / 8) * 1.4);
            let workDays10 = Math.floor((totalMonth.nbhours10 / 8) * 1.3);
            workDays += workDays8 + workDays10;

            console.log("mois : ", index.toString());
            console.log("jours travaillés : ", workDays8);
            console.log(
              "nb jours dans le mois : ",
              index.toString() +
                " " +
                moment(index.toString(), "YYYYMM").daysInMonth()
            );
            console.log(
              "nb jour indemnisables : ",
              moment(index.toString(), "YYYYMM").daysInMonth() -
                (workDays8 + workDays10)
            );
            return workDays;
          })
        );
      }
    );

    //folder total
    let conges = Math.floor((workDays * 2.5) / 24);
    let totalDays = nbDaysMonth - workDays - conges;

    let calcul = Math.round((totalDays * folder.aj * 100) / 100);
    let are = calcul / 12;
    console.log("nb jour sur la période indemnisables : ", workDays);
    console.log("conges : ", conges);
    console.log("ARE : ", are);
    return are;
  };

  getRenderFolders = () => {
    let render = this.state.folders.map((obj: any, index: number) => {
      return (
        <React.Fragment key={index}>
          <div className="archiveArray">
            <div
              className="folderArchive"
              id={index.toString()}
              onClick={this.toggleClick}
            >
              <div className="folderArchiveHeader">
                <p>
                  Dossier du {moment(obj.dateStart!).format("DD/MM/Y")} au
                  {" " + moment(obj.dateEnd!).format("DD/MM/Y")}
                </p>
                <div className="tags">
                  <Tag> ARE : {obj.are + ` €`}</Tag>
                  <Tag> SJM : {obj.sjm + ` €`}</Tag>
                  <Tag> AJ : {obj.aj + ` €`}</Tag>
                  <Tag>
                    {" "}
                    Brut :{" "}
                    {Math.round((obj.total.grossSalary * 100) / 100) + ` €`}
                  </Tag>
                  <Tag>
                    Net : {Math.round((obj.total.netSalary * 100) / 100) + ` €`}
                  </Tag>
                  <Tag>
                    {(obj.total.nbhours ? obj.total.nbhours : 0) + ` h`}
                  </Tag>
                </div>
              </div>
            </div>
            <div
              className={
                this.state.activeId === index ? "tableExpand" : "tableCollapse"
              }
            >
              <MaterialTable
                icons={{
                  SortArrow: React.forwardRef((props, ref) => (
                    <ArrowUpward {...props} fontSize="small" ref={ref} />
                  )),
                }}
                key={index}
                columns={columns}
                data={obj.declarations}
                options={{
                  filtering: false,
                  actionsColumnIndex: -1,
                  search: false,
                  paging: false,
                  showTextRowsSelected: false,
                  showTitle: false,
                  toolbar: false,
                }}
              />
            </div>
          </div>
        </React.Fragment>
      );
    });

    return render;
  };

  getDeclarationsByFolder = async (folders: any) => {
    let folderArray: any[] = [];

    await Promise.all(
      folders.map(async (folder: any) => {
        const result = await api
          .getDeclarationsByFolder(folder._id)
          .then(async (declarations) => {
            folder.declarations = declarations.data.data;
            folder.total = getTotalByDeclaration(folder.declarations);
            folder.sjm = getSJM(folder.total);
            folder.aj = getAllocation(folder.total);

            await this.getARE(folder).then((are: any) => {
              folder.are = are;
              return folder;
            });
            return folder;
          });
        return folderArray.push(result);
      })
    );
    return folderArray;
  };

  componentDidMount = () => {
    const { profile, isFetching } = this.props;

    if (!isFetching && profile) {
      this.getFolders(profile.email)
        .then((folders) => {
          if (folders.data.data.length > 0) {
            this.getDeclarationsByFolder(folders.data.data).then((data) => {
              this.setState({
                folders: data,
                isLoading: false,
              });
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        })
        .catch(() => {
          this.setState({
            isLoading: false,
          });
        });
    }
  };

  render() {
    const { isFetching } = this.props;
    const { isLoading, folders } = this.state;
    console.log("render archive", this.state);

    return (
      <React.Fragment>
        {isFetching || isLoading ? (
          <React.Fragment>
            <div className="loader">
              <CircularProgress size={70} />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {!isLoading && folders.length > 0 ? (
              <Wrapper>
                <Title>Dossiers clôturés</Title>
                {this.getRenderFolders()}
              </Wrapper>
            ) : (
              <React.Fragment>
                <div className="warning">
                  <p>Aucun dossier archivé</p>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}
function mapStateToProps(applicationState: any) {
  return {
    profile: applicationState.authReducer.profile,
    isFetching: applicationState.authReducer.isFetching,
  };
}

export default connect(mapStateToProps)(Archive);
