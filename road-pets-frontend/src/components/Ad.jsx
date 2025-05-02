import React from 'react';
import { Link } from 'react-router-dom';
import myAdImage from '.././../public/petad.png'; 

const Ad = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center ">
       <Link to="/charityreg">
      <img
        src={myAdImage}
        alt="Advertisement"
        className="w-full h-auto object-contain"
      />
      </Link>
      
    </div>
  );
};

export default Ad;
