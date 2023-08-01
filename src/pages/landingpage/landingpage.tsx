import { Carousal } from "../../components/Carousal"
import { sony,boult,boat,jbl, background } from '../../assets';
import { Category } from "../../components/Category";


export const LandingPage =()=>{
    return(
        <>
        {/* <Carousal/> */}
        <img src={background} width={"100%"} height={"400px"} className='cover'/>
        <Category/>
        </>
    )
}