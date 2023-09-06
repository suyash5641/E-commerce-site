import { useState, useRef, useEffect } from "react";
import {
  Button,
  Stack,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  Popover,
  ClickAwayListener,
  makeStyles,
  Box,
} from "@mui/material";
import styles from "./filter.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FilterDrawer } from "../../shared/components/FilterDrawer";
import { string } from "yup";
const sortby = [{val:"Price: High to Low",key:'price:desc'}, {val:"Price: Low to High",key:'price:asc'}];


export const Filter = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [sortValue,setSortValue] = useState<string>("");
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (value: string) => {
    setAnchorEl(null);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(
      "sort",
      value === "Price: High to Low" ? "price:desc" : "price:asc"
    );
    navigate({
      pathname: window.location.pathname,
      search: `?${searchParams.toString()}`,
    });
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(()=>{
    const sort = searchParams.get('sort')
    if(sort){
      setSortValue(sort);
    }
    else{
      setSortValue("");
    }
  },[searchParams,setSortValue])

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      className={styles.container}
    >
      <Stack direction={"row"} gap="24px" className={styles.filterbox}>
        <Button className={styles.filter} onClick={() => setDrawerOpen(true)}>
          <Typography variant="h6">Filters</Typography>
        </Button>
        <Button className={styles.sortby} onClick={handleClick}>
          <Typography variant="h6">Sort By</Typography>
        </Button>
      </Stack>
      <Popover
        ref={popoverRef}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {sortby.map((data, index) => (
          <Stack key={index} direction={"row"} gap="12px" sx={{ padding: "8px 20px", cursor: "pointer", color: "#67718B" }}>
            
            <Typography
              key={index}
              onClick={() => handleChange(data?.val)}
            >
              {data?.val}
            </Typography>
            {sortValue && sortValue === data?.key ? <CheckIcon/> :<Box sx={{width:'24px'}}></Box>}
          </Stack>
        ))}
      </Popover>
      <FilterDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    </Stack>
  );
};
