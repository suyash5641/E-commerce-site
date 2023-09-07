import { Box, IconButton, Stack, Typography,Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useProduct } from "../../sdk/hooks/products/useProduct";
import CloseIcon from '@mui/icons-material/Close';
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styles from './filterlist.module.scss'
interface filterArray {
    value: string,
    key:string
}



export const FilterList = () => {
 
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryList } = useProduct();
  const [filters, showFilters] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<Array<filterArray>>([]);
  const [searchParams,setSearchParams]=useSearchParams();
  

  useEffect(() => {
    const sort = searchParams.get('sort');
    const brandName = searchParams.get('brand');
    const categoryid = searchParams.get('categoryid') ?? ""; 
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    let filterArray: filterArray[] = [];
    if (sort) {
        filterArray.push({ value: sort ==='price:desc' ?"Price : High to Low":"Price: Low to High", key: 'sort' });
    }
    if (categoryid && categoryList) {
       const res = categoryList?.find(item => item.id === parseInt(categoryid) );
       filterArray.push({ value: `Category : ${res?.attributes?.categorytype ?? " "} ` , key: 'categoryid' });
    }
    if(minPrice && maxPrice){
        filterArray.push({ value: `Budget : ${minPrice} - ${maxPrice}`, key: 'price' });
    }
    if(brandName){
      filterArray.push({ value: `Brand : ${brandName}`, key: 'brand' });
    }
    showFilters(filterArray.length >0);
    setFilterData(filterArray);

  }, [searchParams,categoryList]);


  const handleRemoveFilters = useCallback((key:string)=>{
    const searchParams = new URLSearchParams(window.location.search);
    if(key ==="price"){
        searchParams.delete("minPrice");
        searchParams.delete("maxPrice");
    }
    else
    searchParams.delete(key);
    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    });
  },[navigate])

  const handleClearFilter = useCallback(()=>{
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.delete("minPrice");
    searchParams.delete("maxPrice");
    searchParams.delete("categoryid");
    searchParams.delete("sort");
    searchParams.delete("brand");
    navigate({
        pathname: location.pathname,
        search: `?${searchParams.toString()}`,
      });

  },[navigate])

  return (
    <>
    {filters && <Stack direction={"row"} justifyContent="space-between" className={styles.container}>
      <Stack direction={"row"}>
        <Stack alignItems={"center"} direction={"row"} className={styles.contentbox}>
        <Typography variant="h6" className={styles.content}>Filters :</Typography>
        </Stack>
        <Stack direction="row" gap={"8px" } className={styles.box}>
            {filterData?.map((data, index) => (
              <Stack direction="row" key={index} className={styles.filter}>
                <Typography variant="h6" className={styles.filtertext}>{data?.value ?? ""}</Typography>
                <IconButton sx={{height:'20px',padding:'0px 4px 0px 4px',borderRadius:'0px',marginLeft:'4px'}} onClick={()=>handleRemoveFilters(data?.key)}>
                    <CloseIcon sx={{fontSize:'16px'}}/>
                </IconButton>
              </Stack>
            ))}
        </Stack>
      </Stack>
      <Stack direction={"row"} alignItems={"center"}>
        <Button><Typography variant="h6" className={styles.clearfilter} onClick={handleClearFilter}>Clear filter</Typography></Button>
      </Stack>
    </Stack>}
    </>
  );
};
