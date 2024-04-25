import styles from "./SignUp.module.css";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography
} from "@mui/material";
import {Link} from "react-router-dom";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import Header from '../Header/index.jsx';
import axios from 'axios';

function SignUp() {
  const [user, setUser] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleUserInfoChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const signup = async () => {
    if (!user.username) {
      toast.warning("You should enter the username.")
      return;
    }
    if (!user.password) {
      toast.warning("You should enter the password.")
      return;
    }
    if (user.password !== user.confirmPassword) {
      toast.warning("Password and confirmation password do not match.")
      return;
    }
    if (user.username && user.password && user.confirmPassword) {
      try {
        const response = await axios.post('/api/users/register', {username: user.username, password: user.password})
        toast.success("Sign up successful!");
        navigate('/password')
      } catch (error) {
        console.log(error)
        toast.error(error.response.data)
      }
    }
  }

  return <div className={styles.container}>
    <Box position="absolute" left={0} top={0} width="100%">
      <Header />
    </Box>
    <Card sx={{ minWidth: 350 }}>
      <CardContent>
        <Typography fontSize={30} fontWeight="bold" align="center">SignUp</Typography>
        <Box mt={2}>
          <TextField id="username" label="Username" variant="outlined" sx={{width: "100%"}} value={user.username} name="username" onChange={handleUserInfoChange} />
        </Box>
        <Box mt={2}>
          <TextField id="password" label="Password" variant="outlined" type="password" sx={{width: "100%"}} value={user.password} name="password" onChange={handleUserInfoChange} />
        </Box>
        <Box mt={2}>
          <TextField id="confirmPassword" label="Confirm Password" variant="outlined" type="password" sx={{width: "100%"}} value={user.confirmPassword} name="confirmPassword" onChange={handleUserInfoChange} />
        </Box>
        <Box mt={2}>
          <Button id="signUp" variant="contained" sx={{width: "100%"}} onClick={signup}>Sign Up</Button>
        </Box>
        <Box mt={2}>
          Have an account? <Link to="/login">Log in</Link>
        </Box>
      </CardContent>
    </Card>
  </div>
}

export default SignUp;
