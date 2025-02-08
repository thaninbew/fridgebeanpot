import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-row items-start w-[100vw] h-[100vh]">
      <div
        className="absolute left-[50vw] transform -translate-x-1/2"
        style={{ top: "15vh", width: "60vw" }}
      >
        <div className="flex flex-col items-start">
          <h1 className="text-black text-[15vw] font-semibold mb-5">fridge.</h1>

          <div className="mt-[33vh]">
            <div className="text-black font-normal text-[30px]">Hungry?</div>
            <div className="text-black text-[18px] font-light">
              Find local restaurants near you.
            </div>
          </div>

          <div className=" mt-4 w-full">
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

      <div className="w-[100vw] h-[82vh] flex flex-col items-center justify-center">
        <img src="/bean-fridge.svg" alt="Logo" className="w-[50vw] h-[50vh]" />
      </div>
    </div>
  );
}
