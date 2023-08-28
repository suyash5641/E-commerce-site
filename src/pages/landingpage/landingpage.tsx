import { Carousal } from "../../components/Carousal"
import { sony,boult,boat,jbl, background } from '../../assets';
import { Category } from "../../components/Category";
import { SearchBar } from "../../shared/components/SearchBar";
import { Box, Typography } from "@mui/material";


export const LandingPage =()=>{
    return(
        <>
        {/* <Carousal/> */}
        <SearchBar/>
        <Box>
        <img src={background} width={"100%"} height={"400px"} className='cover'/>
        <Typography className="title">Shop the World: Your One-Stop E-Commerce Destination</Typography>
        </Box>
        <Category/>
        </>
    )
}