import { IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from "../../sdk/context/AuthContext/AuthProvider";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLElement | null>(null);

    const {signOut}= useAuth();
  
    const handleMenuOpen = (event:React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const handleLogout = async() => {
     await signOut();
    };

    const goToOrder =()=>{
      navigate('/orders');
    }
  
    return (
      <div>
        <IconButton
          aria-label="user-profile"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          color="inherit"
        >
          <AccountCircleIcon/>
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {/* Add any other user profile related options here */}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          <MenuItem onClick={goToOrder}>Orders</MenuItem>
        </Menu>
      </div>
    );
  };
  
  
  