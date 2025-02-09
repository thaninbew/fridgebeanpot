import { FaLocationDot } from "react-icons/fa6";
import { IoMdArrowDropright } from "react-icons/io";
import { Link } from "react-router-dom";

export default function ClaimComponent({ name, photo, location }) {
  return (
    <div className="">
      <div className="w-[90vw] h-[18vh] bg-white rounded-[21px] shadow-[0px_2px_0px_0px_rgba(0,0,0,1.00)] border border-black flex justify-center pt-2 mb-3">
        <div className="flex flex-row w-[100%] items-start justify-start p-3">
          <img
            className="w-[30vw] h-[30vw] rounded-2xl border border-black ml-2"
            src={"/freaky-bean.svg"}
          />

          <div className="flex flex-row justify-between">
            <div className="ml-6">
              <div className=" text-black text-[6vw] font-bold">{name}</div>

              <div className=" text-black text-[4vw] font-normal flex flex-row text-starts">
                <FaLocationDot className="mt-1 mr-2" /> {location}
              </div>
            </div>

            <Link to="/PrizePage">
              <button
                type="button"
                className="text-end w-[10vw] h-[10vw] bg-[#84A59D] rounded-[50px] mt-[50%] border-2 border-black flex items-center justify-center transform hover:-translate-y-0.5 mt-[9vh] mr-1"
              >
                <IoMdArrowDropright className="text-4xl" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
