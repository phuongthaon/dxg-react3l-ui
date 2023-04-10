import classNames from "classnames";
import CloseFilled16 from "@carbon/icons-react/es/close--filled/16";
import React, { ReactSVGElement, RefObject } from "react";
import { ReactNode } from "react";
import { BORDER_TYPE } from "@Configs/enum";
import "./AdvanceNumberFilter.scss";

export const DECIMAL: string = "DECIMAL";
export const LONG: string = "LONG";

export interface AdvanceNumberProps {
  label?: string;
  type?: BORDER_TYPE;
  floatLabel?: boolean;
  isMaterial?: boolean;
  value?: number;
  prefix?: string | ReactNode;
  suffix?: string | ReactNode;
  allowPositive?: boolean;
  error?: string;
  numberType?: string;
  isReverseSymb?: boolean;
  decimalDigit?: number;
  placeHolder?: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  isSmall?: boolean;
  bgColor?: "white" | "gary";
  onChange?: (T: number) => void;
  onEnter?: (T: number) => void;
  onBlur?: (T: number) => void;
}

function AdvanceNumberFilter(props: AdvanceNumberProps) {
  const {
    label,
    type,
    prefix,
    suffix,
    value,
    allowPositive,
    numberType,
    decimalDigit,
    isReverseSymb,
    placeHolder,
    className,
    disabled,
    min,
    max,
    isSmall,
    bgColor,
    onChange,
    onEnter,
    onBlur,
  } = props;

  const [internalValue, setInternalValue] = React.useState<string>("");

  const inputRef: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(
    null
  );

  const cursorPosition = React.useRef({ selectionStart: 0, selectionEnd: 0 });

  const buildRegex = React.useCallback(() => {
    var regExDecimal = "";
    var regExString = "";
    for (let i = 1; i <= decimalDigit; i++) {
      regExDecimal += "\\d";
    }
    if (isReverseSymb) {
      regExString = "(\\d)(?=(?:\\d{3})+(?:,|$))|(," + regExDecimal + "?)\\d*$";
    } else {
      regExString =
        "(\\d)(?=(?:\\d{3})+(?:\\.|$))|(\\." + regExDecimal + "?)\\d*$";
    }
    return new RegExp(regExString, "g");
  }, [decimalDigit, isReverseSymb]);

  const formatString = React.useCallback(
    (inputValue: string): string => {
      const newRegEx = buildRegex();
      if (isReverseSymb) {
        switch (numberType) {
          case DECIMAL:
            if (allowPositive) {
              inputValue = inputValue
                .replace(/[^0-9,-]/g, "")
                .replace(",", "x")
                .replace(/,/g, "")
                .replace("x", ",")
                .replace(/(?!^)-/g, "");
            } else {
              inputValue = inputValue
                .replace(/[^0-9,]/g, "")
                .replace(",", "x")
                .replace(/,/g, "")
                .replace("x", ",");
            }
            return inputValue.replace(newRegEx, (m, s1, s2) => {
              return s2 || s1 + ".";
            });
          default:
            if (allowPositive) {
              inputValue = inputValue
                .replace(/[^0-9-]/g, "")
                .replace(/(?!^)-/g, "");
            } else {
              inputValue = inputValue.replace(/[^0-9]/g, "");
            }
            return inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
      } else {
        switch (numberType) {
          case DECIMAL:
            if (allowPositive) {
              inputValue = inputValue
                .replace(/[^0-9.-]/g, "")
                .replace(".", "x")
                .replace(/\./g, "")
                .replace("x", ".")
                .replace(/(?!^)-/g, "");
            } else {
              inputValue = inputValue
                .replace(/[^0-9.]/g, "")
                .replace(".", "x")
                .replace(/\./g, "")
                .replace("x", ".");
            }
            return inputValue.replace(newRegEx, (m, s1, s2) => {
              return s2 || s1 + ",";
            });
          default:
            if (allowPositive) {
              inputValue = inputValue
                .replace(/[^0-9-]/g, "")
                .replace(/(?!^)-/g, "");
            } else {
              inputValue = inputValue.replace(/[^0-9]/g, "");
            }
            return inputValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      }
    },
    [isReverseSymb, numberType, buildRegex, allowPositive]
  );

  const parseNumber = React.useCallback(
    (value: string): [number, boolean] => {
      var isOutOfRange, number, stringValue;
      if (value) {
        if (isReverseSymb) {
          stringValue = value.replace(/[,.]/g, (m) => (m === "." ? "," : "."));
          stringValue = stringValue.replace(/,/g, "");
        } else {
          stringValue = value.replace(/,/g, "");
        }
        switch (numberType) {
          case DECIMAL:
            number = parseFloat(stringValue);
            isOutOfRange =
              (typeof max === "number" && number > max) ||
                (typeof min === "number" && number < min)
                ? true
                : false;
            return [number, isOutOfRange];
          default:
            number = parseInt(stringValue);
            isOutOfRange =
              (typeof max === "number" && number > max) ||
                (typeof min === "number" && number < min)
                ? true
                : false;
            return [number, isOutOfRange];
        }
      } else {
        return [undefined, false];
      }
    },
    [numberType, isReverseSymb, min, max]
  );

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { selectionEnd, selectionStart } = event.target;
      const stringValue = formatString(event.target.value);
      const [numberValue, isOutOfRange] = parseNumber(stringValue);
      if (!isOutOfRange) {
        if (typeof onChange === "function") {
          const isSpecialLetter = /[-,.]/g.test(Array.from(stringValue)[0]);
          if (!isSpecialLetter) {
            onChange(numberValue);
          }
        }
        setInternalValue(stringValue);
      }
      if (event.target.value.length < stringValue.length) {
        cursorPosition.current.selectionStart = selectionStart + 1;
        cursorPosition.current.selectionEnd = selectionEnd + 1;
      } else {
        cursorPosition.current.selectionStart = selectionStart;
        cursorPosition.current.selectionEnd = selectionEnd;
      }
    },
    [formatString, parseNumber, onChange]
  );

  const handleClearInput = React.useCallback(
    (event: React.MouseEvent<ReactSVGElement, MouseEvent>) => {
      setInternalValue("");
      inputRef.current.focus();
      if (typeof onChange === "function") {
        onChange(undefined);
        return;
      }
      if (typeof onBlur === "function") {
        onBlur(undefined);
        return;
      }
      if (typeof onEnter === "function") {
        onEnter(undefined);
        return;
      }
    },
    [onBlur, onChange, onEnter]
  );

  const handleKeyPress = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        if (typeof onEnter === "function") {
          onEnter(parseNumber(event.currentTarget.value)[0]);
        }
      }
    },
    [onEnter, parseNumber]
  );

  const handleBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (typeof onBlur === "function") {
        onBlur(parseNumber(event.currentTarget.value)[0]);
      }
    },
    [onBlur, parseNumber]
  );

  React.useEffect(() => {
    if (value) {
      var stringValue = "" + value;
      if (isReverseSymb) {
        stringValue = stringValue.replace(/\./g, ",");
      }
      setInternalValue(formatString(stringValue));
    } else {
      setInternalValue("");
    }
  }, [value, formatString, isReverseSymb]);

  return (
    <div className={classNames("advance-number-filter__wrapper", className)}>
      <div className="advance-number-filter__label m-b--3xs">
        {type !== BORDER_TYPE.FLOAT_LABEL && label && (
          <label
            className={classNames("component__title", {
              "component__title--disabled": disabled,
            })}
          >
            {label}
          </label>
        )}
      </div>
      <div
        className={classNames(
          "component__input advance-number-filter__container p--xs",
          {
            "advance-number-filter__container--sm": isSmall,
            "advance-number-filter__container--white": bgColor === "white",
            "py--2xs": isSmall,
            "px--xs": isSmall,
            "p--xs": !isSmall,
            "advance-number-filter--material": type === BORDER_TYPE.MATERIAL,
            "advance-number-filter--disabled ": disabled,
            "advance-number-filter--float": type === BORDER_TYPE.FLOAT_LABEL,
          }
        )}
        onClick={() => {
          inputRef.current.focus();
        }}
      >
        {prefix && (
          <>
            {typeof prefix === "string" ? (
              <span className="p-r--2xs">{prefix}</span>
            ) : (
              <div className="m-r--xs advance-number-filter__icon">
                {prefix}
              </div>
            )}
          </>
        )}
        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          onBlur={handleBlur}
          placeholder={
            type === BORDER_TYPE.FLOAT_LABEL && label ? " " : placeHolder
          }
          ref={inputRef}
          disabled={disabled}
          className={classNames("component__input", {
            "disabled-field": disabled,
          })}
          min={min}
          max={max}
        />
        {type === BORDER_TYPE.FLOAT_LABEL && label && (
          <label
            className={classNames("component__title", {
              "component__title--normal": !prefix,
              "component__title--prefix": prefix,
              "component__title--sm": isSmall,
            })}
          >
            {label}
          </label>
        )}
        {internalValue && !disabled && (
          <div className={classNames("input-icon__clear", "m-l--2xs")}>
            <CloseFilled16 onClick={handleClearInput}></CloseFilled16>
          </div>
        )}
        {suffix && (
          <>
            {typeof suffix === "string" ? (
              <span className="body-text--md m-l--2xs">{suffix}</span>
            ) : (
              <div className="m-l--2xs">{suffix}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

AdvanceNumberFilter.defaultProps = {
  label: "",
  type: BORDER_TYPE.MATERIAL,
  isSmall: false,
  allowPositive: false,
  isReverseSymb: false,
  numberType: LONG,
  decimalDigit: 4,
  disabled: false,
  prefix: "",
  bgColor: "white",
};

export default AdvanceNumberFilter;
