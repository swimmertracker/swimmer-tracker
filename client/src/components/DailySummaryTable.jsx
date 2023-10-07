import { Button, Form, Input, Popconfirm, Table } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import "../styles/components/EditableTable.module.css";

const columnNameConfig = {
  distance: "Total Distance (m)",
  duration: "Total Duration (mins)",
  swim_duration: "Total Swim duration (mins)",
  intensity_factor: "Average IF",
  sss: "Total SSS",
};

const DailySummaryTable = ({ dataSource = {} }) => {
  function createCols(colNames) {
    var cols = [];
    colNames.forEach((element, i) => {
      if (
        element != "coach_id" &&
        element != "session_id" &&
        element != "swimmer_id" &&
        element != "session_time" &&
        element != "stroke_rate" &&
        element != "session_date"
      ) {
        cols[i] = {
          title: columnNameConfig[element],
          dataIndex: element,
          editable: true,
        };
      }
    });
    return cols;
  }

  function aggregate(data) {
    var durationTotal = 0;
    var sssTotal = 0;
    var distanceTotal = 0;
    var IFTotal = 0;
    var swimDurationTotal = 0;
    console.log(data)
    data.forEach((e,i) => {
      console.log(e, i)
      durationTotal += e.duration;
      sssTotal += e.sss;
      distanceTotal += e.distance;
      IFTotal += e.intensity_factor;
      swimDurationTotal += e.swim_duration;
    });

    return {
      duration: durationTotal,
      distance: distanceTotal,
      sss: sssTotal.toFixed(2),
      intensity_factor: (IFTotal / data.length).toFixed(2),
      swim_duration: swimDurationTotal,
    };
  }

  var aggData = aggregate(dataSource);

  const columns = createCols(Object.keys(aggData));
  return (
    <div>
      <Table
        bordered
        dataSource={[aggData]}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};
export default DailySummaryTable;
