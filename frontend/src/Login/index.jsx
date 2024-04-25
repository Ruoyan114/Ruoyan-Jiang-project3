import styles from "./Login.module.css";
import {Box, Button, Card, CardContent, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useState} from "react";
import Header from '../Header/index.jsx';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username) {
      toast.warning("You should enter the username.")
      return;
    }
    if (!password) {
      toast.warning("You should enter the password.")
      return;
    }
    if (username && password) {
      try {
        const response = await axios.post('/api/users/login', {username: username, password: password})
        toast.success("Login successful!");
        navigate('/password');
      } catch (e) {
        toast.error(e.response.data)
      }
    }
  }

  return <div className={styles.container}>
    <Box position="absolute" left={0} top={0} width="100%">
      <Header />
    </Box>
    <Card sx={{ minWidth: 350 }}>
      <CardContent>
        <Typography fontSize={30} fontWeight="bold" align="center">Login</Typography>
        <Box mt={2}>
          <TextField id="username" label="Username" variant="outlined" sx={{width: "100%"}} value={username} onChange={e => setUsername(e.target.value)} />
        </Box>
        <Box mt={2}>
          <TextField id="password" label="Password" variant="outlined" type="password" sx={{width: "100%"}}  value={password} onChange={e => setPassword(e.target.value)} />
        </Box>
        <Box mt={2}>
          <Button id="login" variant="contained" sx={{width: "100%"}} onClick={handleLogin}>Login</Button>
        </Box>
        <Box mt={2}>
          Don&apos;t have an account? <Link to="/sign-up">Sign up</Link>
        </Box>
      </CardContent>
    </Card>
  </div>
}

export default Login;
