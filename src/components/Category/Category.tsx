import { Typography, Box, Stack, Grid } from "@mui/material";
import { headphone, earphone, speaker, smartwatch } from "../../assets";
import styles from "./category.module.scss";
import { useNavigate } from "react-router-dom";

export const Category = () => {
  const navigate = useNavigate();
  const images = [
    {
      imgPath: headphone,
      label: "Headphone",
      categoryid: "1",
    },
    {
      imgPath: earphone,
      label: "Earphone",
      categoryid: "2",
    },
    {
      imgPath: speaker,
      label: "Speaker",
      categoryid: "4",
    },
    {
      imgPath: smartwatch,
      label: "Smartwatch",
      categoryid: "3",
    },
  ];

  const Item = ({ item }: { item: { imagePath: string, label: string,categoryid:string } }) => {
    return (
      <Grid className={styles.card} onClick={() => {navigate(`/productlist?categoryid=${item?.categoryid}`)}}>
        <img src={item?.imagePath} width={"100%"} height={"90%"} />
        <Stack sx={{marginTop:"8px"}}>
        <Typography variant="h3" textAlign={"center"}>
          {item?.label}
        </Typography>
        </Stack>
      </Grid>
    );
  };

  return (
    <Box className={styles.box}>
      <Typography variant="h2">Shop by category</Typography>
      <Grid container className={styles.container}>
        {images.map((item, i) => (
          <Item key={i} item={{ imagePath: item.imgPath, label: item.label,categoryid:item.categoryid }} />
        ))}
      </Grid>
    </Box>
  );
};
