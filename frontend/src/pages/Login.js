import { IoMdArrowDropright } from "react-icons/io";

export default function Login() {
  return (
    <div className="relative w-screen h-screen bg-[#f8f5ec] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-10 animate-contentSlideUp">
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{ top: "17vh", width: "60vw" }}
        >
          <h1 className="text-black text-[65px] font-semibold ">fridge.</h1>
        </div>
        <div className="flex items-center justify-center mt-[19vh]">
          <img
            src="/bean-fridge.svg"
            alt="Logo"
            className="w-[50vw] h-[50vh]"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-screen h-[45vh] bg-[#ffc964] rounded-tl-[30px] rounded-tr-[30px] animate-slideUp">
        <div className="w-[80vw] mx-auto">
          <div className="mt-10 mb-7 text-left text-4xl font-bold ml-3">Log In</div>
          <form className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Email"
              className="text-center mb-5 w-full h-[50px] bg-[#f8f5ec] rounded-[56px] shadow-[0px_4px_0px_0px_rgba(0,0,0,0.96)]"
            />
            <input
              type="password"
              placeholder="Password"
              className="text-center mb-5 w-full h-[50px] bg-[#f8f5ec] rounded-[56px] shadow-[0px_4px_0px_0px_rgba(0,0,0,0.96)]"
            />

            <div className="w-[80vw] flex justify-between items-center mt-1">
              <div className="flex flex-col justify-left h-[55px] float-start ml-2">
                <a href="/" className="text-[#c55810] font-medium text-[16px] hover:underline">
                  Forgot Password
                </a>
                <a href="/signup" className="text-[#c55810] font-medium text-[16px] hover:underline">
                  Sign Up
                </a>
              </div>
              <a
                href="/fridge"
                className="w-[25vw] h-[55px] bg-[#ffdc90] rounded-[50px] shadow-[0px_3px_0px_0px_rgba(0,0,0,1)]
                   active:shadow-[inset_0px_1px_0px_rgba(0,0,0,1)] border border-black
                   transition-shadow duration-150 transform active:translate-y-1 flex items-center justify-center"
              >
                <span className="text-black font-bold text-[28px] flex items-center ml-2">
                  GO <IoMdArrowDropright />
                </span>
              </a>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
