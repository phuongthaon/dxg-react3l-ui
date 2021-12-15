import React from "react";
import "./StandardTable.scss";
import "antd/dist/antd.css";
import { Table } from "antd";
import { Model } from "react3l-common/src/Model";
import { TFunction } from "i18next";
import classNames from "classnames";
// import nameof from "ts-nameof.macro";
import { ColumnProps } from "antd/lib/table";
import { UseMaster } from "./InterfaceStandardTable";
import { ExpandedRowRender } from "rc-table/lib/interface";
import arrowUp from "../../assets/image/arrow-up.png";
import arrowDown from "../../assets/image/arrow-down.png";
export interface StandardTableCustomProps extends UseMaster {
  columns?: ColumnProps<Model>[];
  isDragable?: boolean;
  isShowTitle?: boolean;
  translate?: TFunction;
  isExpandable?: boolean;
  expandedRowRend?: ExpandedRowRender<Model>;
  className?: string;
  sizeTable?: "large" | "medium" | "small";
  isLevel2?: boolean; //unset height for table level2
}
function StandardTable(props: StandardTableCustomProps) {
  const {
    list,
    columns,
    expandedRowRend,
    isExpandable,
    className,
    sizeTable,
    isDragable,
    rowSelection,
    isLevel2,
  } = props;

  React.useEffect(() => {
    const antTable = document.getElementsByClassName(
      "page-table"
    )[0] as HTMLElement;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    if (isDragable) {
      const handleMouseDown = (e: any) => {
        isDown = true;
        antTable.classList.add("active-draggable");
        startX = e.pageX - antTable.offsetLeft;
        scrollLeft = antTable.scrollLeft;
      };

      const handleMouseLeave = () => {
        isDown = false;
        antTable.classList.remove("active-draggable");
      };

      const handleMouseUp = () => {
        isDown = false;
        antTable.classList.remove("active-draggable");
      };

      const handleMouseMove = (e: any) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - antTable.offsetLeft;
        const walk = (x - startX) * 3;
        antTable.scrollLeft = scrollLeft - walk;
      };

      antTable.addEventListener("mousedown", handleMouseDown);

      antTable.addEventListener("mouseleave", handleMouseLeave);

      antTable.addEventListener("mouseup", handleMouseUp);

      antTable.addEventListener("mousemove", handleMouseMove);

      return () => {
        antTable.removeEventListener("mousedown", handleMouseDown);
        antTable.removeEventListener("mouseleave", handleMouseLeave);
        antTable.removeEventListener("mouseup", handleMouseUp);
        antTable.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isDragable]);

  return (
    <>
      <div className={classNames("page-table", isLevel2 ? "" : "height-500px")}>
        <Table
          className={classNames(
            className,
            `table-size-${sizeTable}`,
            "custom-scrollbar"
          )}
          columns={columns}
          pagination={false}
          expandable={
            isExpandable
              ? {
                  expandedRowRender: expandedRowRend,
                  expandIcon: ({ expanded, onExpand, record }) =>
                    expanded ? (
                      <img
                        src={arrowUp}
                        alt="up"
                        className="icon-table-expand"
                        onClick={(e) => onExpand(record, e)}
                      />
                    ) : (
                      <img
                        src={arrowDown}
                        alt="down"
                        className="icon-table-expand"
                        onClick={(e) => onExpand(record, e)}
                      />
                    ),
                }
              : null
          }
          dataSource={list}
          rowSelection={rowSelection}
        />
      </div>
    </>
  );
}
StandardTable.defaultProps = {
  isExpandable: false,
  sizeTable: "large",
  isLevel2: false,
};
export default StandardTable;
