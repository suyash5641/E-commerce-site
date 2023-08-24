import { Filter } from "../../components/Filter"
import { FilterList } from "../../components/FilterList"
import { Header } from "../../components/Header"
import { Navbar } from "../../components/Navbar"
import { ProductList } from "../../components/ProductList"

export const Home=()=>{
    return(
        <>
        {/* <Header/> */}
        <Filter/>
        <Navbar path="productlist" productTitle=""/>
        <FilterList/>
        <ProductList/>
        </>
    )
}