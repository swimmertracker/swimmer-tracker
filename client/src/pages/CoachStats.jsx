import { React, useState, useEffect } from "react";
import { Tabs, Card, Space, Button, Modal, DatePicker } from "antd";
import EditableTable from "../components/EditableTable";
import CustomTable from "../components/DailySummaryTable";
import * as api from "../ApiCalls";
import AddSessionForm from "../components/AddSessionForm";
import { useRecoilState } from "recoil";
import { session_data_atom, user_id_atom } from "../atoms";

function CoachStats() {
  const [data, setData] = useRecoilState(session_data_atom);
  const [userID, setUserID] = useRecoilState(user_id_atom);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setData(await api.loadUserSessions(userID));
    }
    load();
  }, [modalOpen]);

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
              <h1>Summary for {date}</h1>
            </Space>

            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <CustomTable
                data={data.filter((x) => x.session_date == date)}
                pagination={false}
              />
            </Space>
          </div>
        ),
      };
    });

  const getContent = () => {
    if (session_dates.length === 0) {
      return <>Loading</>;
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
                    values.stroke_rate = parseInt(values.stroke_rate);
                    values.duration = parseInt(values.duration);
                    values.distance = parseInt(values.distance);
                    values.user_id = userID;
                    values.session_date = values.session_date
                      .format()
                      .substring(0, 10);
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

export default CoachStats;
