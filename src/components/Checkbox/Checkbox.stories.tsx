import { Story } from "@storybook/react";
import React from "react";
import Checkbox from "./Checkbox";
import CheckboxGroup from "./CheckboxGroup";
export default {
  title: "Checkbox",
  component: Checkbox,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    checked: {
      defaultValue: false,
    },
  },
};
const listValueObject = [
  { id: 1, code: "NEW", name: "Mới tạo tạo tạo tạo tạo tạo tạo tạo" },
  { id: 2, code: "WAITING", name: "Chờ duyệt" },
  { id: 3, code: "DONE", name: "Hoàn thành" },
  { id: 4, code: "REJECT", name: "Từ chối" },
  { id: 5, code: "CANCEL", name: "Đã hủy" },
];

const Template: Story = (args) => {
  const [checked, setChecked] = React.useState<boolean>(false);

  const handleChangeChecked = React.useCallback((value) => {
    setChecked(value);
  }, []);

  const [values, setValues] = React.useState<number[]>([]);
  const handleChangeCheckboxGroup = React.useCallback((values) => {
    setValues(values);
  }, []);

  return (
    <div>
      <div>
        <div style={{ margin: "10px", width: "500px" }}>
          <Checkbox
            {...args}
            checked={checked || args.checked}
            onChange={handleChangeChecked}
          >
            {args.children}
          </Checkbox>
        </div>
      </div>
      <div>Checkbox Group</div>
      <div className="m-t--xxl">
        <CheckboxGroup
          label="Trạng thái duyệt"
          value={values}
          onChange={handleChangeCheckboxGroup}
          dataOptions={listValueObject}
        />
      </div>
    </div>
  );
};

export const Default = Template.bind({});
