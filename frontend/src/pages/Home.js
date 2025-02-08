import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ top: "17vh", width: "60vw" }}
      >
        <div className="flex flex-col items-start">
          <h1 className="text-black text-[65px] font-semibold mb-5">fridge.</h1>

          <div className="mt-[35vh]">
            <div className="text-black font-normal text-[30px]">Hungry?</div>
            <div className="text-black text-[18px] font-light">
              Find local restaurants near you.
            </div>
          </div>

          <div className="mt-3 w-full">
            <Link to="/login">
              <button
                type="button"
                className="w-full h-[55px] bg-[#ffdc90] rounded-[22.20px] shadow-[0px_3px_0px_0px_rgba(0,0,0,1)]
                     active:shadow-[inset_0px_1px_0px_rgba(0,0,0,1)] border border-black
                     flex justify-center items-center transition-shadow duration-150 transform active:translate-y-1"
              >
                <span className="text-black font-normal text-[20px]">
                  Log In
                </span>
              </button>

              <button
                type="button"
                className="mt-3 w-full h-[55px] bg-[#ffdc90] rounded-[22.20px] shadow-[0px_3px_0px_0px_rgba(0,0,0,1)]
                     active:shadow-[inset_0px_1px_0px_rgba(0,0,0,1)] border border-black
                     flex justify-center items-center transition-shadow duration-150 transform active:translate-y-1"
              >
                <span className="text-black font-normal text-[20px]">
                  Sign up
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mt-[19vh]">
        <img src="/bean-fridge.svg" alt="Logo" className="w-[50vw] h-[50vh]" />
      </div>
    </div>
  );
}
