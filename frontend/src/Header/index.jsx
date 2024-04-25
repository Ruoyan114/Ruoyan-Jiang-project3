import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate, Link } from 'react-router-dom';
import WidgetsIcon from '@mui/icons-material/Widgets';
import axios from 'axios';
import { Avatar, IconButton, MenuItem, Tooltip, Typography, Menu, Modal, TextField } from '@mui/material';
import { toast } from 'react-toastify';

const settings = ['Logout'];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function Header() {
  const navigate = useNavigate();
  const [activeUsername, setActiveUsername] = useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [shareUsername, setShareUsername] = React.useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  async function checkIfUserIsLoggedIn() {
    const response = await axios.get('/api/users/isLoggedIn')

    setActiveUsername(response.data.username)
  }

  useEffect(() => {
    checkIfUserIsLoggedIn()
  }, []);

  async function logOutUser() {
    await axios.post('/api/users/logOut')
    setActiveUsername(null)
    navigate('/login')
    toast.success("Logout successful!")
  }

  const confirmShare = async () => {
    if (!shareUsername) {
      toast.warning("You should enter the username.")
      return
    }

    const response = await axios.get('/api/users/' + shareUsername)
    if (response.data) {
      try {
        const response = await axios.post('/api/share', {to: shareUsername})
        toast.success("Share successful!");
        handleClose();
      } catch (e) {
        toast.error(e.response.data)
      }
    } else {
      toast.warning("Username does not exist.")
    }
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link to="/"><WidgetsIcon sx={{ display: 'flex', mr: 1, color: "white" }} /></Link>

          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            {
              activeUsername && (
                <Button
                  onClick={handleOpen}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  Share password
                </Button>
              )
            }
            <Modal
              open={open}
              onClose={handleClose}
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                  Share Password
                </Typography>
                <TextField fullWidth label="Username" variant="outlined" value={shareUsername} onChange={e => setShareUsername(e.target.value)} />
                <Box mt={2}>
                  <Button style={{marginRight: 10}} variant="outlined" onClick={() => handleClose()}>Cancel</Button>
                  <Button variant="contained" onClick={() => confirmShare()}>Confirm</Button>
                </Box>
              </Box>
            </Modal>
          </Box>

          {
            activeUsername && (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={activeUsername[0].toUpperCase()} src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={logOutUser}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )
          }
          {
            !activeUsername && (
              <Box sx={{ flexGrow: 0, display: 'flex', gap: 2 }}>
                <Button variant="contained" onClick={() => navigate('/login')}>Log In</Button>
                <Button variant="contained" onClick={() => navigate('/sign-up')}>Sign Up</Button>
              </Box>
            )
          }
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
