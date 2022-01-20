import {
  CheckmarkFilled16,
  CloseFilled16,
  WarningFilled16,
} from "@carbon/icons-react";
import { notification } from "antd";
import Button from "components/Button";
import { IconLoading } from "index";
import React, { RefObject } from "react";
import { Model } from "react3l-common";
import { Observable } from "rxjs";
import "./UploadFile.scss";
export interface FileModel {
  id?: number;
  fileId?: string | number;
  name?: string;
  url?: string;
  appUserId?: number;
  rowId?: string;
  content?: string;
  mimeType?: string;
  isFile?: boolean;
  key?: any;
  path?: string;
  level?: number;
  isDelete?: boolean;
  clearAction?: (fileId: string | number) => void;
  handleInput?: (e: any) => void;
}
export interface UploadFileProps<T extends Model> {
  files?: T[];
  isMultiple?: boolean;
  uploadContent?: string;
  updateList?: (files: FileModel[] | FileList) => void;
  uploadFile?: (files: File[] | Blob[]) => Observable<FileModel[]>;
  removeFile?: (fileId: string | number) => void;
  classModel?: new () => T;
  isBtnOutLine?: boolean;
}
export function UploadFile(props: UploadFileProps<Model>) {
  const {
    files: oldFiles,
    uploadContent,
    isMultiple,
    updateList,
    uploadFile,
    removeFile,
    classModel: ClassModel,
    isBtnOutLine,
  } = props;
  const [listFileLoading, setListFileLoading] = React.useState<File[]>([]);
  const [listFileLoaded, setListFileLoaded] = React.useState<File[]>([]);
  const fileRef: RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>();

  const handleClickButton = React.useCallback(() => {
    fileRef.current.click();
  }, []);

  const handleChangeFile = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      const files: File[] = [];

      let check = false;
      let totalSize = 0;
      Array.from(fileList).forEach((file) => {
        totalSize = totalSize + file.size;
        files.push(file);
        if (totalSize > 10000000) {
          notification.error({
            message: `Vượt quá dung lượng cho phép`,
            description: "File tải lên dung lượng phải dưới 10MB",
            placement: "bottomRight",
          });
          check = true;
        }
      });
      setListFileLoading([...files]);
      debugger;
      if (check) return null;
      if (files && files.length > 0) {
        uploadFile(files).subscribe(
          (res: FileModel[]) => {
            if (res && res.length > 0) {
              const fileRes: any[] = [];
              res.forEach((current) => {
                const mappingObj = new ClassModel();
                mappingObj.fileId = current.id;
                mappingObj.file = current;
                fileRes.push(mappingObj);
              });
              setListFileLoaded([...fileRes]);
              setListFileLoading([]);
              setTimeout(() => {
                setListFileLoaded([]);
                updateList(fileRes);
              }, 1000);
            }
          },
          (err) => {}
        );
      }
    },
    [ClassModel, updateList, uploadFile]
  );

  const renderOldFile = React.useCallback(
    (fileMapping, index) => {
      return fileMapping?.file?.errors ? (
        <div className="file-error" key={index}>
          <div className="file-container">
            <div>
              <span>{fileMapping.file.name}</span>
            </div>
            <div>
              <WarningFilled16 color="red" className="m-r--xxxs" />
              <CloseFilled16
                onClick={() => removeFile(fileMapping.fileId)}
                className="remove-file"
              />
            </div>
          </div>
          <div className="content-error">
            {fileMapping?.file?.errors && fileMapping?.file?.errors?.name}
          </div>
        </div>
      ) : (
        <div className="file-container" key={index}>
          <span>{fileMapping.file.name}</span>
          <CloseFilled16
            onClick={() => removeFile(fileMapping.fileId)}
            className="remove-file"
          />
        </div>
      );
    },
    [removeFile]
  );

  const renderLoadedFile = React.useCallback(
    (fileMapping, index) => {
      return fileMapping?.file?.errors ? (
        <div className="file-error" key={index}>
          <div className="file-container">
            <div>
              <span>{fileMapping.file.name}</span>
            </div>
            <div>
              <WarningFilled16 color="red" className="m-r--xxxs" />
              <CloseFilled16
                onClick={() => removeFile(fileMapping.fileId)}
                className="remove-file"
              />
            </div>
          </div>
          <div className="content-error">
            {fileMapping?.file?.errors && fileMapping?.file?.errors?.name}
          </div>
        </div>
      ) : (
        <div className="file-container" key={index}>
          <span>{fileMapping.file.name}</span>
          <CheckmarkFilled16 color="#0F62FE" />
        </div>
      );
    },
    [removeFile]
  );

  return (
    <div className="upload-button__container">
      <div>
        <Button
          type={isBtnOutLine ? "outline-primary" : "primary"}
          className="btn--lg"
          onClick={handleClickButton}
        >
          {uploadContent}
        </Button>
        <input
          type="file"
          style={{ display: "none" }}
          multiple={isMultiple}
          ref={fileRef}
          onChange={handleChangeFile}
        />
      </div>
      <div className="upload-button__list-file m-t--xxs">
        {oldFiles?.length > 0 &&
          oldFiles.map((fileMapping, index) =>
            renderOldFile(fileMapping, index)
          )}
        {/* Hiển thị file đã load xong */}
        {listFileLoaded?.length > 0 &&
          listFileLoaded.map((fileMapping, index) =>
            renderLoadedFile(fileMapping, index)
          )}
        {/* hiển thị file vừa load lần gần nhất */}
        {listFileLoading?.length > 0 &&
          listFileLoading.map((file, index) => (
            <div className="file-container" key={index}>
              <span>{file.name}</span>
              <IconLoading color="#0F62FE" />
            </div>
          ))}
        {/* hiển thị file đang loading */}
      </div>
    </div>
  );
}

UploadFile.defaultProps = {
  isMultiple: true,
  uploadContent: "Upload",
  isViewMode: false,
  files: [],
  isBtnOutLine: false,
};
export default UploadFile;
