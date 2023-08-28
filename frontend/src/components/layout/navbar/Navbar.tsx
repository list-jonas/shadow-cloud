import { MenuItem } from 'primereact/menuitem';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authRoutes from '../../../routes/authRoutes';
import { useToast } from '../../../hooks/ToastHook';
import { Menubar } from 'primereact/menubar';
import { useSettingsContext } from '../../../hooks/SettingsHook';
import Logo from './Logo';
import redirectTo from '../../../helper/redirectTo';

const Navbar = () => {
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast();
  const { settings } = useSettingsContext();

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
      url: '/dashboard',
      command: (e) => redirectTo(navigate, e, "/dashboard")
    },
    // Settings
    {
      label: 'Settings',
      icon: 'material-symbols-outlined mat-icon-settings',
      url: '/dashboard/settings',
      command: (e) => redirectTo(navigate, e, "/dashboard/settings"),
    },
    // Logout
    {
      label: 'Logout',
      icon: 'material-symbols-outlined mat-icon-logout',
      command: () => logout(),
    },
  ]

  if(settings.admin) {
    // Admin
    items.splice(1, 0, {
      label: 'Admin',
      icon: 'material-symbols-outlined mat-icon-admin',
      items: [{
        label: 'Users',
        icon: 'material-symbols-outlined mat-icon-users',
        url: '/dashboard/admin/users',
        command: (e) => redirectTo(navigate, e, "/dashboard/admin/users"),
      }, {
        label: 'Stats',
        icon: 'material-symbols-outlined mat-icon-log',
        url: '/dashboard/admin/stats',
        command: (e) => redirectTo(navigate, e, "/dashboard/admin/stats"),
      }],
    });
  }

  const start = <Logo href="/dashboard" style={{marginRight: "10px", marginLeft: "5px", width: "40px", height: "40px", display: "flex"}} onClick={(e) => redirectTo(navigate, e, "/dashboard")} />;

  const end = <div className='mr-2'>{settings.email}</div>

  return (
    <div className="card mb-4">
      <Menubar model={items} start={start} end={end} />
    </div>
  )
};

export default Navbar;