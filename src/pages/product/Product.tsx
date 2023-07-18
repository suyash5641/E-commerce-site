import { useEffect } from "react";
import { useProduct } from "../../sdk/hooks/products/useProduct"
import { useSearchParams } from "react-router-dom";
import { Stack, Typography } from "@mui/material";

export const Product=()=>{
    const {getProductDetail,productDetail}=useProduct();
    const [searchParams,setSearchParams]= useSearchParams();
    const idParam = searchParams.get('id');
    useEffect(()=>{
      if(searchParams.has('id') && idParam != null){
        getProductDetail(parseInt(idParam))
      }
    },[searchParams])

    return(
        <>
         <Stack direction="column">
         <Typography variant="h3">{productDetail?.attributes?.brandName}</Typography>
         <Typography variant="h5">{productDetail?.attributes?.title}</Typography>
         <Typography variant="h5">{productDetail?.attributes?.price}</Typography>
         <img height={300}  src={`http://localhost:1337${productDetail?.attributes?.imageurl?.data?.attributes?.url}`} alt="product"/>
       </Stack>
        </>
    )
}