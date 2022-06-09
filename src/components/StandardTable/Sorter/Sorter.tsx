import { ArrowDown16, ArrowUp16 } from "@carbon/icons-react";
import classNames from "classnames";
import React from "react";
import "./Sorter.scss";

export interface SorterProps {
  sortedColumn?: any;
}

function Sorter(props: SorterProps) {
  const { sortedColumn } = props;

  return (
    <div className="sorter-container">
      {sortedColumn ? (
        sortedColumn.order === "ascend" ? (
          <ArrowUp16 className="sort-default"/>
        ) : (
          <>
            {sortedColumn.order === "descend" && (
              <ArrowUp16 className="sorter-down sort-default" />
            )}
          </>
        )
      ) : null}

      <div
        className={classNames("sort-action")}
      >
        <ArrowUp16 />
        <ArrowDown16 />
      </div>
    </div>
  );
}

export default Sorter;
