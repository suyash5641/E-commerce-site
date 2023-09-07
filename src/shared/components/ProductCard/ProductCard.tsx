import { Stack, Typography } from "@mui/material"
import { IProductLists } from "../../interfaces/interface"
export const ProductCard=({
    data,
}: {
    data: IProductLists
})=>{
    return(
       <Stack direction="column" sx={{boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",padding:"12px"}}>
         <Typography variant="h3">{data?.attributes?.brandName}</Typography>
         <Typography variant="h5" className="product_title">{data?.attributes?.title}</Typography>
         <Typography variant="h4">Rs {data?.attributes?.discountedPrice}</Typography>
         <img height={"100%"} width={"100%"}  src={`${data?.attributes?.imageurl?.data?.attributes?.url}`} alt="product"/>
       </Stack>
    )
}