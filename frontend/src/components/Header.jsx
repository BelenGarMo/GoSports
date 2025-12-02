import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Avatar,
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate("/");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Calendario', path: '/calendario' },
    { label: 'Resultados', path: '/resultados' },
    { label: 'Inscripciones', path: '/inscripciones' }
  ];

  const MobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250, pt: 2 }}>
        <Box sx={{ px: 2, pb: 2 }}>
          <DirectionsRunIcon sx={{ fontSize: 40, color: '#667eea' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
            GO! SPORTS
          </Typography>
        </Box>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                selected={isActive(item.path)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          {usuario && (
            <>
              <Divider sx={{ my: 1 }} />
              {usuario.perfil === "organizador" && (
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/organizador"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ListItemText primary="Panel Organizador" />
                  </ListItemButton>
                </ListItem>
              )}
              {usuario.perfil === "cronometrista" && (
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    to="/cronometrista"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ListItemText primary="Panel Cronometrista" />
                  </ListItemButton>
                </ListItem>
              )}
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Cerrar sesión" />
                </ListItemButton>
              </ListItem>
            </>
          )}
          {!usuario && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/registro"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="Registrarse" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemText primary="Iniciar sesión" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderBottom: '3px solid #667eea'
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              textDecoration: "none",
              gap: 1
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              <DirectionsRunIcon />
            </Avatar>
            {!isMobile && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                GO! SPORTS
              </Typography>
            )}
          </Box>

          {/* Menú Desktop */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive(item.path) ? '#667eea' : '#333',
                    fontWeight: isActive(item.path) ? 600 : 400,
                    borderBottom: isActive(item.path) ? '2px solid #667eea' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      borderBottom: '2px solid #667eea'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {!usuario ? (
                <>
                  <Button
                    component={Link}
                    to="/registro"
                    sx={{
                      color: '#667eea',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.1)'
                      }
                    }}
                  >
                    Registrarse
                  </Button>
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      color: 'white',
                      fontWeight: 600,
                      px: 3,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)'
                      }
                    }}
                  >
                    Iniciar sesión
                  </Button>
                </>
              ) : (
                <>
                  {usuario.perfil === "organizador" && (
                    <Button
                      component={Link}
                      to="/organizador"
                      sx={{
                        color: '#667eea',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.1)'
                        }
                      }}
                    >
                      Panel Org.
                    </Button>
                  )}
                  {usuario.perfil === "cronometrista" && (
                    <Button
                      component={Link}
                      to="/cronometrista"
                      sx={{
                        color: '#667eea',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.1)'
                        }
                      }}
                    >
                      Panel Crono.
                    </Button>
                  )}
                  <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                    <Avatar sx={{ bgcolor: '#667eea', width: 36, height: 36 }}>
                      <AccountCircleIcon />
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {usuario.nombre} {usuario.apellido}
                      </Typography>
                    </MenuItem>
                    <MenuItem disabled>
                      <Typography variant="caption" color="text.secondary">
                        {usuario.perfil}
                      </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                      Cerrar sesión
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}

          {/* Menú Mobile */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={{ color: '#667eea' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <MobileMenu />
    </>
  );
};

export default Header;