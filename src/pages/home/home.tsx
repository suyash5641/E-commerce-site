import { Filter } from "../../components/Filter"
import { FilterList } from "../../components/FilterList"
import { Header } from "../../components/Header"
import { ProductList } from "../../components/ProductList"

export const Home=()=>{
    return(
        <>
        {/* <Header/> */}
        <Filter/>
        <FilterList/>
        <ProductList/>
        </>
    )
}