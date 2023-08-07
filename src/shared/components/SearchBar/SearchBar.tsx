import { IconButton, Popover, Stack, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useState ,useEffect, useCallback, useRef} from "react";
import { useDebounce } from "../../../sdk/hooks/useDebounce/useDebounce";
import styles from './searchbar.module.scss'
import { useProduct } from "../../../sdk/hooks/products/useProduct";

export const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const {getProduct,productList,setProductList}= useProduct();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const debouncedValue = useDebounce<string>(searchText, 800)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setPopoverOpen] = useState<boolean>(false);
  const id = open ? "simple-popover" : undefined;
  const [isOpen, setIsOpen] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

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


  // console.log(debouncedValue,open,productList,isOpen)

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
        {productList?.map((data, index) => (
          <Stack key={index} direction={"row"} gap="12px" sx={{ padding: "8px 20px", cursor: "pointer", color: "#67718B" }}>
            <Typography>{data?.attributes?.title}</Typography>
          </Stack>
        ))}
      </Stack>}
    </Stack>
  );
};
