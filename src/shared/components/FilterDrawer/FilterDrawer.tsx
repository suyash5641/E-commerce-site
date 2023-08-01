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
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import styles from "./filterdrawer.module.scss";
import { useProduct } from "../../../sdk/hooks/products/useProduct";
import { useParams, useSearchParams } from "react-router-dom";

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

export const FilterDrawer = ({ drawerOpen, setDrawerOpen }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { categoryList } = useProduct();
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const minDistance = 2500;

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

  const [category, setCategory] = useState("");

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

  const colors = [
    { label: "Red", value: "red" },
    { label: "Green", value: "green" },
    { label: "Blue", value: "blue" },
    { label: "Black", value: "black" },
    { label: "White", value: "white" },
    { label: "Grey", value: "grey" },
  ];

  const renderColorCheckboxes = () => {
    return colors.map((colorOption) => (
      <FormControlLabel
        key={colorOption.value}
        control={
          <Checkbox
            checked={selectedColors.includes(colorOption.value)}
            onChange={handleColorChange}
            value={colorOption.value}
          />
        }
        label={colorOption.label}
      />
    ));
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

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
    const searchParams = new URLSearchParams(window.location.search);

    if (category) {
      searchParams.set("categoryid", category);
    }
    searchParams.set("minPrice", price[0].toString());
    searchParams.set("maxPrice", price[1].toString());
    setSearchParams(searchParams);
    setDrawerOpen(false);
  }, [setSearchParams,price,category]);

  useEffect(() => {
    const category = searchParams.get("categoryid");
    const minPrice = parseInt(searchParams.get("minPrice") ?? "500");
    const maxPrice = parseInt(searchParams.get("maxPrice") ?? "30000");
    if (category) {
      setCategory(category);
    }
    setPrice([minPrice, maxPrice]);
  }, [searchParams]);

  const drawer = (
    <Box
      className={styles.filter}
      sx={{ width: "70%", paddingTop: "40px", margin: "0 auto" }}
    >
      <Typography variant="h3">Price</Typography>
      <Slider
        value={price}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={500}
        max={30000}
        marks={priceArray}
        step={100}
        getAriaValueText={valueText}
      />
      <Box className={styles.category}>
        <Typography variant="h3">Category</Typography>
        <FormControl className={styles.formlabel}>
          <Select
            value={category}
            onChange={handleChange}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            className={styles.selectdropdown}
          >
            {categoryList?.map((data, index) => (
              <MenuItem key={data?.id} value={data?.id}>
                {data?.attributes?.categorytype}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={styles.colorcheckbox} component="fieldset">
          <FormLabel component="legend">Colors</FormLabel>
          <FormGroup>{renderColorCheckboxes()}</FormGroup>
        </FormControl>
      </Box>
      <Button variant="contained" color="primary" onClick={handleFilterChange}>
        Apply filter
      </Button>
    </Box>
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
            width: { xs: 300, md: 360, lg: 360, xl: 360 },
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};
