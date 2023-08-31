import { useCallback, useEffect } from "react";
import { useProduct } from "../../sdk/hooks/products/useProduct";
import { Stack, Grid, Skeleton } from "@mui/material";
import { ProductCard } from "../../shared/components/ProductCard";
import styles from "./product-list.module.scss"
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const ProductList = () => {
  const { getProduct, productList, loading } = useProduct();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const getProductList = useCallback(async(query:any)=>{
      await getProduct(query);
  },[getProduct])

  useEffect(()=>{
    const query = {
      populate: "*",
      ...(searchParams.has("sort") && {
        sort: searchParams.get("sort")
      }),
      ...(searchParams.has("categoryid") && {
        "filters[categoryid][$contains]": searchParams.get("categoryid"),
      }),
      ...(searchParams.has("minPrice") && {
        "filters[price][$gte]": searchParams.get("minPrice"),
      }),
      ...(searchParams.has("maxPrice") && {
        "filters[price][$lte]": searchParams.get("maxPrice"),
      }),
      ...(searchParams.has("brand") && {
        "filters[brandName][$eq]": searchParams.get("brand"),
      }),
    };
    
    getProductList(query);
  },[searchParams,getProductList])

  const handleProductCardClick=(id:number)=>{
    navigate({
      pathname: '/product',
      search: `?id=${id.toString()}`,
    });
  }

  return (
    <>
    {loading ? <Skeleton variant="rectangular" width={"100%"} height={"90vh"} />:
    <Stack className={styles.productlist}>
      <Grid container spacing={1}>
        {productList?.map((data,index) => (
          <Grid item xs={4} key={index} className={styles.productcard} onClick={()=>handleProductCardClick(data?.id)}>
             <ProductCard data={data} />
          </Grid>
        ))}
      </Grid>
    </Stack>}
    </>
  );
};
