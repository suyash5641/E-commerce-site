import {
  Box,
  Drawer,
  Slider,
  Typography,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormLabel,
  FormGroup,
  Button,
  Stack,
  Alert,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import styles from "./filterdrawer.module.scss";
import { useProduct } from "../../../sdk/hooks/products/useProduct";
import { useParams, useSearchParams } from "react-router-dom";
import { useBrand } from "../../../sdk/hooks/brand/useBrand";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const drawerWidth = 240;
interface Props {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Query {
  id?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface OpenState {
  category: boolean;
  brand: boolean;
}

export const FilterDrawer = ({ drawerOpen, setDrawerOpen }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { categoryList } = useProduct();
  const { brandList, getBrand, errorMessage, setErrorMessage } = useBrand();
  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen(!drawerOpen);
  }, [setDrawerOpen, drawerOpen]);

  const [open, setOpen] = useState<OpenState>({
    category: false,
    brand: false,
  });

  const handleClick = (value: keyof OpenState) => {
    setOpen({
      ...open,
      [value]: !open[value],
    });
  };

  const minDistance = 3000;

  const priceArray = [
    {
      value: 500,
      label: "500",
    },
    {
      value: 30000,
      label: "30,000",
    },
  ];

  // const step = 5000;

  const [price, setPrice] = useState<number[]>([500, 30000]);

  const [category, setCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");

  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedColors((prevSelectedColors) => [...prevSelectedColors, value]);
    } else {
      setSelectedColors((prevSelectedColors) =>
        prevSelectedColors.filter((color) => color !== value)
      );
    }
  };

  // const colors = [
  //   { label: "Red", value: "red" },
  //   { label: "Green", value: "green" },
  //   { label: "Blue", value: "blue" },
  //   { label: "Black", value: "black" },
  //   { label: "White", value: "white" },
  //   { label: "Grey", value: "grey" },
  // ];

  // const renderColorCheckboxes = () => {
  //   return colors.map((colorOption) => (
  //     <FormControlLabel
  //       key={colorOption.value}
  //       control={
  //         <Checkbox
  //           checked={selectedColors.includes(colorOption.value)}
  //           onChange={handleColorChange}
  //           value={colorOption.value}
  //         />
  //       }
  //       label={colorOption.label}
  //     />
  //   ));
  // };

  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      setCategory(event.target.value);
      getBrand({
        populate: "*",
        "filters[categoryid][$eq]": event.target.value,
      });
      setBrand("");
    },
    [setCategory, getBrand, setBrand]
  );

  const handleBrandChange = useCallback(
    (event: SelectChangeEvent) => {
      setBrand(event.target.value);
    },
    [setBrand]
  );

  const valueText = (value: number) => `${value} USD`;

  const handlePriceChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setPrice([Math.min(newValue[0], price[1] - minDistance), price[1]]);
    } else {
      setPrice([price[0], Math.max(newValue[1], price[0] + minDistance)]);
    }
  };

  const handleFilterChange = useCallback(() => {
    // const searchParams = new URLSearchParams(window.location.search);

    if (category) {
      searchParams.set("categoryid", category);
    }
    if (brand) {
      searchParams.set("brand", brand);
    }
    searchParams.set("minPrice", price[0].toString());
    searchParams.set("maxPrice", price[1].toString());
    setSearchParams(searchParams);
    setDrawerOpen(false);
  }, [setSearchParams, price, category, brand, searchParams]);

  useEffect(() => {
    const categoryid = searchParams.get("categoryid");
    const brand = searchParams.get("brand");
    const minPrice= searchParams.get("minPrice") ?? "";
    const maxPrice= searchParams.get("maxPrice") ?? "";
    if (categoryid) {
      setCategory(categoryid);
      getBrand({ populate: "*", "filters[categoryid][$eq]": categoryid });
      setOpen({
        category: true,
        brand: true,
      })
      if(brand){
        setBrand(brand)
      }
    }
    if(minPrice  || maxPrice ){
       setPrice([parseInt(minPrice),parseInt(maxPrice)])
    }
   
  }, []);

  // const drawer = (
  //   <Box
  //     className={styles.filter}
  //     sx={{ width: "82%", paddingTop: "40px", margin: "0 auto" }}
  //   >
  //     <Typography variant="h3" textAlign={"center"} sx={{marginBottom:'36px'}}>Price Range</Typography>
  //     <Slider
  //       value={price}
  //       onChange={handlePriceChange}
  //       valueLabelDisplay="on"
  //       min={500}
  //       max={30000}
  //       marks={priceArray}
  //       step={100}
  //       getAriaValueText={valueText}
  //       valueLabelFormat={value => <div>{`Rs ${(value)}`}</div>}
  //     />
  //     <Box className={styles.category}>
  //       <Typography variant="h3">Category</Typography>
  //       <FormControl className={styles.formlabel}>
  //         <Select
  //           value={category}
  //           onChange={handleChange}
  //           displayEmpty
  //           inputProps={{ "aria-label": "Without label" }}
  //           className={styles.selectdropdown}
  //         >
  //           {categoryList?.map((data, index) => (
  //             <MenuItem key={data?.id} value={data?.id}>
  //               {data?.attributes?.categorytype}
  //             </MenuItem>
  //           ))}
  //         </Select>
  //       </FormControl>
  //       {/* <FormControl className={styles.colorcheckbox} component="fieldset">
  //         <FormLabel component="legend">Colors</FormLabel>
  //         <FormGroup>{renderColorCheckboxes()}</FormGroup>
  //       </FormControl> */}
  //     </Box>
  //     {errorMessage && errorMessage.length >0 ?<Stack alignItems="center" sx={{ width: "100%",margin:"12px 0px" }} spacing={2}>
  //     <Alert
  //       className="errornotification"
  //       severity={"error"}
  //       // onClose={() => {
  //       //  setErrorMessage("")
  //       // }}
  //     >
  //       {errorMessage}
  //     </Alert>
  //     </Stack>:
  //     <Box className={styles.category}>
  //       <Typography variant="h3">Select Brand</Typography>
  //       <FormControl className={styles.formlabel}>
  //         <Select
  //           value={brand}
  //           onChange={handleBrandChange}
  //           displayEmpty
  //           inputProps={{ "aria-label": "Without label" }}
  //           className={styles.selectdropdown}
  //         >
  //           {brandList?.map((data, index) => (
  //             <MenuItem key={data?.id} value={data?.attributes?.brandname}>
  //               {data?.attributes?.brandname}
  //             </MenuItem>
  //           ))}
  //         </Select>
  //       </FormControl>
  //     </Box>}
  //     <Stack direction={"row"} justifyContent={"space-between"} sx={{width:"100%"}}>
  //     <Button className={styles.categorybutton} variant="contained" color="secondary" onClick={handleFilterChange}>
  //       Apply filter
  //     </Button>
  //     <Button className={styles.categorybutton} variant="contained" color="secondary" onClick={handleDrawerToggle}>
  //       Close
  //     </Button>
  //     </Stack>
  //   </Box>
  // );

  const drawer = (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <Typography
        variant="h3"
        textAlign={"start"}
        sx={{ marginBottom: "36px",fontWeight:"500",marginLeft:"14px" }}
      >
        Price Range
      </Typography>
      <Stack direction={"row"} justifyContent={"center"}>
        <Slider
          value={price}
          onChange={handlePriceChange}
          valueLabelDisplay="on"
          min={500}
          max={30000}
          marks={priceArray}
          step={100}
          getAriaValueText={valueText}
          valueLabelFormat={(value) => <div>{`Rs ${value}`}</div>}
          sx={{ margin: "24px 10px 24px 0px", width: "70%" }}
        />
      </Stack>
      <ListItemButton onClick={() => handleClick("category")}>
        <ListItemText primary="Category" className="listtext" />
        {open.category ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open.category} timeout="auto" unmountOnExit>
        <List className="collapse" component="div" disablePadding>
          <FormControl className={styles.formlabel}>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={category}
              onChange={handleChange}
              color="red"
            >
              {categoryList?.map((data, index) => (
                <FormControlLabel
                  key={data?.id}
                  value={data?.id}
                  control={<Radio  sx={{
                    '&.Mui-checked': {
                      color: '#000',
                    },
                  }} />}
                  label={data?.attributes?.categorytype}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </List>
      </Collapse>
      {category && category.length > 0 && <Box>
      <ListItemButton onClick={() => handleClick("brand")}>
        <ListItemText primary="Brand" className="listtext" />
        {open.brand ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open.brand} timeout="auto" unmountOnExit>
        {/* <List className="collapse_brand" component="div" disablePadding> */}
          {errorMessage && errorMessage.length > 0 ? (
            <Stack
              alignItems="center"
              sx={{ width: "100%", margin: "12px 0px" }}
              spacing={2}
            >
              <Alert
                className="errornotification"
                severity={"error"}
                // onClose={() => {
                //  setErrorMessage("")
                // }}
              >
                {errorMessage}
              </Alert>
            </Stack>
          ) : (
            <List className="collapse_brand" component="div" disablePadding>
            <Box className={styles.category}>
              <FormControl className={styles.formlabel}>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={brand}
                  onChange={handleBrandChange}

                  // className={styles.selectdropdown}
                >
                  {brandList?.map((data, index) => (
                    <FormControlLabel
                      key={data?.id}
                      value={data?.attributes?.brandname}
                      control={<Radio  sx={{
                        '&.Mui-checked': {
                          color: '#000',
                        },
                      }} />}
                      label={data?.attributes?.brandname}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
            </List>
          )}    
      </Collapse>
      </Box>}
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        sx={{ width: "86%",margin:"24px" }}
      >
        <Button
          className={styles.categorybutton}
          variant="contained"
          color="secondary"
          onClick={handleFilterChange}
        >
          Apply filter
        </Button>
        <Button
          className={styles.categorybutton}
          variant="contained"
          color="secondary"
          onClick={handleDrawerToggle}
        >
          Close
        </Button>
      </Stack>
    </List>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "block", lg: "block", xl: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: 340, md: 360, lg: 360, xl: 360 },
            paddingTop:"32px"
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};
