import { useEffect } from "react";
import { useProduct } from "../../sdk/hooks/products/useProduct";
import { Stack, Grid } from "@mui/material";
import { ProductCard } from "../../shared/components/ProductCard";
import styles from "./product-list.module.scss"

export const ProductList = () => {
  const { getProduct, productList, loading } = useProduct();
  useEffect(() => {
    getProduct();
  }, []);

  console.log(productList, loading);
  return (
    <Stack className={styles.productlist}>
      <Grid container spacing={1}>
        {productList?.map((data,index) => (
          <Grid item xs={4} key={index} className={styles.productcard}>
             <ProductCard data={data} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
