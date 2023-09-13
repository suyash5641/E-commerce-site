import { background, offer } from "../../assets";
import React, { useCallback, useState } from "react";
import Typography from "@mui/material/Typography";
import Carousel from "react-material-ui-carousel";
import { Box, Stack } from "@mui/material";

const items = [
  {
    imgPath: background,
    description: "Shop the World: Your One-Stop E-Commerce Destination",
    showAnimation: false,
    title:""
  },
  {
    imgPath: offer,
    description: "BIG SALE",
    title:"UP TO 50% OFF",
    showAnimation: true,
  },
];

export const Carousal = () => {
  const [index, setIndex] = React.useState(0);

  const Item = ({
    item,
  }: {
    item: { imagePath: string; description: string; showAnimation: boolean ,title:string};
  }) => {
    return (
      <Box>
        <img
          src={item?.imagePath}
          width={"100%"}
          height={"400px"}
          className="cover"
        />
        {item?.showAnimation ? (
          <Stack>
             <Typography className={"cover-text"}>
              {item?.title}
            </Typography>
            <Typography className={"animate-charcter"}>
              {item?.description}
            </Typography>
          </Stack>
        ) : (
          <Typography className={"title"}>{item?.description}</Typography>
        )}
      </Box>
    );
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Carousel
        index={index}
        indicators={true}
        swipe={true}
        autoPlay={true}
        animation="slide"
        duration={200}
        sx={{ height: "440px" }}
      >
        {items.map((item, i) => (
          <Item
            key={i}
            item={{
              imagePath: item.imgPath,
              description: item.description,
              showAnimation: item.showAnimation,
              title:item.title
            }}
          />
        ))}
      </Carousel>
    </div>
  );
};
