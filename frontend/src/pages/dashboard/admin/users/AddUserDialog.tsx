import React, { useState } from "react";
import IUser, { Role } from "../../../../interfaces/IUser";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown";
import { Badge } from "primereact/badge";
import { InputNumber } from "primereact/inputnumber";
import formatFileSize from "../../../../helper/formatFileSize";
import { useSettingsContext } from "../../../../hooks/SettingsHook";

interface AddUserDialogProps {
  visible: boolean;
  onHide: () => void;
  onAdd: (user: IUser) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = (props) => {
  const { visible, onHide, onAdd } = props;
  const { settings } = useSettingsContext();
  const [maxSpace, setMaxSpace] = useState<number>(1000000);
  const [newUser, setNewUser] = useState<IUser>({
    name: "",
    email: "",
    role: Role.USER,
    password: "",
    maxSpace: 1000000, // 1MB
  });

  const validateName = () => {
    return (
      newUser.name.length > 3 &&
      newUser.name.match(/^[a-zA-Z0-9_]+$/) &&
      newUser.name.includes("_")
    );
  };

  const validateEmail = () => {
    return (
      newUser.email.length > 3 &&
      newUser.email.includes("@") &&
      newUser.email.includes(".")
    );
  };

  const validatePassword = () => {
    return newUser.password!.length > 8;
  };

  const validateUser = () => {
    return validateName() && validateEmail() && validatePassword();
  };

  const footerContent = (
    <div>
      <Button
        label="Cancel"
        icon="material-symbols-outlined mat-icon-close"
        onClick={onHide}
        outlined
      />
      <Button
        label="Add"
        icon="material-symbols-outlined mat-icon-plus"
        onClick={() => onAdd(newUser)}
        disabled={!validateUser()}
        autoFocus
        style={{ marginRight: "0" }}
      />
    </div>
  );

  const roleItemTemplate = (option: string) => {
    // @ts-ignore
    return <Badge value={option} severity={Role[option] === Role.ADMIN ? undefined : 'info'} />;
  };

  return (
    <div>
      <Dialog
        header="Add User"
        visible={visible}
        style={{ width: "50vw", maxWidth: "500px", minWidth: "300px" }}
        onHide={onHide}
        footer={footerContent}
      >
        <span className="p-float-label mt-4 mb-4">
          <InputText
            id="username"
            value={newUser.name}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                name: e.target.value.toLocaleLowerCase(),
              })
            }
            className={validateName() ? "" : "p-invalid"}
          />
          <label htmlFor="username">Name_Surname</label>
        </span>
        <span className="p-float-label mt-4 mb-4">
          <InputText
            id="email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                email: e.target.value.toLocaleLowerCase(),
              })
            }
            className={validateEmail() ? "" : "p-invalid"}
          />
          <label htmlFor="email">Email</label>
        </span>
        <div className="grid">
            <div className="col">
                <span className="p-float-label mb-4">
                    <Dropdown
                        value={Role[newUser.role]}
                        options={Object.keys(Role).filter(key => isNaN(Number(key)))}
                        itemTemplate={roleItemTemplate}
                        // @ts-ignore
                        onChange={(e) => setNewUser({...newUser, role: Role[e.value]})}
                        placeholder="Select a Role"
                        style={{width: "100%", minWidth: "130px"}}
                    />
                    <label htmlFor="role">Role</label>
                </span>
            </div>
            <div className="col">
                <span className="p-float-label mb-4">
                    {/* value should be 100 if null */}
                    <InputNumber
                        id="maxSpace"
                        value={maxSpace}
                        onValueChange={(e) => setMaxSpace(e.value ? e.value : 1000)}
                        locale="en-US"
                        min={1000}
                        style={{width: "100%", minWidth: "150px"}}
                    />
                    <label htmlFor="maxSpace">Max Space {maxSpace ? formatFileSize(maxSpace, settings.si) : ""}</label>
                </span>
            </div>
        </div>
        <span className="p-float-label mb-6">
          <Password
            id="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className={validatePassword() ? "" : "p-invalid"}
            style={{ width: "100%" }}
            toggleMask
          />
          <label htmlFor="password">Password</label>
        </span>
      </Dialog>
    </div>
  );
};

export default AddUserDialog;
