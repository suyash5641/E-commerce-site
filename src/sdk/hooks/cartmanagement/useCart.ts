import { useCallback, useEffect, useMemo, useState } from "react";
import { IProductLists, ICategory } from "../../../shared/interfaces/interface";
import { useProduct } from "../products/useProduct";
import { useAuth } from "../../context/AuthContext/AuthProvider";

export const useCart = () => {
  const [loading, setLoading] = useState<Boolean>(false);
  const token = localStorage.getItem("authToken");
  const [productDetail, setProductDetail] = useState<IProductLists>();
  const {user,fetchLoggedInUser} = useAuth();
  
  const getPayload = useCallback((productObject :any)=>{
    if(user?.cart === null){
       return [productObject];
    }
    else{
       const res = user?.cart;
       res?.push(productObject);
       return res;
    }

  },[user?.cart])

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


  const updateCart = useCallback(async (productid: number) => {
    console.log(user ,"cc")
    if(user !=null)
    {
    const productObject = await getProductDetail(productid);
    if (Object.keys(productObject ).length > 0) {
      try {
        productObject.quantity =1;
        const result = getPayload(productObject);
        const requestOptions = {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart: result}),
        };
        const res = await fetch(
          `http://localhost:1337/api/users/${user?.id}`,
          requestOptions
        );
        if (res.status === 200) {
          const response = await res.json();
          if(token)
          await fetchLoggedInUser(token)
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    }
  }, [user,fetchLoggedInUser,getProductDetail,getPayload]);


  return useMemo(
    () => ({
      updateCart,
      loading,
    }),
    [loading, updateCart]
  );
};
