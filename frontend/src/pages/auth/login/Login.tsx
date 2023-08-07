import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import authRoutes from '../../../routes/authRoutes';
import { useToast } from '../../../hooks/ToastHook';
import { useSettingsContext } from '../../../hooks/SettingsHook';
import { Password } from 'primereact/password';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {updateSettings} = useSettingsContext();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const validateEmail = (email: string) => {
    return email.includes('@');
  }

  const handleLogin = () => {
    interface ResponseData {
      email: string;
      message: string;
      userId: number;
      admin: boolean;
    }

    axios.post<ResponseData>(authRoutes.login, {
      email: email,
      password: password
    }, { withCredentials: true })
      .then((response: AxiosResponse<ResponseData>) => {
        console.log(response);
        
        showSuccess('Success', response.data.message);
        updateSettings({email: response.data.email});
        updateSettings({userId: response.data.userId});
        updateSettings({admin: response.data.admin});
        navigate("/dashboard")
      })
      .catch((error: any) => {
        if (error.request.data && error.request.data?.error) {
          showError('Error', error.request.data.error);
        } else {
          showError('Error', error.message);
        }
      });
  };

  return (
    <div className='login' style={{display: "flex", justifyContent: "center"}}>
      <div style={{maxWidth: "500px", minWidth: "200px", width: "100%"}}>
        <h1 className='mt-5 pt-5 font-weight-bold' style={{textAlign: "center"}}>Shadow Cloud</h1>
        <Card className='mt-5' title='Login'>
          <Divider />
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="p-float-label">
              <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" />
              <label htmlFor="email" className="p-d-block">Email</label>
            </div>
            <span className="p-float-label mt-4 mb-4">
              <Password inputId="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{width: "100%"}} feedback={false} toggleMask />
              <label htmlFor="password">Password</label>
            </span>
            <Button label="Login" icon="material-symbols-outlined mat-icon-login" disabled={!validateEmail(email) || password === ''} onClick={handleLogin} className="p-field"/>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;