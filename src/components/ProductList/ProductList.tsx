import { useEffect } from "react";
import { useProduct } from "../../sdk/hooks/products/useProduct";
import { Stack, Grid } from "@mui/material";
import { ProductCard } from "../../shared/components/ProductCard";
import styles from "./product-list.module.scss"
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const ProductList = () => {
  const { getProduct, productList, loading } = useProduct();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(()=>{
    const query = {
      populate: "*",
      ...(searchParams.has("sort") && {
        sort: searchParams.get("sort")
      }),
      ...(searchParams.has("category") && {
        "filters[categoryid][$contains]": searchParams.get("category"),
      }),
      ...(searchParams.has("minPrice") && {
        "filters[price][$lte]": searchParams.get("minPrice"),
      }),
      ...(searchParams.has("maxPrice") && {
        "filters[price][$gte]": searchParams.get("maxPrice"),
      }),
    };
    getProduct(query)
  },[searchParams])

  const handleProductCardClick=(id:number)=>{
    navigate({
      pathname: '/product',
      search: `?id=${id.toString()}`,
    });
  }


  return (
    <Stack className={styles.productlist}>
      <Grid container spacing={1}>
        {productList?.map((data,index) => (
          <Grid item xs={4} key={index} className={styles.productcard} onClick={()=>handleProductCardClick(data?.id)}>
             <ProductCard data={data} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
