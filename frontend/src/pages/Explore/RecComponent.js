import { FaStar } from "react-icons/fa";

export default function RecComponent({rating, restaurant, cuisine, image}) {
    
return (
        <div className="pl-[5px] pr-[5px]">
        <div className="w-[50vw] h-[52vw] bg-[#f7f6f4] rounded-[21px] shadow-[0px_2px_0px_0px_rgba(0,0,0,1.00)] border border-black flex justify-center pt-2">
            <div className="flex flex-col w-[100%]">
                <img className="w-[90%] h-[65%] rounded-2xl border border-black ml-auto mr-auto" src={"/freaky-bean.svg"} />
                
                <div className="ml-4 mt-2">
                    <div className=" text-black text-[4.5vw] font-bold">{restaurant}</div>
                    
                    <div className="flex flex-row"> 
                        <div className=" text-black text-[4vw] font-normal">{cuisine}</div>
                        <span className= "ml-[30%] mr-[5px] self-center"> <img src="/star.svg"/></span> 
                        <div className=" text-black text-[4vw] text-right font-bold " >{rating}<br/></div>
                    </div>
                </div>
                
                
            </div>

        {/** 
        <div className="w-[167px] h-[167px] left-0 top-0 absolute bg-[#f7f6f4] rounded-[21px] shadow-[0px_2px_0px_0px_rgba(0,0,0,1.00)] border border-black" />
        
        
        <div className="left-[16px] top-[122px] absolute text-black text-[15px] font-bold">{restaurant}</div>
        

        **/}
    </div>
    </div>
    );
}
