import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdArrowDropright } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function ClaimComponent({ name, photo, location, restaurant }) {
  const navigate = useNavigate();

  const handleClaim = () => {
    navigate('/loading', {state: {restaurant}});
  };

  return (
    <div 
      className="w-[90vw] min-h-[18vh] bg-white rounded-[21px] shadow-[0px_2px_0px_0px_rgba(0,0,0,1.00)] border border-black mb-3 cursor-pointer"
      onClick={handleClaim}
    >
      <div className="flex flex-row w-full p-3 gap-3">
        <img
          className="w-[25vw] h-[25vw] rounded-2xl border border-black flex-shrink-0"
          src={"/placeholder.png"}
        />

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="text-black text-[5vw] font-bold break-words">{name}</div>
            <div className="text-black text-[3.5vw] font-normal flex flex-row items-start break-words">
              <FaLocationDot className="mr-2 mt-1 flex-shrink-0" /> 
              <span className="break-words">{location}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="w-[10vw] h-[10vw] bg-[#84A59D] rounded-[50px] border-2 border-black flex items-center justify-center transform hover:-translate-y-0.5"
            >
              <IoMdArrowDropright className="text-4xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
