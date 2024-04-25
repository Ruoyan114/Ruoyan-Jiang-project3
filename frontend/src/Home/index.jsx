import { Box } from '@mui/material';
import Header from '../Header/index.jsx';
import HomeImage from '../assets/home.jpg';

function Home() {
  return (
    <Box>
      <Header />
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={5}>
        <h1>Welcome to password manager app</h1>
        <p>Author: Ruoyan Jiang</p>
        <img src={HomeImage} width="800px" />
      </Box>
    </Box>
  )
}

export default Home
