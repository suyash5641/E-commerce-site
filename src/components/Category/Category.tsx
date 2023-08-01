import { Typography, Box, Stack, Grid } from "@mui/material";
import { headphone, earphone, speaker, smartwatch } from "../../assets";
import styles from "./category.module.scss";
import { useNavigate } from "react-router-dom";

export const Category = () => {
  const navigate = useNavigate();
  const images = [
    {
      imgPath: headphone,
      label: "headphone",
      categoryid: "1",
    },
    {
      imgPath: earphone,
      label: "earphone",
      categoryid: "2",
    },
    {
      imgPath: speaker,
      label: "speaker",
      categoryid: "4",
    },
    {
      imgPath: smartwatch,
      label: "smartwatch",
      categoryid: "3",
    },
  ];

  const Item = ({ item }: { item: { imagePath: string, label: string,categoryid:string } }) => {
    return (
      <Grid className={styles.card} onClick={() => {navigate(`/home?categoryid=${item?.categoryid}`)}}>
        <img src={item?.imagePath} width={"100%"} height={"280px"} />
        <Typography variant="h3" textAlign={"center"}>
          {item?.label}
        </Typography>
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
