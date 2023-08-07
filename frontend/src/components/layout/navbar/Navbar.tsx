import { MenuItem } from 'primereact/menuitem';

import favicon from 'assets/favicon.ico';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authRoutes from '../../../routes/authRoutes';
import { useToast } from '../../../hooks/ToastHook';
import { Menubar } from 'primereact/menubar';
import { useSettingsContext } from '../../../hooks/SettingsHook';

const Navbar = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast();
  const { settings } = useSettingsContext();
 
  const redirectTo = (url: string) => {
    navigate(url)
  }

  const logout = () => {
    axios.post(authRoutes.logout, 
      {}, 
      { withCredentials: true }
      ).then((res: any) => {
        showSuccess('Success', res.data.message)
        navigate('/auth/login');
      })
      .catch((error: any) => {
        if (error.response.data.error) {
          showError('Error', error.response.data.error);
        } else {
          showError('Error', 'Fehler bei der abmeldung');
        }
      });
  }

  const items: MenuItem[] = [
    // Dashboard
    {
      label: 'Dashboard',
      icon: 'material-symbols-outlined mat-icon-dashboard',
      command: () => redirectTo("/dashboard")
    },
    // Settings
    {
      label: 'Einstellungen',
      icon: 'material-symbols-outlined mat-icon-settings',
      command: () => redirectTo("/dashboard/settings"),
    },
    // Logout
    {
      label: 'Abmelden',
      icon: 'material-symbols-outlined mat-icon-logout',
      command: () => logout(),
    },
  ]

  if(settings.admin) {
    // Admin
    items.splice(3, 0, {
      label: 'Admin',
      icon: 'material-symbols-outlined mat-icon-admin',
      items: [{
        label: 'Benutzer',
        icon: 'material-symbols-outlined mat-icon-users',
        command: () => redirectTo("/dashboard/admin/users"),
      }, {
        label: 'Parkplätze',
        icon: 'material-symbols-outlined mat-icon-dashboard',
        command: () => redirectTo("/dashboard/admin/spaces"),
      }, {
        label: 'Stats',
        icon: 'material-symbols-outlined mat-icon-log',
        command: () => redirectTo("/dashboard/admin/stats"),
      }],
    });
  }

  const start = <img alt="logo" src={favicon} height="40" style={{marginRight: "10px", marginLeft: "5px"}} onClick={() => redirectTo("/dashboard")} />;

  const end = <div className='mr-2'>{settings.email}</div>

  return (
    <div className="card mb-4">
      <Menubar model={items} start={start} end={end} />
    </div>
  )
};

export default Navbar;