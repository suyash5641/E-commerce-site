import { Filter } from "../../components/Filter"
import { Header } from "../../components/Header"
import { ProductList } from "../../components/ProductList"

export const Home=()=>{
    return(
        <>
        {/* <Header/> */}
        <Filter/>
        <ProductList/>
        </>
    )
}