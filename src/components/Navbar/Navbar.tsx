import { Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./navbar.module.scss";
interface IProps {
  path: string;
  productTitle: string;
  changeTopPosition?: boolean;
}

interface ContentItem {
  label: string;
  path: string;
}

export const Navbar = ({ path, productTitle,changeTopPosition = false}: IProps) => {
  let contentItems: ContentItem[] = [];
  switch (path) {
    case "productlist":
      contentItems = [
        { label: "Home /", path: "/" },
        { label: "Product", path: "" },
      ];
      break;
    case "product":
      contentItems = [
        { label: "Home /", path: "/" },
        { label: "Product /", path: "/productlist" },
        { label: `${productTitle}`, path: "" },
      ];
      break;
    case "cart":
      contentItems = [
        { label: "Home /", path: "/" },
        { label: "Product /", path: "/productlist" },
        { label: "Cart", path: "" },
      ];
      break;
    case "order":
      contentItems = [
        { label: "Home /", path: "/" },
        { label: "Product /", path: "/productlist" },
        { label: "Orders", path: "" },
      ];
      break;
    default:
      break;
  }
  console.log(contentItems, "item", path);

  return (
    <Stack
      direction={"row"}
      className={styles.navbar}
      justifyContent={"flex-start"}
      sx={{top:changeTopPosition?"40px":"98.39px"}}
    >
      {contentItems.map((item, idx) => (
        <Box key={idx}>
          {item.path === "" ? (
            <Typography className={styles.labeltext}>{item.label}</Typography>
          ) : (
            <Link to={item.path}>
              <Typography className={styles.label}>{item.label}</Typography>
            </Link>
          )}
        </Box>
      ))}
    </Stack>
  );
};
