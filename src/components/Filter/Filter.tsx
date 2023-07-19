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
} from "@mui/material";
import styles from "./filter.module.scss";
import {
    useSearchParams,
  } from 'react-router-dom';
import { FilterDrawer } from "../../shared/components/FilterDrawer";
const sortby = ["Price: High to Low", "Price: Low to High"];

export const Filter = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen,setDrawerOpen]= useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange =(value:string)=>{
    setAnchorEl(null);
    setSearchParams({ sort: value==="Price: High to Low"?'price:desc':'price:asc' });
    console.log(value)
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      className={styles.container}
    >
      <Button className={styles.filter} onClick={()=>setDrawerOpen(true)}>
        <Typography variant="h6">Filters</Typography>
      </Button>
      <Button className={styles.sortby} onClick={handleClick}>
        <Typography variant="h6">Sort By</Typography>
      </Button>
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
          {sortby.map((name, index) => (
            <Typography key={index} onClick={()=>handleChange(name)}>
              {name}
            </Typography>
          ))}
      </Popover>
      <FilterDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
    </Stack>
  );
};
