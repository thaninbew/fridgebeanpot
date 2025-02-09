import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdArrowDropright } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function ClaimComponent({ name, photo, location }) {
  const navigate = useNavigate();

  const handleClaim = () => {
    navigate('/loading');
  };

  return (
    <div 
      className="w-[90vw] h-[18vh] bg-white rounded-[21px] shadow-[0px_2px_0px_0px_rgba(0,0,0,1.00)] border border-black mb-3 cursor-pointer"
      onClick={handleClaim}
    >
      <div className="flex flex-row w-full items-start p-3">
        <img
          className="w-[30vw] h-[30vw] rounded-2xl border border-black"
          src={"/freaky-bean.svg"}
        />

        <div className="flex flex-row justify-between flex-1">
          <div className="ml-6">
            <div className="text-black text-[6vw] font-bold">{name}</div>
            <div className="text-black text-[4vw] font-normal flex flex-row items-center">
              <FaLocationDot className="mr-2" /> {location}
            </div>
          </div>

          <button
            type="button"
            className="text-end w-[10vw] h-[10vw] bg-[#84A59D] rounded-[50px] border-2 border-black flex items-center justify-center transform hover:-translate-y-0.5 mt-[9vh] mr-1"
          >
            <IoMdArrowDropright className="text-4xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
