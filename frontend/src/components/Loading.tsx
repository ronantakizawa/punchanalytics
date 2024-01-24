import { ClipLoader } from 'react-spinners';
import powaLogo from '../assets/powaboxing.svg';

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black  z-50 flex justify-center items-center">
      <div className='relative'>
        <ClipLoader size={250} color={"orange"} />
        <img 
          src={powaLogo} 
          alt="Powa Boxing Logo" 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: '75%', 
            width: '75%'  
          }} 
        />
      </div>
    </div>
  );
};

export default Loading;
