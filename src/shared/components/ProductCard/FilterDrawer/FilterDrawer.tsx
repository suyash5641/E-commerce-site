import { Box, Drawer, Slider } from "@mui/material";
import { useState } from "react";

const drawerWidth = 240;
interface Props {
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const FilterDrawer = ({ drawerOpen, setDrawerOpen }: Props) => {

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const minDistance = 100;

  const [value2, setValue2] = useState<number[]>([100, 40000]);

  const handleChange2 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue2([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue2([clamped - minDistance, clamped]);
      }
    } else {
      setValue2(newValue as number[]);
    }
  };

  const drawer =<Box sx={{ width: 300 }}>
  <Slider
    getAriaLabel={() => 'Minimum distance shift'}
    value={value2}
    onChange={handleChange2}
    valueLabelDisplay="auto"
    // getAriaValueText={valuetext}
    disableSwap
  />
</Box>;

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
            width: { xs: 240, md: 360, lg: 360, xl: 360 },
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};
