import { useCallback, useMemo, useState } from "react";
import {
  IProductLists,
  // ICategory,
  // IUser,
  Cart,
} from "../../../shared/interfaces/interface";
// import { useProduct } from "../products/useProduct";
import { useAuth } from "../../context/AuthContext/AuthProvider";
// import { ProductCard } from "../../../shared/components/ProductCard";
import { BASE_URL } from "../../../utils/constant/constant";
// interface updateCart {
//   productid: number,removeProduct:boolean,productQuantity?:number
// }

export const useBuyCart = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [cartdetailloading, setCartDetailLoading] = useState<Boolean>(false);
  // const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem("authToken");
  // const [productDetail, setProductDetail] = useState<IProductLists>();
  const { user, fetchLoggedInUser } = useAuth();

  const getPayload = useCallback(
    (productObject: any) => {
      if (user?.cart === null) {
        const payload = {
          discountPrice:
            parseInt(productObject?.attributes?.price) -
            parseInt(productObject?.attributes?.discountedPrice),
          cartActualPrice: parseInt(productObject?.attributes?.discountedPrice),
          cartTotalPrice: parseInt(productObject?.attributes?.price),
          cart: [productObject],
        };
        return payload;
      } else {
        const res = user?.cart;
        res?.push(productObject);
        const payload = {
          discountPrice:
            parseInt(productObject?.attributes?.price) -
            parseInt(productObject?.attributes?.discountedPrice) +
            parseInt(user?.discountPrice?.toString() || "0"),
          cartActualPrice:
            parseInt(productObject?.attributes?.discountedPrice) +
            parseInt(user?.cartActualPrice?.toString() || "0"),
          cartTotalPrice:
            parseInt(productObject?.attributes?.price) +
            parseInt(user?.cartTotalPrice?.toString() || "0"),
          cart: res,
        };
        return payload;
      }
    },
    [
      user?.cart,
      user?.cartActualPrice,
      user?.cartTotalPrice,
      user?.discountPrice,
    ]
  );

  const getUpdateCartPayload = useCallback(
    (data: Cart, removeProduct: boolean, operationType: string) => {
      if (removeProduct) {
        const filterCart = user?.cart?.filter((item) => item.id != data?.id);
        if (filterCart?.length === 0) {
          const payload = {
            discountPrice: null,
            cartActualPrice: null,
            cartTotalPrice: null,
            cart: null,
          };
          return payload;
        } else {
          const payload = {
            discountPrice:
              parseInt(user?.discountPrice?.toString() || "0") -
              (parseInt(data?.attributes?.price) -
                parseInt(data?.attributes?.discountedPrice)) *
                data?.quantity,
            cartActualPrice:
              parseInt(user?.cartActualPrice?.toString() || "0") -
              parseInt(data?.attributes?.discountedPrice) * data?.quantity,
            cartTotalPrice:
              parseInt(user?.cartTotalPrice?.toString() || "0") -
              parseInt(data?.attributes?.price) * data?.quantity,
            cart: filterCart,
          };
          return payload;
        }
      } else {
        const cartIndexToUpdate = user?.cart?.findIndex(
          (item) => item.id === data?.id
        );
        const filterCart = user?.cart;
        if (
          filterCart !== undefined &&
          cartIndexToUpdate !== undefined &&
          cartIndexToUpdate >= 0
        ) {
          filterCart[cartIndexToUpdate].quantity =
            operationType === "inc" ? data?.quantity + 1 : data?.quantity - 1;
        }
        if (operationType === "inc") {
          const payload = {
            discountPrice:
              parseInt(user?.discountPrice?.toString() || "0") +
              parseInt(data?.attributes?.price) -
              parseInt(data?.attributes?.discountedPrice),
            cartActualPrice:
              parseInt(user?.cartActualPrice?.toString() || "0") +
              parseInt(data?.attributes?.discountedPrice),
            cartTotalPrice:
              parseInt(user?.cartTotalPrice?.toString() || "0") +
              parseInt(data?.attributes?.price),
            cart: filterCart,
          };
          return payload;
        } else {
          const payload = {
            discountPrice:
              parseInt(user?.discountPrice?.toString() || "0") -
              (parseInt(data?.attributes?.price) -
                parseInt(data?.attributes?.discountedPrice)),
            cartActualPrice:
              parseInt(user?.cartActualPrice?.toString() || "0") -
              parseInt(data?.attributes?.discountedPrice),
            cartTotalPrice:
              parseInt(user?.cartTotalPrice?.toString() || "0") -
              parseInt(data?.attributes?.price),
            cart: filterCart,
          };
          return payload;
        }
      }
    },
    [user]
  );

  const getProductDetail = useCallback(async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}?populate=*`);
      if (res.status === 200) {
        const response = await res.json();
        return response?.data;
      }
    } catch (err) {
      return {};
    } finally {
    }
  }, []);

  const updateCart = useCallback(
    async (productid: number) => {
      if (user != null) {
        const productObject = await getProductDetail(productid);
        if (Object.keys(productObject).length > 0) {
          try {
            productObject.quantity = 1;
            const result = getPayload(productObject);
            const requestOptions = {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(result),
            };
            const res = await fetch(
              `${BASE_URL}/users/${user?.id}`,
              requestOptions
            );
            if (res.status === 200) {
              // const response = await res.json();
              if (token) await fetchLoggedInUser(token);
            }
          } catch (err) {
          } finally {
            setLoading(false);
          }
        }
      }
    },
    [user, getProductDetail, getPayload, token, fetchLoggedInUser]
  );

  const updateProductCart = useCallback(
    async (data: Cart, removeProduct: boolean, operationType: string) => {
      setCartDetailLoading(true);
      // const result = getUpdateCartPayload(productid,removeProduct,productQuantity);
      if (user != null) {
        try {
          const result = getUpdateCartPayload(
            data,
            removeProduct,
            operationType
          );
          console.log("result", result);
          const requestOptions = {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
          };
          const res = await fetch(
            `${BASE_URL}/users/${user?.id}`,
            requestOptions
          );
          if (res.status === 200) {
            // const response = await res.json();
            if (token) await fetchLoggedInUser(token);
          }
        } catch (err) {
        } finally {
          setCartDetailLoading(false);
        }
      }
    },
    [user, getUpdateCartPayload, token, fetchLoggedInUser]
  );

  const handleQuantityChange = useCallback(
    async (data: Cart, removeProduct: boolean, operationType: string) => {
      await updateProductCart(data, removeProduct, operationType);
    },
    [updateProductCart]
  );

  const emptyCart = useCallback(async () => {
    if (token) {
      try {
        const payload = {
          discountPrice: null,
          cartActualPrice: null,
          cartTotalPrice: null,
          cart: null,
        };
        const userid = await fetchLoggedInUser(token);
        const requestOptions = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        };
        await fetch(`${BASE_URL}/users/${userid}`, requestOptions);
        // if (res.status === 200) {
        //   if (token) await fetchLoggedInUser(token);
        // }
      } catch (err) {}
    }
  }, [token, fetchLoggedInUser]);

  return useMemo(
    () => ({
      updateCart,
      handleQuantityChange,
      cartdetailloading,
      loading,
      emptyCart,
    }),
    [updateCart, handleQuantityChange, cartdetailloading, loading, emptyCart]
  );
};
