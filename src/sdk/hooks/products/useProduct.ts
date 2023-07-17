import { useCallback ,useMemo, useState} from "react"
import { IProductLists } from "../../../shared/interfaces/interface";

export const useProduct=()=>{

    const [productList,setProductList]=useState<IProductLists[]>();
    const [loading,setLoading]=useState<Boolean>(false);

    const getProduct=useCallback(async(filters:any)=>{
    try
    {
        const queryParams = new URLSearchParams(filters)
        setLoading(true);
        const res= await fetch(`http://localhost:1337/api/products?${queryParams}`);
        if (res.status === 200) {
            const response = await res.json()
            setProductList(response?.data)
        }
    }
    catch(err){

    }
    finally{
        setLoading(false);
    }

    },[])

    return useMemo(
        () => ({
           getProduct,
           productList,
           loading,
        }),
        [
            getProduct,
            productList,
            loading
        ]
    )
}