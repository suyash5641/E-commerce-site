import { useCallback, useEffect, useMemo, useState } from "react";
import { IProductLists, ICategory } from "../../../shared/interfaces/interface";
import { useProduct } from "../products/useProduct";
import { useAuth } from "../../context/AuthContext/AuthProvider";
import { ProductCard } from "../../../shared/components/ProductCard";
// interface updateCart {
//   productid: number,removeProduct:boolean,productQuantity?:number
// }

export const useCart = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [cartdetailloading, setCartDetailLoading] = useState<Boolean>(false);
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem("authToken");
  const [productDetail, setProductDetail] = useState<IProductLists>();
  const { user, fetchLoggedInUser } = useAuth();

  const getPayload = useCallback(
    (productObject: any) => {
      if (user?.cart === null) {
        return [productObject];
      } else {
        const res = user?.cart;
        res?.push(productObject);
        return res;
      }
    },
    [user?.cart]
  );

  const getUpdateCartPayload = useCallback(
    (productid: number,removeProduct:boolean,productQuantity:number) => {
      if(removeProduct){
        const filterCart = user?.cart?.filter(
          (item) => item.id != productid
        );
        console.log(filterCart,"test")

        return filterCart;
      }
      else{
        const cartIndexToUpdate = user?.cart?.findIndex((item) => item.id === productid);
        const filterCart = user?.cart;
        if (filterCart != undefined && cartIndexToUpdate !== undefined && cartIndexToUpdate >= 0) {
          filterCart[cartIndexToUpdate].quantity = productQuantity;
        }
        
        // const filterCart = user?.cart?.find(
        //   (item) => item.id === productid
        // );
        // if (filterCart) {
        //   filterCart.quantity = productQuantity;
        // } 
        console.log(filterCart,"testnbbbug",)
        return filterCart;
      }
    },
    [user?.cart]
  );

  const getProductDetail = useCallback(async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:1337/api/products/${id}?populate=*`
      );
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
      console.log(user, "cc");
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
              body: JSON.stringify({ cart: result }),
            };
            const res = await fetch(
              `http://localhost:1337/api/users/${user?.id}`,
              requestOptions
            );
            if (res.status === 200) {
              const response = await res.json();
              if (token) await fetchLoggedInUser(token);
            }
          } catch (err) {
          } finally {
            setLoading(false);
          }
        }
      }
    },
    [user, fetchLoggedInUser, getProductDetail, getPayload]
  );

  const updateProductCart = useCallback(
    async (productid: number,removeProduct:boolean,productQuantity:number) => {
      setCartDetailLoading(true);
      // const result = getUpdateCartPayload(productid,removeProduct,productQuantity);
      if (user != null) {
          try {
            const result = getUpdateCartPayload(productid,removeProduct,productQuantity);
            const requestOptions = {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ cart: result }),
            };
            const res = await fetch(
              `http://localhost:1337/api/users/${user?.id}`,
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
    [user, fetchLoggedInUser, setCartDetailLoading,getUpdateCartPayload]
  );

  const handleQuantityChange = useCallback(async(productid : number,removeProduct:boolean,productQuantity:number) => {
    await updateProductCart(productid,removeProduct,productQuantity)
   
  }, [updateProductCart]);

  return useMemo(
    () => ({
      updateCart,
      handleQuantityChange,
      cartdetailloading,
      loading,
    }),
    [updateCart, handleQuantityChange, cartdetailloading, loading]
  );
};
