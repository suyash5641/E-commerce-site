import { Box, Drawer, Slider, Typography,SelectChangeEvent, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, FormLabel, FormGroup } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./filterdrawer.module.scss"
import { useProduct } from "../../../sdk/hooks/products/useProduct";

const drawerWidth = 240;
interface Props {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const FilterDrawer = ({ drawerOpen, setDrawerOpen }: Props) => {

  const {categoryList} = useProduct();
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const minDistance = 2500;

  //  const [value, setValue] = useState([500, 30000]);

  // const handleChange = (event: Event,
  //    newValue: number ,) => {
  //   setValue(newValue);
  // };

  const marks = [
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

  const [value2, setValue2] = useState<number[]>([500, 30000]);

  const [category, setCategory] = useState('');

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
    { label: 'Red', value: 'red' },
    { label: 'Green', value: 'green' },
    { label: 'Blue', value: 'blue' },
    { label: 'Black', value: 'black' },
    { label: 'White', value: 'white' },
    { label: 'Grey', value: 'grey' },
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

  const handleChange2 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue2([Math.min(newValue[0], value2[1] - minDistance), value2[1]]);
    } else {
      setValue2([value2[0], Math.max(newValue[1], value2[0] + minDistance)]);
    }
  };

  const drawer = (
    <Box className={styles.filter} sx={{ width: "70%", paddingTop: "40px", margin: "0 auto" }}>
      <Typography variant="h3">Price</Typography>
      <Slider
        value={value2}
        onChange={handleChange2}
        valueLabelDisplay="auto"
        min={500}
        max={30000}
        marks={marks}
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
          inputProps={{ 'aria-label': 'Without label' }}
          className={styles.selectdropdown}
        >
           {categoryList?.map((data,index) => (
            <MenuItem key={data?.id} value={data?.id}>{data?.attributes?.categorytype}</MenuItem>
        ))}
        
        </Select>
      </FormControl>
      <FormControl className={styles.colorcheckbox} component="fieldset">
      <FormLabel component="legend">Colors</FormLabel>
      <FormGroup>{renderColorCheckboxes()}</FormGroup>
    </FormControl>
      </Box>
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
