import { IconButton, Popover, Stack, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useState ,useEffect, useCallback, useRef} from "react";
import { useDebounce } from "../../../sdk/hooks/useDebounce/useDebounce";
import styles from './searchbar.module.scss'
import { useProduct } from "../../../sdk/hooks/products/useProduct";
import { useNavigate } from "react-router-dom";
import { norecordfound } from "../../../assets";

export const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const {getProduct,productList,setProductList}= useProduct();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const debouncedValue = useDebounce<string>(searchText, 1000)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setPopoverOpen] = useState<boolean>(false);
  const id = open ? "simple-popover" : undefined;
  const [isOpen, setIsOpen] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleSearchChange = useCallback((event: any) => {
    setSearchText(event.target.value);
  },[setSearchText]);

  const handleClose = useCallback(() => {
    setPopoverOpen(false);
  },[setPopoverOpen]);

  const handleClearSearch = useCallback(() => {
    setSearchText("");
    setProductList([]);
    setPopoverOpen(false);
  },[setSearchText,setProductList,setPopoverOpen]);

  const showProduct = useCallback((id:number)=>{
      navigate(`/product?id=${id}`)
  },[navigate])

  useEffect(() => {
    if(debouncedValue){
    const query = {
        populate: "*",
        "filters[title][$containsi]":debouncedValue
      };
     getProduct(query);
     setIsOpen(true);
    }
    //  if(debouncedValue){
    //     setPopoverOpen(true);
    //  }
    //  else{
    //     setPopoverOpen(false);
    //  }
     
  }, [debouncedValue,setIsOpen])

 

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [divRef,setIsOpen]);

  // console.log(!isOpen ,"test", productList?.length == 0,debouncedValue)

  return (
    <Stack>
      <TextField
        placeholder="Search "
        value={searchText}
        className={styles.textfield}
        onFocus={()=>{setIsOpen(true)}}
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: (
            <>
              {searchText.length > 0 && (
                <IconButton
                  onClick={handleClearSearch}
                  edge="end"
                  tabIndex={-1}
                >
                  <ClearIcon />
                </IconButton>
              )}
            </>
          ),
          startAdornment: (
            <>
              <IconButton edge="end" tabIndex={-1} sx={{marginRight:'8px'}}>
                <SearchIcon />
              </IconButton>
            </>
          ),
        }}
      />
    {isOpen && debouncedValue && productList && <Stack className={styles.box} ref={divRef}
      >
        {productList.length > 0 ? productList?.map((data, index) => (
          <Stack key={index} direction={"row"} alignItems={"center"} gap="12px" className={styles.searchitem} onClick={()=>showProduct(data?.id)}>
            <img width="60px" src={data?.attributes?.imageurl?.data?.attributes?.url}/>
            <Typography>{data?.attributes?.title}</Typography>
          </Stack>
        ))
        :
        <Stack className={styles.emptysearchresult}>
          <img src={norecordfound} width={"200px"} height={"200px"} />
        </Stack>
      }
      </Stack>}
    </Stack>
  );
};
