import { Stack, Typography } from "@mui/material";
import { IProductLists } from "../../interfaces/interface";
export const ProductCard = ({ data }: { data: IProductLists }) => {
  return (
    <Stack
      direction="column"
      sx={{
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        padding: "12px",
      }}
    >
      <Typography variant="h3">{data?.attributes?.brandName}</Typography>
      <Typography variant="h5" className="product_title">
        {data?.attributes?.title}
      </Typography>
      <Stack direction={"row"} gap={"16px"} alignItems={"center"} className="product_card_price">
        <Typography variant="h4">
          Rs {data?.attributes?.discountedPrice}
        </Typography>
        <Stack direction={"row"} gap={"16px"} className="product_card_box">
        <Typography variant="h5" className="product_price">
          Rs {data?.attributes?.price}
        </Typography>
        <Typography variant="h5" className="product_discount">
          {data?.attributes?.discountPercent}
          {" off"}
        </Typography>
        </Stack>
      </Stack>
      <img
        height={"100%"}
        width={"100%"}
        src={`${data?.attributes?.imageurl?.data?.attributes?.url}`}
        alt="product"
      />
    </Stack>
  );
};
