import ExploreNavBar from "./ExploreNavBar";
import RecComponent from "./RecComponent";

export default function Recs() {
    return (
        <div>
          <ExploreNavBar />
      
        <p className="font-bold text-2xl m-9 mb-4"> Recommended </p>
        <div className="w-auto overflow-x-scroll ml-[10px] p-[15px] pt-0 whitespace-nowrap flex flex-row">

          <RecComponent 
          rating= "4.4"
          restaurant="Corner Bakery"
          cuisine="Chinese"
          image="/"/>

          <RecComponent 
          rating= "4.2"
          restaurant="Mamacita's"
          cuisine="Mexican"
          image="/"/>

          <RecComponent 
          rating= "3.9"
          restaurant="Ruggles Pizza"
          cuisine="Italian"
          image="/"/>

          <RecComponent 
          rating= "4.0"
          restaurant="Anna's Taqueria"
          cuisine="Mexican"
          image="/"/>
        </div>

        <p className="font-bold text-2xl m-11 mt-6 mb-4"> Discover </p>
        <div className="w-auto overflow-x-scroll ml-[10px] p-[15px] pt-0 whitespace-nowrap flex flex-row">

          <RecComponent 
          rating= "4.2"
          restaurant="Saxby's"
          cuisine="American"
          image="/"/>

          <RecComponent 
          rating= "4.2"
          restaurant="Japonaise Bakery"
          cuisine="Japanese"
          image="/"/>

          <RecComponent 
          rating= "4.2"
          restaurant="Saxby's"
          cuisine="American"
          image="/"/>

          <RecComponent 
          rating= "4.2"
          restaurant="Saxby's"
          cuisine="American"
          image="/"/>
        </div>

        </div>
      );
}