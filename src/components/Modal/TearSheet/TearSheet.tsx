import Button from "@Components/Button";
import Close20 from "@carbon/icons-react/es/close/20";
import { ModalProps as AntModalProps } from "antd";
import classNames from "classnames";
import React, { ReactNode } from "react";
import "./TearSheet.scss";

export interface TearSheetProps extends AntModalProps {
  children?: ReactNode;
  /**Is the modal footer (cancel, save button) visible or not*/
  visibleFooter?: boolean;
  /**Name of save button*/
  titleButtonSave?: string;
  /**Name of cancel button*/
  titleButtonCancel?: string;
  /**Cancel the form*/
  handleCancel?: (event: any) => void;
  /**Save the form*/
  handleSave?: (event: any) => void;
  /**Pass state of loading */
  loadingType?: "default" | "submitting" | "submitted" | "error";
  /**Pass the classname to change the style component*/
  className?: string;
  /**Control the TearSheet visible or not*/
  visible?: boolean;
  /**Title of header TearSheet */
  title?: string;
  /**Description of header TearSheet  */
  description?: string;
  /**Additional content of header TearSheet  */
  additionalContent?: string;
}

function TearSheet(props: TearSheetProps) {
  const {
    handleCancel,
    handleSave,
    className,
    visible,
    children,
    visibleFooter,
    title,
    description,
    additionalContent,
    titleButtonSave,
    titleButtonCancel,
  } = props;

  React.useEffect(() => {
    if (visible) {
      document
        .getElementById("tear-sheet__component")
        .classList.add("background-active");
      document
        .getElementById("tear-sheet__container")
        .classList.add("content-active");
    } else {
      if (
        document
          .getElementById("tear-sheet__container")
          .classList.contains("content-active")
      ) {
        document
          .getElementById("tear-sheet__component")
          .classList.remove("background-active");
        document
          .getElementById("tear-sheet__container")
          .classList.remove("content-active");
      }
    }
  }, [visible]);

  return (
    <div className="tear-sheet__component" id="tear-sheet__component">
      <div
        className={classNames("tear-sheet__container", className)}
        id="tear-sheet__container"
      >
        <div className="tear-sheet__header">
          <div className="tear-sheet__header-title">{title}</div>
          <div className="tear-sheet__header-description">{description}</div>
          {additionalContent && (
            <div className="tear-sheet__header-additional-content">
              {additionalContent}
            </div>
          )}
          <Button
            type="icon-only-ghost"
            className="btn btn--2xl button-close"
            icon={<Close20 />}
            onClick={handleCancel}
          />
        </div>
        <div
          className={classNames(
            "tear-sheet__body",
            visibleFooter ? "pb60px" : ""
          )}
        >
          {children}
        </div>
        {visibleFooter && (
          <div className="tear-sheet__footer">
            <Button type="bleed-secondary" onClick={handleCancel}>
              {titleButtonCancel}
            </Button>
            <Button type="bleed-primary" onClick={handleSave}>
              {titleButtonSave}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
TearSheet.defaultProps = {
  titleButtonSave: "Lưu",
  titleButtonCancel: "Đóng",
  visibleFooter: true,
};
export default TearSheet;
