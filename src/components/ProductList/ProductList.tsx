import { useCallback, useEffect } from "react";
import { useProduct } from "../../sdk/hooks/products/useProduct";
import { Stack, Grid, CircularProgress, Alert } from "@mui/material";
import { ProductCard } from "../../shared/components/ProductCard";
import styles from "./product-list.module.scss";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { nodatafound } from "../../assets";

export const ProductList = () => {
  const { getProduct, productList, loading, errorMessage, setErrorMessage } =
    useProduct();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryid = searchParams.get("categoryid");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const brand = searchParams.get("brand");
  const sort = searchParams.get("sort");

  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();
    const query: Record<string, any> = {
      populate: "*",
    };
    if (sort) query.sort = sort;
    if (categoryid) query["filters[categoryid][$eq]"] = categoryid;
    if (minPrice) query["filters[price][$gte]"] = minPrice;
    if (maxPrice) query["filters[price][$lte]"] = maxPrice;
    if (brand) query["filters[brandName][$eq]"] = brand;
    getProduct(query, abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [brand, categoryid, getProduct, maxPrice, minPrice, sort]);

  const handleProductCardClick = (id: number) => {
    navigate({
      pathname: "/product",
      search: `?id=${id.toString()}`,
    });
  };
  return (
    <>
      {loading ? (
        <Stack className="loader">
          <CircularProgress />
        </Stack>
      ) : (
        <Stack className={styles.productlist}>
          {errorMessage && errorMessage.length > 0 ? (
            <Stack alignItems="center" sx={{ width: "100%" }} spacing={2}>
              <Alert
                className="errornotification"
                severity={"error"}
                onClose={() => {
                  setErrorMessage("");
                }}
              >
                {errorMessage}
              </Alert>
            </Stack>
          ) : (
            <Grid container spacing={1}>
              {productList && productList?.length > 0
                ? productList?.map((data, index) => (
                    <Grid
                      item
                      xs={4}
                      key={index}
                      className={styles.productcard}
                      onClick={() => handleProductCardClick(data?.id)}
                    >
                      <ProductCard data={data} />
                    </Grid>
                  ))
                : productList &&
                  productList?.length === 0 && (
                    <Stack alignItems="center" sx={{ width: "100%" }}>
                      <img width="240px" src={nodatafound} alt="imageproduct" />
                    </Stack>
                  )}
            </Grid>
          )}
        </Stack>
      )}
    </>
  );
};
