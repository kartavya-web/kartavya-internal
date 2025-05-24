import React from 'react';

const HeaderForEnputStudentDetails = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row w-full h-56 md:h-28 ">
        {/* Logo section */}
        <div className="flex justify-center items-center logo w-full h-24 md:w-[20%]  md:h-full lg:h-full ">
          <img
            src="logos.png"
            className="object-contain h-full md:w-[200px] lg:w-[250px]"
            alt="Logo"
          />
        </div>

        {/* Heading section */}
        <div className="heading w-full md:w-[80%] flex flex-col items-center justify-center h-32 md:h-full text-center  text-3xl md:text-2xl lg:text-3xl md:pl-[20%]">
          <div className="heading1 font-bold mb-1">
            Let&apos;s Get You Started
          </div>
          <div className="heading2 text-[1rem] text-gray-500 font-semibold" style={{color:'#686868'}}>
            Enter the details of the student
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderForEnputStudentDetails;
