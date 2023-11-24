import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const NoPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  }

  const goToDashboard = () => {
    navigate("/dashboard");
  }

  return (
    <div className='no-page container flex align-items-center justify-content-center w-screen h-screen fixed'>
      <div>
        <p className="text-center font-semibold mb-1" style={{color: "var(--primary-color)"}}>404 Error</p>
        <h1 className="font-bold text-6xl mt-2 mb-1 text-center" style={{color: "var(--color-text)"}}>Page not found</h1>
        <p className="text-center" style={{color: "var(--text-secondary-color)"}}>The page you are looking for does not exist.</p>
        <div className="grid mt-4 flex justify-content-center">
          <Button label="Back" icon="material-symbols-outlined mat-icon-back" onClick={goBack} />
          <Button label="Dashboard" icon="material-symbols-outlined mat-icon-back" onClick={goToDashboard} link />
        </div>
      </div>
    </div>
  );
};

export default NoPage;