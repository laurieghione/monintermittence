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
}

class Statistic extends React.Component<StatisticProps & any, StatisticState> {
  constructor(props: StatisticProps & any) {
    super(props);
    this.state = {
      barData: [],
    };
  }

  getDeclarationByMonth = async (declarations: Declaration[]): Promise<any> => {
    let obj: any = null;
    let tableData: any[] = [];
    let nameMemory: any = "";

    return new Promise((resolve) => {
      declarations.map((d: Declaration) => {
        let month: any = moment(d.dateStart!).format("MMM");
        let year: any = moment(d.dateStart!).format("Y");
        let name = month + " " + year;

        if (!obj) {
          obj = {};
          obj.name = name;
          obj.y = d.nbhours;
        } else if (nameMemory !== name) {
          tableData.push(obj);
          obj = null;
        } else if (nameMemory === name) {
          obj.y += d.nbhours;
        }

        nameMemory = name;
      });
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
        this.getDeclarationByMonth(this.props.declarations).then(
          (data: any) => {
            console.log("highcharts data", data);
            this.setState({ barData: data });
          }
        );
      });
    }
  }

  render() {
    console.log("statistic render");
    console.log(this.props);
    const { barData } = this.state;
    if (barData) {
      const options = {
        title: {
          text: "Nombre d'heures / mois",
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
          <Title>Statistiques</Title>

          <HighchartsReact highcharts={Highcharts} options={options} />
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
