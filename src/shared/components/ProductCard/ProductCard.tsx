import { Stack, Typography } from "@mui/material"
import { IProductLists } from "../../interfaces/interface"
export const ProductCard=({
    data,
}: {
    data: IProductLists
})=>{
    return(
       <Stack direction="column">
         <Typography variant="h3">{data?.attributes?.brandName}</Typography>
         <Typography variant="h5">{data?.attributes?.title}</Typography>
         <Typography variant="h5">{data?.attributes?.price}</Typography>
         <img height={"100%"} width={"100%"}  src={`${data?.attributes?.imageurl?.data?.attributes?.url}`} alt="product"/>
       </Stack>
    )
}