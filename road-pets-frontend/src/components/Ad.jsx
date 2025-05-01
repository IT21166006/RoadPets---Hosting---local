import React from 'react';
import myAdImage from '.././../public/petad.png'; 

const Ad = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center ">
      <img
        src={myAdImage}
        alt="Advertisement"
        className="w-full h-auto object-contain"
      />
      
    </div>
  );
};

export default Ad;
