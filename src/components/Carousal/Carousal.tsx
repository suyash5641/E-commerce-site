
import { sony,boult,boat,jbl, background } from '../../assets';
import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, Theme } from "@mui/material/styles";
import { styled } from "@mui/material/styles"; // Import 'styled' and 'useStyles' from '@mui/material/styles'
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Carousel from "react-material-ui-carousel";
// import SwipeableViews from "react-swipeable-views-react-18-fix";
// import { autoPlay } from "react-swipeable-views-utils";
// import { createTheme, ThemeProvider, Theme, useTheme } from '@mui/material/styles';
// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

// const items = [
//     {
      
//       imgPath:boult
//     },
//     {
      
//         imgPath:boat
//     },
//     {
     
//         imgPath:sony
//     },
//     {
//         imgPath:jbl
//     }
//   ];

const items = [
    {
      
      imgPath:background
    }
  ];

export const Carousal=()=>{

    const [index, setIndex] = React.useState(0);

    // const handleChange = (cur: number, prev: number) => {
    //   setIndex(cur);
    //   console.log(cur, prev);
    // };

    const Item=({ item }: { item: { imagePath: string } })=> {
        return (
          <img src={item?.imagePath} width={"100%"} height={"400px"} className='cover'/>
        );
      }
  
    return (
      <div>
        
          {items.map((item, i) => (
           <Item key={i} item={{ imagePath: item.imgPath }} />
          ))}
       
      </div>
    );
    
}
  

  
  
  
  






