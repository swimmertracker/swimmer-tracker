import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  TimePicker,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import React from "react";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const AddSessionForm = ({ onSubmit = (values) => {} }) => {
  const formRef = React.useRef(null);

  const onReset = () => {
    formRef.current?.resetFields();
  };

  const timePickerFormat = "HH:mm";
  return (
    <Form
      {...layout}
      ref={formRef}
      name="control-ref"
      onFinish={onSubmit}
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item
        label="Session date"
        name="session_date"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <DatePicker format={"YYYY-MM-DD"} />
      </Form.Item>
      <Form.Item
        label="Session time"
        name="session_time"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <TimePicker format={timePickerFormat} />
      </Form.Item>
      <Form.Item
        label="Stroke rate"
        name="stroke_rate"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Duration"
        name="duration"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Swim duration"
        name="swim_duration"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Distance"
        name="distance"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};
export default AddSessionForm;
