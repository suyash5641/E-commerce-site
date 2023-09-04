import { Button, Stack, Typography } from "@mui/material"
import { pagenotfound } from "../../../assets"
import { useNavigate } from "react-router-dom"

export const PageNotFound=()=>{
    const navigate = useNavigate();
    return <>
    <Stack alignItems={"center"} gap={"18px"}>
     <img src={pagenotfound} className="pagenotfound"/>
     <Typography>Page Not found</Typography>
     <Button onClick={()=>{navigate('/')}} variant="contained" color="primary">Go to Home</Button>
    </Stack>
    </>
}