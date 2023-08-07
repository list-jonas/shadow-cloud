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
    <div className='no-page container'>
      <h1 className="text-900 font-bold text-6xl mt-4 mb-4 text-center">Page not found</h1>
      <Button label="Back" icon="material-symbols-outlined mat-icon-back" onClick={goBack} />
      <br />
      <Button label="Dashboard" icon="material-symbols-outlined mat-icon-back" onClick={goToDashboard} />
    </div>
  );
};

export default NoPage;