import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.scss';
import { Suspense, useEffect } from "react";
import Layout from "./components/layout/Layout";
import Redirect from "./pages/Redirect";
import { useSettingsContext } from "./hooks/SettingsHook";
import '/src/assets/theme/mat-icon.css'
import themesData, { getTheme } from "./data/themeData";
import PrimeReact, { PrimeReactProvider } from "primereact/api";
import React from "react";

const Dashboard = React.lazy(() => import("./pages/dashboard/dashboard/Dashboard"));
const NoPage = React.lazy(() => import("./pages/noPage/NoPage"));
const Login = React.lazy(() => import("./pages/auth/login/Login"));
const Settings = React.lazy(() => import("./pages/dashboard/settings/Settings"));
const AdminUsers = React.lazy(() => import("./pages/dashboard/admin/users/AdminUsers"));
const AdminStats = React.lazy(() => import("./pages/dashboard/admin/stats/AdminStats"));
const FileView = React.lazy(() => import("./pages/file/FileView"));

function App() {
  const { settings } = useSettingsContext()

  PrimeReact.ripple = true;

  useEffect(() => {
    const linkElement = document.createElement('link');
    
    linkElement.rel = 'stylesheet';
    linkElement.href = getTheme(settings.theme)?.path || themesData[0].themes[0].path;
    
    // Add the new stylesheet to the head
    document.head.appendChild(linkElement);
    
    // Remove the old stylesheet when the theme changes
    return () => {
      document.head.removeChild(linkElement);
    };
  }, [settings.theme]);
  
  return (
    <div className='App'>
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </div>
  )
}

export default App;