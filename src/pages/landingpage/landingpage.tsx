import { Carousal } from "../../components/Carousal"
import { sony,boult,boat,jbl, background } from '../../assets';
import { Category } from "../../components/Category";
import { SearchBar } from "../../shared/components/SearchBar";


export const LandingPage =()=>{
    return(
        <>
        {/* <Carousal/> */}
        <SearchBar/>
        <img src={background} width={"100%"} height={"400px"} className='cover'/>
        <Category/>
        </>
    )
}