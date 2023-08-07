import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const Backbutton = () => {
  const navigate = useNavigate();

  const onBackClick = () => {
    navigate(-1);
  }

  return (
    <div className='mt-2 mb-4'>
      <Button icon="material-symbols-outlined mat-icon-back" raised rounded text aria-label="Go back" onClick={onBackClick} />
    </div>
  );
};

export default Backbutton;