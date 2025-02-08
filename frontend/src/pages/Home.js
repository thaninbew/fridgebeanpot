export default function Home() {
  return (
    <div className="w-screen h-screen relative bg-[#f8f5ec] overflow-hidden flex flex-col items-center">
      <div className="absolute top-[20vh] left-50% text-center text-black text-[65px] font-semibold">
        fridge.
      </div>

      <div className="absolute left-50%" style={{ top: "55vh" }}>
        <div className="flex flex-col">
          <div className="text-left text-black font-normal text-[30px]">
            Hungry?
          </div>
          <div className="text-center text-black text-[17px] font-light">
            Find local restaurants near you.
          </div>
        </div>
      </div>

      <div className="w-[100vw] absolute left-[97px] top-[65vh]">
        <button
          type="button"
          className="w-[50vw] h-[50px] bg-[#ffdc90] rounded-[22.20px] shadow-[0px_3px_0px_0px_rgba(0,0,0,1)] 
               active:shadow-[inset_0px_1px_0px_rgba(0,0,0,1)] border border-black 
               flex justify-center items-center transition-shadow duration-150 transform active:translate-y-1"
        >
          <span className="text-black font-normal text-[20px]">Log In</span>
        </button>

        <button
          type="button"
          className="mt-3 w-[50vw] h-[50px] bg-[#ffdc90] rounded-[22.20px] shadow-[0px_3px_0px_0px_rgba(0,0,0,1)] 
               active:shadow-[inset_0px_1px_0px_rgba(0,0,0,1)] border border-black 
               flex justify-center items-center transition-shadow duration-150 transform active:translate-y-1"
        >
          <span className="text-black font-normal text-[20px]">Sign up</span>
        </button>
      </div>
    </div>
  );
}
