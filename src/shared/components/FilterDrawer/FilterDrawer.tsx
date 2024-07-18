import {
  Box,
  Drawer,
  Slider,
  Typography,
  SelectChangeEvent,
  FormControl,
  FormControlLabel,
  Button,
  Stack,
  Alert,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  RadioGroup,
  Radio,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./filterdrawer.module.scss";
import { useProduct } from "../../../sdk/hooks/products/useProduct";
import { useSearchParams } from "react-router-dom";
import { useBrand } from "../../../sdk/hooks/brand/useBrand";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const drawerWidth = 240;
interface Props {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface OpenState {
  category: boolean;
  brand: boolean;
}

export const FilterDrawer = ({ drawerOpen, setDrawerOpen }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const abortControllerRef = useRef<AbortController | null>(null);
  const { categoryList } = useProduct();
  const { brandList, getBrand, errorMessage, loading } = useBrand();
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

  // const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value, checked } = event.target;
  //   if (checked) {
  //     setSelectedColors((prevSelectedColors) => [...prevSelectedColors, value]);
  //   } else {
  //     setSelectedColors((prevSelectedColors) =>
  //       prevSelectedColors.filter((color) => color !== value)
  //     );
  //   }
  // };

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
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setCategory(event.target.value);
      getBrand(
        {
          populate: "*",
          "filters[categoryid][$eq]": event.target.value,
        },
        controller?.signal
      );
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
    } else searchParams.delete("brand");
    searchParams.set("minPrice", price[0].toString());
    searchParams.set("maxPrice", price[1].toString());
    setSearchParams(searchParams);
    setDrawerOpen(false);
  }, [setSearchParams, price, category, brand, searchParams, setDrawerOpen]);

  useEffect(() => {
    const abortController = new AbortController();
    const categoryid = searchParams.get("categoryid");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice") ?? "";
    const maxPrice = searchParams.get("maxPrice") ?? "";
    if (categoryid) {
      setCategory(categoryid);
      getBrand(
        { populate: "*", "filters[categoryid][$eq]": categoryid },
        abortController?.signal
      );
      setOpen({
        category: true,
        brand: true,
      });
      if (brand) {
        setBrand(brand);
      }
    }
    if (minPrice || maxPrice) {
      setPrice([parseInt(minPrice), parseInt(maxPrice)]);
    }

    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const categoryid = searchParams.get("categoryid");
    const brand = searchParams.get("brand");
    const minPrice = searchParams.get("minPrice") ?? "";
    const maxPrice = searchParams.get("maxPrice") ?? "";
    const allValuesEmpty = !categoryid && !brand && !minPrice && !maxPrice;
    if (allValuesEmpty) {
      setOpen({
        category: false,
        brand: false,
      });
      setPrice([500, 30000]);
      setCategory("");
      setBrand("");
    } else if (!brand) {
      setBrand("");
      if (!categoryid) {
        setOpen({
          category: false,
          brand: false,
        });
        setCategory("");
      } else
        setOpen({
          category: true,
          brand: false,
        });
    } else if (!categoryid && brand) {
      setOpen({
        category: false,
        brand: true,
      });
      setCategory("");
      setBrand(brand);
    } else if (!minPrice && !maxPrice) {
      setPrice([500, 30000]);
    }
  }, [searchParams]);

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
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        // padding: "0px 12px",
        padding: {
          xs: "0px 12px", // default padding
          sm: "0px 16px", // padding for screens &gt;= 640px
          md: "0px 40px", // padding for screens &gt;= 900px
        },
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <Stack sx={{ backgroundColor: "#F2F2F2" }}>
        <Typography
          variant="h3"
          textAlign={"start"}
          color={"#0a0c0f"}
          sx={{
            marginBottom: "24px",
            fontWeight: "500",
            // marginLeft: "14px",

            padding: "8px 16px ",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "14px",
          }}
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
            sx={{ margin: "24px 6px 40px 0px", width: "64%" }}
          />
        </Stack>
      </Stack>
      <ListItemButton
        onClick={() => handleClick("category")}
        sx={{ backgroundColor: "#F2F2F2", marginTop: "24px" }}
      >
        <ListItemText
          primary="Category"
          className="listtext"
          primaryTypographyProps={{
            fontFamily: "Montserrat, sans-serif",
            color: "#0a0c0f",
            fontSize: "14px",
            fontWeight: "500",
          }}
        />
        {open.category ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse
        in={open.category}
        timeout="auto"
        unmountOnExit
        sx={{ backgroundColor: "#F2F2F2", paddingBottom: "16px" }}
      >
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
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: "#000",
                        },
                        padding: "6px",
                      }}
                    />
                  }
                  label={data?.attributes?.categorytype}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </List>
      </Collapse>
      {category && category.length > 0 && (
        <Box
          sx={{
            backgroundColor: "#F2F2F2",
            marginTop: "24px",
            // borderBottomRadiusLeft: "8px",
            // borderBottomRadiusRight: "8px",
          }}
        >
          <ListItemButton onClick={() => handleClick("brand")}>
            <ListItemText
              primary="Brand"
              className="listtext"
              primaryTypographyProps={{
                fontFamily: "Montserrat, sans-serif",
                color: "#0a0c0f",
                fontSize: "14px",
                fontWeight: "500",
              }}
            />
            {open.brand ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse
            in={open.brand}
            timeout="auto"
            unmountOnExit
            sx={{ backgroundColor: "#F2F2F2", paddingBottom: "16px" }}
          >
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
                  {loading ? (
                    <Stack
                      sx={{
                        height: "36px",
                        alignItems: "center",
                        paddingTop: "10px",
                      }}
                    >
                      <CircularProgress
                        sx={{
                          height: "16px !important",
                          width: "16px !important",
                          // paddingBottom: "12px",
                        }}
                      />
                    </Stack>
                  ) : (
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
                            control={
                              <Radio
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#000",
                                  },
                                  padding: "6px",
                                }}
                              />
                            }
                            label={data?.attributes?.brandname}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                </Box>
              </List>
            )}
          </Collapse>
        </Box>
      )}
      {category.length === 0 && brand && (
        <Box
          sx={{
            backgroundColor: "#F2F2F2",
            marginTop: "24px",
            // borderBottomRadiusLeft: "8px",
            // borderBottomRadiusRight: "8px",
          }}
        >
          <ListItemButton onClick={() => handleClick("brand")}>
            <ListItemText
              primary="Brand"
              className="listtext"
              primaryTypographyProps={{
                fontFamily: "Montserrat, sans-serif",
                color: "#0a0c0f",
                fontSize: "14px",
                fontWeight: "500",
              }}
            />
            {open.brand ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse
            in={open.brand}
            timeout="auto"
            unmountOnExit
            sx={{ backgroundColor: "#F2F2F2", paddingBottom: "16px" }}
          >
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
                  {false ? (
                    <Stack
                      sx={{
                        height: "36px",
                        alignItems: "center",
                        paddingTop: "10px",
                      }}
                    >
                      <CircularProgress
                        sx={{
                          height: "16px !important",
                          width: "16px !important",
                          // paddingBottom: "12px",
                        }}
                      />
                    </Stack>
                  ) : (
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
                            control={
                              <Radio
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#000",
                                  },
                                  padding: "6px",
                                }}
                              />
                            }
                            label={data?.attributes?.brandname}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                </Box>
              </List>
            )}
          </Collapse>
        </Box>
      )}
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        sx={{ width: "100%", margin: "24px 0px 0px 0px" }}
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
            width: { xs: 250, md: 360, lg: 360, xl: 360 },
            paddingTop: "32px",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};
