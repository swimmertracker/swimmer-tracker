import { React, useState, useEffect } from "react";
import { Tabs, Card, Space, Button, Modal, DatePicker } from "antd";
import EditableTable from "../components/EditableTable";
import DailySummaryTable from "../components/DailySummaryTable";
import * as api from "../ApiCalls";
import AddSessionForm from "../components/AddSessionForm";
import { useRecoilState } from "recoil";
import { pressed_delete_atom, session_data_atom, user_id_atom } from "../atoms";
import Loading from "../components/Loading";

function SwimmerStats() {
  const [data, setData] = useRecoilState(session_data_atom);
  const [userID, setUserID] = useRecoilState(user_id_atom);
  const [deletedSession, setDeletedSession] =
    useRecoilState(pressed_delete_atom);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const dataRes = await api.loadUserSessions(userID);
      setData(dataRes);
    }
    load();
  }, [modalOpen, deletedSession]);

  const session_dates = [
    ...new Set(
      data.map((entry) => {
        return entry.session_date;
      })
    ),
  ];
  session_dates.sort(function (a, b) {
    return new Date(a) - new Date(b);
  });

  const [query, setQuery] = useState("");
  const onChange = (e) => {
    setQuery(e ? e.format().substring(0, 10) : "");
  };

  const items = session_dates
    .filter((tab) => {
      return tab.startsWith(query);
    })
    .map((date, i) => {
      const id = i;
      return {
        label: date,
        key: id,
        children: (
          <div key={id}>
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <EditableTable
                dataSource={data.filter((x) => x.session_date == date)}
              />
            </Space>
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <h3>Summary for {date}</h3>
            </Space>

            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <DailySummaryTable
                dataSource={data.filter((x) => x.session_date == date)}
              />
            </Space>
          </div>
        ),
      };
    });

  const getContent = () => {
    if (session_dates.length === 0) {
      return <Loading />;
    } else if (items.length === 0) {
      return <h1>No sessions found</h1>;
    } else {
      return (
        <Tabs
          defaultActiveKey="1"
          tabPosition="left"
          style={{
            height: 600,
          }}
          items={items}
        />
      );
    }
  };

  return (
    <div>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: "flex",
        }}
      >
        <Card
          title={
            <Space>
              Session Manager{" "}
              <Button onClick={() => setModalOpen(true)}>Add Session</Button>
              <Modal
                title="Add Session"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={<></>}
              >
                <AddSessionForm
                  onSubmit={async (values) => {
                    setModalOpen(false);
                    values.session_date = values.session_date
                      .format()
                      .substring(0, 10);
                    values.session_time = values.session_time
                      .format()
                      .substring(11, 16);
                    values.swimmer_id = userID;
                    values.distance = parseInt(values.distance);
                    values.stroke_rate = parseInt(values.stroke_rate);
                    values.duration = parseInt(values.duration);
                    values.swim_duration = parseInt(values.swim_duration);
                    console.log(JSON.stringify(values));
                    var res = await api.addSession(JSON.stringify(values));
                    if (res.ok) {
                      let json = await res.json();
                      setData([...data, json]);
                    }
                  }}
                />
              </Modal>
            </Space>
          }
          size="small"
        >
          <DatePicker onChange={onChange} format={"YYYY-MM-DD"} />
          {getContent()}
        </Card>
      </Space>
    </div>
  );
}

export default SwimmerStats;
