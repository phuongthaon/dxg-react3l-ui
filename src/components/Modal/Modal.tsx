import React, { ReactNode } from "react";
import "./Modal.scss";
import AntModal, { ModalProps as AntModalProps } from "antd/lib/modal";
import { TFunction } from "i18next";
import classNames from "classnames";
import Button from "components/Button";
export interface ModalCustomProps extends AntModalProps {
  handleCancel?: () => void;
  handleSave?: (value?: any) => void;
  children?: ReactNode;
  visibleFooter?: boolean;
  handleCreateNext?: () => void;
  handleDelete?: (value?: any) => void;
  model?: any;
  size?: "large" | "medium" | "small";
  keyButtonTranslate?: string;
  translate?: TFunction;
}
function Modal(props: ModalCustomProps) {
  const {
    handleCancel,
    handleSave,
    visibleFooter,
    size,
    translate,
    keyButtonTranslate,
    handleCreateNext,
  } = props;
  const renderModalFooter = React.useMemo(
    () => (
      <div className="footer-modal">
        <div
          className={classNames("button-bleed-footer", {
            "width-75": handleCreateNext && size === "large",
          })}
        >
          <Button
            type="bleed-secondary"
            className={classNames(
              handleCreateNext && size === "large" ? "button-33" : "button-50"
            )}
            onClick={handleSave}
          >
            <span>
              {keyButtonTranslate && translate
                ? translate(`${keyButtonTranslate}.save`)
                : "Save"}
            </span>
          </Button>
          {handleCreateNext && size === "large" && (
            <Button
              type="bleed-secondary"
              className="button-33"
              onClick={handleCreateNext}
            >
              <span>
                {keyButtonTranslate && translate
                  ? translate(`${keyButtonTranslate}.createNext`)
                  : "Create Next"}
              </span>
            </Button>
          )}

          <Button
            type="bleed-primary"
            className={classNames(
              handleCreateNext && size === "large" ? "button-33" : "button-50"
            )}
            onClick={handleCancel}
          >
            <span>
              {keyButtonTranslate && translate
                ? translate(`${keyButtonTranslate}.cancel`)
                : "Cancel"}
            </span>
          </Button>
        </div>
      </div>
    ),
    [
      handleCreateNext,
      size,
      handleSave,
      keyButtonTranslate,
      translate,
      handleCancel,
    ]
  );
  return (
    <>
      <AntModal
        {...props}
        style={{ top: 20 }}
        destroyOnClose={true}
        className={classNames("modal__container", `size-${size}`)}
        footer={visibleFooter ? renderModalFooter : null}
        onCancel={handleCancel}
      >
        <div className="modal_content">{props.children}</div>
      </AntModal>
    </>
  );
}
Modal.defaultProps = {
  size: "large",
};
export default Modal;
