import { Table } from "antd";
import React from "react";
import "../styles/components/EditableTable.module.css";

const columnNameConfig = {
  session_time: "Start time",
  distance: "Distance (m)",
  duration: "Duration (mins)",
  swim_duration: "Swim duration (mins)",
  stroke_rate: "SR",
  intensity_factor: "IF",
  sss: "SSS",
};

const SummaryTable = ({ dataSource = {} }) => {
  function createCols(colNames) {
    var cols = [];
    colNames.forEach((element, i) => {
      if (element == "intensity_factor") {
        cols[i] = {
          title: columnNameConfig[element],
          dataIndex: element,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) > 50 ? "red" : "green" },
              },
              children: <div>{text}</div>,
            };
          },
        };
      } else if (
        element != "coach_id" &&
        element != "session_id" &&
        element != "swimmer_id" &&
        element != "session_date"
      ) {
        cols[i] = {
          title: columnNameConfig[element],
          dataIndex: element,
        };
      }
    });
    return cols;
  }

  function getLastWeeksDate() {
    const now = new Date();

    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  var aWeekAgo = getLastWeeksDate();

  const curDate = new Date();
  var columns;
  if (dataSource[0] != null) {
    columns = createCols(Object.keys(dataSource[0]));
    dataSource = dataSource.filter((el) => {
      console.log(el);
      var d = new Date(el.session_date);
      return d > aWeekAgo;
    });
  }

  return (
    <div>
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};
export default SummaryTable;
