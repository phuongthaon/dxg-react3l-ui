import classNames from "classnames";
import React from "react";
import "./StatusLine.scss";

export interface StatusLineProps {
  className?: string;
  active?: boolean;
  name?: string;
  tableSize?: "large" | "medium" | "small";
}

function StatusLine(props: StatusLineProps) {
  const { className, active, name, tableSize } = props;
  return (
    <>
      <div
        className={classNames(className, `status-line-table-size-${tableSize}`)}
      >
        <i
          className={classNames(
            "tio-record",
            active ? "status-active" : "status-inactive"
          )}
        ></i>{" "}
        {name}
      </div>
    </>
  );
}
StatusLine.defaultProps = {
  active: false,
  tableSize: "large",
};
export default StatusLine;
