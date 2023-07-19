import { useEffect } from "react";
import { useProduct } from "../../sdk/hooks/products/useProduct"
import { useSearchParams } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import styles from './product.module.scss'

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
         <Stack className={styles.productcontainer} >
         <Stack className={styles.productimage}>
         <img  src={`http://localhost:1337${productDetail?.attributes?.imageurl?.data?.attributes?.url}`} alt="product"/>
         </Stack>
         <Stack className={styles.productinfo}>
         {/* <Typography variant="h3">{productDetail?.attributes?.brandName}</Typography> */}
         <Typography variant="h2">{productDetail?.attributes?.title}</Typography>
         <Typography variant="h2" className={styles.discountedPrice}>{productDetail?.attributes?.discountedPrice}</Typography>
         <Stack direction={"row"} gap={"24px"}>
         <Typography variant="h5" className={styles.price}>{productDetail?.attributes?.price}</Typography>
         <Typography variant="h5" className={styles.discountPercent}>{productDetail?.attributes?.discountPercent}{" off"}</Typography>
         </Stack>
         </Stack>
         </Stack>
       </Stack>
        </>
    )
}