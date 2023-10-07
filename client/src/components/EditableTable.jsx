import { Button, Form, Input, Popconfirm, Table } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import "../styles/components/EditableTable.module.css";
import * as api from "../ApiCalls";
import { useRecoilState } from "recoil";
import { pressed_delete_atom, session_data_atom } from "../atoms";

const columnNameConfig = {
  session_time: "Start time",
  distance: "Distance (m)",
  duration: "Duration (mins)",
  swim_duration: "Swim duration (mins)",
  stroke_rate: "SR",
  intensity_factor: "IF",
  sss: "SSS",
};

const EditableTable = ({ dataSource = {} }) => {
  const [data, setData] = useRecoilState(session_data_atom);
  const [deletedSession, setDeletedSession] =
    useRecoilState(pressed_delete_atom);
  const handleDelete = async (session_id) => {
    setDeletedSession(true);
    let res = await api.deleteSession(session_id);
    if (res.ok) {
      const newData = data.filter((item) => item.id !== session_id);
      setData(newData);
      setDeletedSession(false);
    }
  };

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
    cols.push({
      title: "",
      dataIndex: "operation",
      render: (i, record) => (
        <Popconfirm
          key={record.id}
          title="Are you sure you want to delete?"
          onConfirm={() => handleDelete(record.session_id)}
        >
          <Button
            key={record.id}
            type="primary"
            style={{
              marginBottom: 16,
            }}
            danger
          >
            Delete session
          </Button>
        </Popconfirm>
      ),
    });
    return cols;
  }

  const defaultColumns = createCols(Object.keys(dataSource[0]));

  return (
    <div>
      <Table
        key={dataSource.session_date}
        bordered
        dataSource={dataSource}
        columns={defaultColumns}
        pagination={false}
      />
    </div>
  );
};
export default EditableTable;
