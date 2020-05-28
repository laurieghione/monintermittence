import React from "react";
import { bindActionCreators } from "redux";
import styled from "styled-components";
import { connect } from "react-redux";
import moment from "moment";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { loadDeclarations } from "../store/actions/declarationAction";
import Declaration from "../model/declaration";
import { CircularProgress } from "@material-ui/core";

const Title = styled.h2.attrs({
  className: "title",
})``;

const Wrapper = styled.div.attrs({
  className: "container",
})``;

interface StatisticProps {
  declarations: Declaration[];
  isFetching: boolean;
  folder: any;
  loadDeclarations: (folderId: string) => any;
}
interface StatisticState {
  barData: any;
  pieData: any;
  isLoading: boolean;
}

class Statistic extends React.Component<StatisticProps, StatisticState> {
  constructor(props: StatisticProps) {
    super(props);
    this.state = {
      barData: [],
      pieData: [],
      isLoading: true,
    };
  }

  getDatas = async (declarations: Declaration[]): Promise<any> => {
    let objBar: any = null;
    let objPie: any = null;
    let tableData: any = {};
    let tableBar: any[] = [];
    let tablePie: any[] = [];
    let nameMemory: any = "";

    return new Promise((resolve) => {
      declarations.forEach((decla: Declaration) => {
        let month: any = moment(decla.dateStart!).format("MMM");
        let year: any = moment(decla.dateStart!).format("Y");
        let name = month + " " + year;

        //pie chart
        if (
          !objPie ||
          (tablePie.length > 0 &&
            tablePie.findIndex((data) => data.name === decla.employer) === -1)
        ) {
          objPie = {};
          objPie.name = decla.employer;
          objPie.y = decla.nbhours;
          tablePie.push(objPie);
        } else if (
          tablePie.length > 0 &&
          tablePie.findIndex((data) => data.name === decla.employer) !== -1
        ) {
          let findIndex = tablePie.findIndex(
            (data) => data.name === decla.employer
          );
          tablePie[findIndex].y += decla.nbhours;
        }

        //bar chart
        if (!objBar) {
          objBar = {};
          objBar.name = name;
          objBar.y = decla.nbhours;
        } else if (nameMemory !== name) {
          tableBar.push(objBar);
          objBar = {};
          objBar.name = name;
          objBar.y = decla.nbhours;
        } else if (nameMemory === name) {
          objBar.y += decla.nbhours;
        }

        nameMemory = name;
      });

      tableBar.push(objBar);

      tableData.bar = tableBar;
      tableData.pie = tablePie;
      resolve(tableData);
    });
  };

  componentDidMount() {
    const { isFetching, folder, declarations } = this.props;

    if (!isFetching && folder) {
      const declarationPromise =
        !declarations || declarations.length === 0
          ? this.props.loadDeclarations(folder._id)
          : Promise.resolve(this.props.declarations);

      declarationPromise.then(() => {
        this.getDatas(this.props.declarations).then((data: any) => {
          console.log("highcharts data", data);
          this.setState({
            barData: data.bar,
            pieData: data.pie,
            isLoading: false,
          });
        });
      });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    console.log("statistic render");
    const { barData, pieData, isLoading } = this.state;

    const pieOptions = {
      title: {
        text: "Nombre d'heures / Employeurs",
      },
      chart: {
        type: "pie",
        width: 500,
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -40,
            style: {
              fontWeight: "bold",
              color: "white",
            },
          },
        },
      },
      credits: {
        enabled: false,
      },

      legend: {
        enabled: false,
      },

      series: [
        {
          data: pieData,
        },
      ],
    };
    const barOptions = {
      title: {
        text: "Nombre d'heures / mois ",
      },
      chart: {
        type: "column",
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        type: "category",
      },
      yAxis: {
        title: {
          text: "Nombre d'heures",
        },
      },
      legend: {
        enabled: false,
      },

      series: [
        {
          data: barData,
        },
      ],
    };

    return (
      <React.Fragment>
        {isLoading ? (
          <React.Fragment>
            <div className="loader">
              <CircularProgress size={70} />
            </div>
          </React.Fragment>
        ) : this.props.folder ? (
          <Wrapper>
            <Title>Statistiques du dossier en cours</Title>
            <div className="charts">
              <HighchartsReact highcharts={Highcharts} options={barOptions} />
              <HighchartsReact
                containerProps={{ className: "pieChart" }}
                highcharts={Highcharts}
                options={pieOptions}
              />
            </div>
          </Wrapper>
        ) : (
          <React.Fragment>
            <div className="warning">
              <p>Aucun dossier en cours</p>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ loadDeclarations }, dispatch);

function mapStateToProps(applicationState: any) {
  return {
    declarations: applicationState.declarationReducer.declarations,
    isFetching: applicationState.authReducer.isFetching,
    folder: applicationState.folderReducer.folder,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Statistic);
