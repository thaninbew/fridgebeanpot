import React from "react";
import Navbar from "../../components/Navbar";
import ClaimComponent from "./ClaimComponent";
import { BiSearch } from "react-icons/bi";

export default function ClaimPage() {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="pt-16 min-h-screen touch-none pb-24 flex flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-[10vw] font-extrabold">Claim</h1>
          <p1 className="font-medium">
            {" "}
            Visit a local restaurant to claim rewards.{" "}
          </p1>
        </div>

        <div className="w-[80vw] mb-10 flex justify-center items-center">
          <BiSearch className="absolute mr-[66vw]" />
          <input
            type="text"
            placeholder="Where do you want to eat today?"
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-y-scroll">
          <ClaimComponent
            name="Mamacitas"
            photo=""
            location="329 Huntington Ave, Boston, MA 02115"
          />
          <ClaimComponent
            name="Pho Basil"
            photo=""
            location="177 Massachusetts Ave, Boston, MA 02115"
          />
          <ClaimComponent
            name="Colette Bakery"
            photo=""
            location="517 Columbus Ave, Boston, MA 02118"
          />
          <ClaimComponent
            name="cacao"
            photo=""
            location="570 Columbus Ave, Boston, MA 02118"
          />
          <ClaimComponent
            name="Dumpling King"
            photo=""
            location="42 Beach St, Boston, MA 02111"
          />
        </div>
      </div>
      <Navbar />
    </div>
  );
}
