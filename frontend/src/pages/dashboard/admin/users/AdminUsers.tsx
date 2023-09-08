import axios from 'axios';
import { Card } from 'primereact/card';
import { useRef, useEffect, useState } from 'react';
import adminRoutes from '../../../../routes/adminRoutes';
import IUser, { Role } from '../../../../interfaces/IUser';
import { DataTable, DataTableFilterMeta, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import formatFileSize from '../../../../helper/formatFileSize';
import { useToast } from '../../../../hooks/ToastHook';
import { useSettingsContext } from '../../../../hooks/SettingsHook';
import AddUserDialog from './AddUserDialog';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { ContextMenu } from 'primereact/contextmenu';
import { DomHandler } from 'primereact/utils';


const AdminUsers = () => {
  const [users, setUsers] = useState<IUser[]>([])
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const { showInfo, showError, showWarn } = useToast();
  const [visible, setVisible] = useState<boolean>(false);
  const { settings } = useSettingsContext();
  const [loading, setLoading] = useState<boolean>(true)
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    role: { value: null, matchMode: FilterMatchMode.EQUALS },
    maxSpace: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const cm = useRef<ContextMenu>(null);
  const dt = useRef<any>(null);


  useEffect(() => {
    axios.get<IUser[]>(adminRoutes.getUsers, { withCredentials: true})
      .then(res => {
        setUsers(res.data.sort((a, b) => a.id! - b.id!))
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        if (err.response && err.response.data.error) {
          showError('Error', err.response.data.error)
        } else {
          showError('Error', 'User data could not be fetched.')
        }
      })
  }, []);

  const contextMenuItems = [
    {
      label: 'Edit',
      icon: 'material-symbols-outlined mat-icon-edit',
      command: (event: any) => {
        setSelectedUser(event.item.rowData);
        // @ts-ignore
        cm.current?.hide();

        const index = users.findIndex(user => user.id === selectedUser!.id);

        DomHandler.find(document.body, '.p-row-editor-init')[index].click();
      }
    },
    {
      label: 'Delete',
      icon: 'material-symbols-outlined mat-icon-bin',
      command: (event: any) => {
        setSelectedUser(event.item.rowData);
        confirmDeletion(event.originalEvent);
      }
    },
    {
      label: 'Add User',
      icon: 'material-symbols-outlined mat-icon-plus',
      command: () => {
        setVisible(true);
      }
    }
  ];

  const onAddUser = (user: IUser) => {
    axios.post(adminRoutes.addUser, {
      name: user.name,
      email: user.email,
      role: Role[user.role],
      password: user.password!,
      maxSpace: user.maxSpace!
    }, { withCredentials: true })
      .then(res => {
        if (res.data.message) {
          showInfo('Success', res.data.message)
        } else {
          showInfo('Success', 'User added successfully.')
        }
        setUsers([...users, user])
      })
      .catch(err => {
        if (err.response && err.response.data.error) {
          showError('Error', err.response.data.error)
        } else {
          showError('Error', 'User could not be added.')
        }
      });
  };

  const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
    const { newData, index } = e;
    let updatedUsers = [...users];
    const oldData = updatedUsers[index];
    // @ts-ignore
    updatedUsers[index] = newData;

    // If role is admin, warn user
    // @ts-ignore
    if (Role[newData.role] === Role.ADMIN) {
      showWarn('Warning', 'Changing a user\'s role to admin will give them access to the admin dashboard.')
    }

    // If current user is editing their own role, warn user
    // @ts-ignore
    if (newData.email === settings.email && Role[newData.role] !== Role.ADMIN) {
      showWarn('Warning', 'Changing your own role to user will remove your access to the admin dashboard.')
    }

    setUsers(updatedUsers);
    
    axios.put(`${adminRoutes.editUser}/${newData.id}`, newData, { withCredentials: true })
      .then(res => {
        if (res.data.message) {
          showInfo('Success', res.data.message)
        } else {
          showInfo('Success', 'User data updated successfully.')
        }
      })
      .catch(err => {
        if (err.response && err.response.data.error) {
          showError('Error', err.response.data.error)
        } else {
          showError('Error', 'User data could not be updated.')
        }
        // @ts-ignore
        updatedUsers[index] = oldData;
        setUsers(updatedUsers);
      });
  };

  const textEditor = (options: ColumnEditorOptions) => (
    <InputText
      value={options.value}
      // @ts-ignore
      onChange={(e) => options.editorCallback(e.target.value)}
    />
  );

  const roleItemTemplate = (option: string) => {
    // @ts-ignore
    return <Badge value={option} severity={Role[option] === Role.ADMIN ? undefined : 'info'} />;
  };

  const roleEditor = (options: ColumnEditorOptions) => {
    const roleNames = Object.keys(Role).filter(key => isNaN(Number(key)));
  
    return (
      <Dropdown
        value={options.value}
        options={roleNames}
        itemTemplate={roleItemTemplate}
        // @ts-ignore
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a Role"
      />
    );
  };  

  const maxSpaceEditor = (options: ColumnEditorOptions) => (
    <InputNumber
      value={options.value}
      // @ts-ignore
      onValueChange={(e) => options.editorCallback(e.value || 1000)}
      min={1000}
      locale="en-US"
    />
  );

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const acceptDeletion = () => {
    axios.delete(`${adminRoutes.deleteUser}/${selectedUser!.id}`, { withCredentials: true })
      .then(res => {
        if (res.data.message) {
          showInfo('Success', res.data.message)
        } else {
          showInfo('Success', 'User deleted successfully.')
        }
        setUsers(users.filter(user => user.id !== selectedUser!.id))
        setSelectedUser(null)
      })
      .catch(err => {
        if (err.response && err.response.data.error) {
          showError('Error', err.response.data.error)
        } else {
          showError('Error', 'User could not be deleted.')
        }
      });
  };

  const confirmDeletion = (event: any) => {
    confirmPopup({
        target: event.currentTarget,
        message: `Are you sure you want to delete ${selectedUser?.name}?`,
        icon: 'pi pi-exclamation-triangle',
        accept: acceptDeletion
    });
  };

  const header = () => (
    <div className="flex justify-content-end">
      <ConfirmPopup />
      <Button icon="material-symbols-outlined mat-icon-bin" label="Delete User" severity='danger' className='mr-2' outlined disabled={selectedUser === null} onClick={confirmDeletion} />
      <Button icon="material-symbols-outlined mat-icon-plus" label="Add User" severity='success' className='mr-2' onClick={() => setVisible(true)} />
      <span className="p-input-icon-left">
        <i className="material-symbols-outlined mat-icon-search" />
        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
      </span>
    </div>
  );

  const nameBodyTemplate = (rowData: IUser) => {
    return <b>{rowData.name}</b>;
  };

  const roleBodyTemplate = (rowData: IUser) => {
    // @ts-ignore
    return <Badge value={rowData.role} severity={Role[rowData.role] === Role.ADMIN ? undefined : 'info'} />;
  };

  const maxSpaceBodyTemplate = (rowData: IUser) => {
    return <Badge value={formatFileSize(rowData.maxSpace!, settings.si)} />;
  };

  const datesBodyTemplate = (rowData: IUser) => {
    return (
      <div style={{color: "var(--text-secondary-color)", opacity: ".8", fontSize: "13px"}}>
        <div>
          <b>Created: </b>
          {rowData.createdAt && new Date(rowData.createdAt).toLocaleString()}
        </div>
        <div>
          <b>Updated: </b>
          {rowData.updatedAt && new Date(rowData.updatedAt).toLocaleString()}
        </div>
      </div>
    );
  };
  
  return (
    <div className='admin' style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "1250px", width: "100%" }}>
        <h1 className="text-900 font-bold text-6xl mb-4 text-center">Users</h1>
        <Card className='mt-4'>
          <DataTable
            value={users}
            editMode="row"
            dataKey="id"
            onRowEditComplete={onRowEditComplete}
            scrollable
            filters={filters}
            loading={loading}
            globalFilterFields={['id', 'name', 'email', 'role', 'maxSpace']}
            header={header}
            emptyMessage="No users found."
            size='small'
            metaKeySelection={false}
            selectionMode='single'
            selection={selectedUser as any}
            onSelectionChange={e => {
              setSelectedUser(e.value as any)
            }}
            contextMenuSelection={selectedUser as any}
            onContextMenu={e => {
              setSelectedUser(e.data as any)
              cm.current?.show(e.originalEvent);
            }}
            onContextMenuSelectionChange={e => setSelectedUser(e.value as any)}
            ref={dt} >
            <Column field="id" header="ID" bodyStyle={{textAlign: "center"}} sortable />
            <Column field="name" header="Name" body={nameBodyTemplate} sortable filter filterPlaceholder="Search by name" editor={textEditor} />
            <Column field="email" header="Email" sortable filter filterPlaceholder="Search by email" editor={textEditor} />
            <Column field="role" header="Role" body={roleBodyTemplate} sortable editor={roleEditor} />
            <Column field="maxSpace" header="Max Space" headerStyle={{minWidth: "130px"}} body={maxSpaceBodyTemplate} sortable editor={maxSpaceEditor} />
            <Column header="Dates" body={datesBodyTemplate} headerStyle={{minWidth: "200px"}} />
            <Column rowEditor bodyStyle={{ textAlign: 'center', minWidth: "110px" }} />
          </DataTable>
        </Card>

        <AddUserDialog visible={visible} onHide={() => setVisible(false)} onAdd={onAddUser} />
      </div>
      <ContextMenu model={contextMenuItems} ref={cm} />
    </div>
  );
};

export default AdminUsers;