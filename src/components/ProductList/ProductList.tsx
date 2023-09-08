import { useCallback, useEffect } from "react";
import { useProduct } from "../../sdk/hooks/products/useProduct";
import { Stack, Grid, Skeleton ,CircularProgress, Typography} from "@mui/material";
import { ProductCard } from "../../shared/components/ProductCard";
import styles from "./product-list.module.scss"
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { nodatafound } from "../../assets";

export const ProductList = () => {
  const { getProduct, productList, loading } = useProduct();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryid = searchParams.get("categoryid");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const brand = searchParams.get("brand");
  const sort = searchParams.get("sort");
  const navigate = useNavigate();

  const getProductList = useCallback(async(query:any)=>{
      await getProduct(query);
  },[getProduct])

  useEffect(()=>{
    const query = {
      populate: "*",
      ...(searchParams.has("sort") && { sort: sort}),
      ...(searchParams.has("categoryid") && {
              "filters[categoryid][$contains]": categoryid,
            }),
            ...(searchParams.has("minPrice") && {
              "filters[price][$gte]": minPrice,
            }),
            ...(searchParams.has("maxPrice") && {
              "filters[price][$lte]": maxPrice,
            }),
            ...(searchParams.has("brand") && {
              "filters[brandName][$eq]": brand,
            }),
    };
   
    getProductList(query);
  },[categoryid,minPrice,maxPrice,brand,sort])

  const handleProductCardClick=(id:number)=>{
    navigate({
      pathname: '/product',
      search: `?id=${id.toString()}`,
    });
  }

  return (
    <>
    {loading ? <Stack className="loader">
      <CircularProgress />
    </Stack> :
    <Stack className={styles.productlist}>
      <Grid container spacing={1}>
        {productList && productList?.length >0  ? productList?.map((data,index) => (
          <Grid item xs={4} key={index} className={styles.productcard} onClick={()=>handleProductCardClick(data?.id)}>
             <ProductCard data={data} />
          </Grid>
        )):
        <Stack alignItems="center" sx={{width:"100%"}}>
          <img width="240px" src={nodatafound} />
        </Stack>
      }
      </Grid>
    </Stack>}
    </>
  );
};
