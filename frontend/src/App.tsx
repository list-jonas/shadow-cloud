import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss';
import { useEffect } from "react";
import Layout from "./components/layout/Layout";
import Redirect from "./pages/Redirect";
import { useSettingsContext } from "./hooks/SettingsHook";
import '/src/assets/theme/mat-icon.css'
import themesData from "./data/themeData";
import PrimeReact, { PrimeReactProvider } from "primereact/api";
import React from "react";
import FileView from "./pages/file/FileView";

const Dashboard = React.lazy(() => import("./pages/dashboard/dashboard/Dashboard"));
const NoPage = React.lazy(() => import("./pages/noPage/NoPage"));
const Login = React.lazy(() => import("./pages/auth/login/Login"));
const Settings = React.lazy(() => import("./pages/dashboard/settings/Settings"));
const AdminUsers = React.lazy(() => import("./pages/dashboard/admin/users/AdminUsers"));
const AdminStats = React.lazy(() => import("./pages/dashboard/admin/stats/AdminStats"));

function App() {
  const { settings } = useSettingsContext()

  PrimeReact.ripple = true;

  useEffect(() => {
    const linkElement = document.createElement('link');
    
    linkElement.rel = 'stylesheet';
    linkElement.href = themesData[settings.theme]; // theme is the current theme
    
    // Add the new stylesheet to the head
    document.head.appendChild(linkElement);
    
    // Remove the old stylesheet when the theme changes
    return () => {
      document.head.removeChild(linkElement);
    };
  }, [settings.theme]);
  
  return (
    <div className='App' style={{minHeight: "100vh"}}>
      <PrimeReactProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Redirect url="/dashboard" />} />

            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard/settings/" element={<Settings />} />
              <Route path="/dashboard/admin">
                <Route path="/dashboard/admin/users" element={<AdminUsers />} />
                <Route path="/dashboard/admin/stats" element={<AdminStats />} />
              </Route>
            </Route>
            
            <Route path="/auth">
              <Route path="/auth/login" element={<Login />} />
            </Route>

            <Route path="/file/:user/:id" element={<FileView />} />

            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>
      </PrimeReactProvider>
    </div>
  )
}

export default App;