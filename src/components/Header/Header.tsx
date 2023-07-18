import { Box, Button } from "@mui/material"
import styles from "./header.module.scss"
import { Outlet } from "react-router-dom"

export const Header=()=>{
    return(
        <>
        <Box className={styles.header}>
        <p>Header</p>
        </Box>
        <Outlet/>
        </>
    )
}