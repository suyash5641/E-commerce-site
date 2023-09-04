import { useCallback, useEffect, useMemo, useState } from "react";

import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../../context/AuthContext/AuthProvider";
import { BASE_URL } from "../../../utils/constant/constant";
export const useStripe = () => {
  const token = localStorage.getItem("authToken");
  const { user } = useAuth();
  const handlePayment = useCallback(async () => {
    try {
      const stripePromise = loadStripe(
        "pk_test_51NZCukSEFvyokD6c4VjZ43S6AOQuCKGdHtQBwVZrg6fbCbstRL3LxuspjkhqwgYS9dBmA6p0FmDJshWnzsMAjkVs00k7Ic4tCK"
      );
      const stripe = await stripePromise;
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: user?.cart,
        }),
      };
      const res = await fetch(
        `${BASE_URL}/orders`,
        requestOptions
      );
      const data = await res.json();
      await stripe?.redirectToCheckout({
        sessionId: data?.stripeSession.id,
      });
    } catch (err) {
      console.log(err);
    }
  },[token,user]);

  return useMemo(
    () => ({
      handlePayment
    }),
    [
     handlePayment
    ]
  );
};
