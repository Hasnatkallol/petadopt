import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FirebaseAuthContext } from "../../Firebase/FirebaseAuthContext";
import useAdmin from "../../Hooks/useAdmin";
import Logo from "../../Shared/Logo";
import footerLogo from "../../assets/Footer/logo.png";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  Container,
  Divider,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import PetsIcon from "@mui/icons-material/Pets";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

const Toggle = ({ checked, onChange, size = "medium" }) => {
  const sizes = {
    small: {
      width: 40,
      height: 24,
      ballSize: 16,
      translateX: 16,
    },
    medium: {
      width: 56,
      height: 32,
      ballSize: 24,
      translateX: 24,
    }
  };

  const { width, height, ballSize, translateX } = sizes[size];

  return (
    <label 
      className="relative inline-flex items-center cursor-pointer"
      style={{ 
        width: `${width}px`,
        height: `${height}px`,
        margin: "0 4px"
      }}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`absolute inset-0 rounded-full transition-colors duration-300`}
        style={{ 
          backgroundColor: checked ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
        }}
      />
      <div
        className={`absolute rounded-full shadow-md transition-transform duration-300 bg-white`}
        style={{
          width: `${ballSize}px`,
          height: `${ballSize}px`,
          left: "4px",
          top: "50%",
          transform: checked ? `translateX(${translateX}px) translateY(-50%)` : "translateX(0) translateY(-50%)",
        }}
      />
    </label>
  );
};

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isAdmin] = useAdmin();
  const { user, logOut, theme, toggleTheme } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        handleMenuClose();
        setDrawerOpen(false);
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive 
      ? theme === "dark" ? "#60A5FA" : "#FBAE02"
      : theme === "dark" ? "#CBD5E1" : "#1E293B",
    fontWeight: isActive ? 600 : 500,
    fontSize: "1rem",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  });

  const navLinks = [
    { path: "/", label: "Home", icon: <HomeIcon fontSize="small" /> },
    { path: "/petsListing", label: "Pet Listing", icon: <PetsIcon fontSize="small" /> },
    { path: "/donations", label: "Donation Campaigns", icon: <VolunteerActivismIcon fontSize="small" /> },
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bgcolor: theme === "dark" ? "#0F172A" : "#FFFFFF",
        color: theme === "dark" ? "#F8FAFC" : "#1E293B",
        borderBottom: "1px solid",
        borderColor: theme === "dark" ? "#1E293B" : "#E2E8F0",
        zIndex: 1200,
      }}
    >
      <Container maxWidth={false} sx={{ width: "91.666667%" }}>
        <Toolbar sx={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: { xs: "0.25rem 0", md: "0.5rem 0" },
          gap: { xs: 0, sm: 1 },
          minHeight: "64px !important",
        }}>
          {/* Left side - Menu button and Logo */}
          <Box sx={{ 
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexShrink: 0,
            minWidth: 0,
          }}>
            <IconButton 
              edge="start" 
              color="inherit" 
              onClick={() => setDrawerOpen(true)} 
              sx={{ 
                display: { lg: "none" },
                padding: "8px",
                marginRight: "4px",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
              {theme === "dark" ? (
                <img 
                  src={footerLogo} 
                  alt="Dark Logo" 
                  style={{ height: "40px" }}
                />
              ) : (
                <Logo />
              )}
            </Box>
          </Box>

          {/* Center - Desktop Navigation */}
          <Box 
            sx={{ 
              display: { xs: "none", lg: "flex" }, 
              justifyContent: "center",
              flexGrow: 1,
              gap: 1,
              mx: 2,
            }}
          >
            {navLinks.map((link) => (
              <NavLink 
                key={link.path} 
                to={link.path} 
                style={navLinkStyle}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </Box>

          {/* Right side - Toggle and User/Auth */}
          <Box 
            sx={{ 
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
            }}
          >
            <Toggle 
              checked={theme === "dark"} 
              onChange={toggleTheme}
              size={isMobile ? "small" : "medium"}
            />
            
            {user ? (
              <>
                <Avatar
                  src={user.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
                  onClick={handleMenuOpen}
                  sx={{ 
                    cursor: "pointer", 
                    border: `2px solid ${theme === "dark" ? "#FBAE02" : "#4EA8FF"}`,
                    width: 36,
                    height: 36,
                  }}
                />
                <Menu 
                  anchorEl={anchorEl} 
                  open={open} 
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      bgcolor: theme === "dark" ? "#1E293B" : "#fff",
                      color: theme === "dark" ? "#fff" : "#1E293B",
                      mt: 1,
                      '& .MuiMenuItem-root': {
                        gap: 1.5,
                        '&:hover': {
                          bgcolor: theme === "dark" ? "#334155" : "#F1F5F9"
                        }
                      }
                    }
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate(isAdmin ? "/dashboard/adminProfile" : "/dashboard/myProfile");
                      handleMenuClose();
                    }}
                  >
                    <DashboardIcon fontSize="small" />
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              !drawerOpen && (
                <Button
                  onClick={() => navigate("/login")}
                  variant="contained"
                  startIcon={<LoginIcon />}
                  sx={{ 
                    bgcolor: theme === "dark" ? "#60A5FA" : "#FBAE02",
                    color: theme === "dark" ? "#fff" : "#000",
                    fontWeight: "bold", 
                    '&:hover': {
                      bgcolor: theme === "dark" ? "#3B82F6" : "#e09e00"
                    },
                    whiteSpace: "nowrap",
                    padding: { xs: "6px 8px", sm: "8px 16px" },
                    minWidth: "fit-content",
                  }}
                >
                  {isMobile ? <LoginIcon fontSize="small" /> : "Login"}
                </Button>
              )
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: theme === "dark" ? "#0F172A" : "#fff",
            color: theme === "dark" ? "#F8FAFC" : "#1E293B",
            width: 280
          }
        }}
      >
        <Box sx={{ 
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: "0.5rem",
        }}>
          {/* Header with close button */}
          <Box sx={{ 
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.75rem",
          }}>
            <Box onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
              {theme === "dark" ? (
                <img 
                  src={footerLogo} 
                  alt="Dark Logo" 
                  style={{ height: "40px" }}
                />
              ) : (
                <Logo />
              )}
            </Box>
            <IconButton 
              onClick={() => setDrawerOpen(false)}
              sx={{ 
                padding: "8px",
                color: theme === "dark" ? "#F8FAFC" : "#1E293B"
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ borderColor: theme === "dark" ? "#334155" : "#E2E8F0" }} />

          {/* Navigation Links */}
          <List sx={{ 
            flexGrow: 1, 
            padding: "0.5rem",
            '& .MuiListItem-root': {
              padding: "8px 12px",
              marginBottom: "0px"
            }
          }}>
            {navLinks.map((link) => (
              <ListItem 
                key={link.path} 
                button 
                component={NavLink} 
                to={link.path} 
                onClick={() => setDrawerOpen(false)}
                sx={{
                  borderRadius: "4px",
                  color: theme === "dark" ? "#CBD5E1" : "#1E293B",
                  '&.active': {
                    color: theme === "dark" ? "#60A5FA" : "#FBAE02",
                    '& .MuiListItemIcon-root': {
                      color: theme === "dark" ? "#60A5FA" : "#FBAE02"
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: "inherit",
                  minWidth: "36px"
                }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={link.label} 
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Footer with Auth options */}
          <Box sx={{ padding: "0.75rem", marginTop: "auto" }}>
            {user ? (
              <>
                <ListItem 
                  button 
                  onClick={() => {
                    navigate(isAdmin ? "/dashboard/adminProfile" : "/dashboard/myProfile");
                    setDrawerOpen(false);
                  }}
                  sx={{
                    borderRadius: "4px",
                    color: theme === "dark" ? "#CBD5E1" : "#1E293B",
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: "inherit",
                    minWidth: "36px"
                  }}>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Dashboard" 
                    primaryTypographyProps={{ 
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItem>
               
                <ListItem 
                  button 
                  onClick={handleLogout}
                  sx={{
                    borderRadius: "4px",
                    color: theme === "dark" ? "#CBD5E1" : "#1E293B",
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: "inherit",
                    minWidth: "36px"
                  }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Logout" 
                    primaryTypographyProps={{ 
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItem>
              </>
            ) : (
              <Button
                fullWidth
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={() => {
                  navigate("/login");
                  setDrawerOpen(false);
                }}
                sx={{ 
                  bgcolor: theme === "dark" ? "#60A5FA" : "#FBAE02",
                  color: theme === "dark" ? "#fff" : "#000",
                  fontWeight: "bold", 
                  '&:hover': {
                    bgcolor: theme === "dark" ? "#3B82F6" : "#e09e00"
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;