import React from "react";
import { bindActionCreators } from "redux";
import styled from "styled-components";
import { connect } from "react-redux";
import moment from "moment";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { loadDeclarations } from "../store/actions/declarationAction";
import Declaration from "../model/declaration";

const Title = styled.h2.attrs({
  className: "title",
})``;

const Wrapper = styled.div.attrs({
  className: "container",
})``;

interface StatisticProps {
  declarations: any;
}
interface StatisticState {
  barData: any;
  pieData: any;
}

class Statistic extends React.Component<StatisticProps & any, StatisticState> {
  constructor(props: StatisticProps & any) {
    super(props);
    this.state = {
      barData: [],
      pieData: [],
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
      declarations.map((decla: Declaration) => {
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
    const { isFetching, folder } = this.props;

    if (!isFetching && folder) {
      const declarationPromise =
        !this.props.declarations || this.props.declarations.length === 0
          ? this.props.loadDeclarations(folder._id)
          : Promise.resolve(this.props.declarations);

      declarationPromise.then(() => {
        this.getDatas(this.props.declarations).then((data: any) => {
          console.log("highcharts data", data);
          this.setState({ barData: data.bar, pieData: data.pie });
        });
      });
    }
  }

  render() {
    console.log("statistic render");
    console.log(this.props);
    const { barData, pieData } = this.state;
    if (barData) {
      const pieOptions = {
        title: {
          text: "Nombre d'heures / Employeurs",
        },
        chart: {
          type: "pie",
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
        <Wrapper>
          <Title>Statistiques du dossier en cours</Title>
          <div className="charts">
            <HighchartsReact highcharts={Highcharts} options={barOptions} />
            <HighchartsReact highcharts={Highcharts} options={pieOptions} />
          </div>
        </Wrapper>
      );
    }
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
