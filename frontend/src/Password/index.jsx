import { Alert, Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, TextField } from '@mui/material';
import Header from '../Header/index.jsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const key = "myKey";

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const numerals = '0123456789'
const symbols = '!@#$%^&*()_+{}|[]\\\\:\\";\'<>?,./'

function encryptPassword(password, key) {
  let encryptedPassword = "";
  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    encryptedPassword += String.fromCharCode(charCode);
  }
  return encryptedPassword;
}

function decryptPassword(encryptedPassword, key) {
  let decryptedPassword = "";
  for (let i = 0; i < encryptedPassword.length; i++) {
    const charCode = encryptedPassword.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    decryptedPassword += String.fromCharCode(charCode);
  }
  return decryptedPassword;
}

function generatePassword(length, minSymbolCount, minNumeralCount) {
  let charset = alphabet;
  let password = "";

  // Calculate the additional characters required to meet the minimum counts
  const additionalSymbols = Math.max(0, minSymbolCount - symbols.length);
  const additionalNumerals = Math.max(0, minNumeralCount - numerals.length);

  // Add symbols to the charset based on minSymbolCount
  for (let i = 0; i < minSymbolCount; i++) {
    charset += symbols;
  }

  // Add numerals to the charset based on minNumeralCount
  for (let i = 0; i < minNumeralCount; i++) {
    charset += numerals;
  }

  // Add additional symbols and numerals to meet the minimum counts
  for (let i = 0; i < additionalSymbols; i++) {
    charset += symbols;
  }

  for (let i = 0; i < additionalNumerals; i++) {
    charset += numerals;
  }

  // Generate the password
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

function Password() {
  const [url, setUrl] = useState("")
  const [password, setPassword] = useState("")
  const [passwords, setPasswords] = useState([])
  const [shares, setShares] = useState([])
  const [checkOptions, setCheckOptions] = useState({ alphabet: false, numerals: false, symbols:false })
  const [length, setLength] = useState("")
  const [activeUsername, setActiveUsername] = useState(null)
  const [searchText, setSearchText] = useState("")
  const [confirmSearchText, setConfirmSearchText] = useState("")

  useEffect(() => {
    getAllPasswords();
    getAllShares();
    checkIfUserIsLoggedIn();
  }, [])

  async function checkIfUserIsLoggedIn() {
    const response = await axios.get('/api/users/isLoggedIn')

    setActiveUsername(response.data.username)
  }

  const getAllPasswords = async () => {
    try {
      const response = await axios.get('/api/password')
      setPasswords(response.data);
    } catch (e) {
      toast.error(e.response.data)
    }
  }

  const getAllShares = async () => {
    try {
      const response = await axios.get('/api/share')
      setShares(response.data);
    } catch (e) {
      toast.error(e.response.data)
    }
  }

  const createPassword = async () => {
    if (!url) {
      toast.warning("You should enter the url.")
      return;
    }
    if (!(password || ((checkOptions.alphabet || checkOptions.numerals || checkOptions.symbols) && length))) {
      toast.warning("You should enter the password or use random strategy.")
      return;
    }
    if (Number(length) > 50 || Number(length) < 4) {
      toast.warning("The length must be between 4 and 50.")
      return;
    }

    let addPassword = password
    if (!addPassword) {
      addPassword = generatePassword(Number(length), checkOptions.symbols ? 1 : 0, checkOptions.numerals ? 1 : 0);
    }

    if (url && addPassword) {
      try {
        const response = await axios.post('/api/password', {url: url, password: encryptPassword(addPassword, key)})
        toast.success("Create successful!");
        setUrl("")
        setPassword("")
        setLength("")
        setCheckOptions({ alphabet: false, numerals: false, symbols:false })
        getAllPasswords();
      } catch (e) {
        toast.error(e.response.data)
      }
    }
  }

  const handleCheckOption = (name, checked) => {
    setCheckOptions({
      ...checkOptions,
      [name]: checked
    })
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete('/api/password/' + id)
      toast.success("Delete successful!");
      getAllPasswords();
    } catch (e) {
      toast.error(e.response.data)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await axios.put('/api/share/' + id, {status})
      toast.success("Update successful!");
      getAllShares();
      getAllPasswords();
    } catch (e) {
      toast.error(e.response.data)
    }
  }

  return (
    <Box>
      <Header />
      <Box p={5}>
        {
          shares.map(share => (
            <Box key={share._id} mb={2}>
              <Alert severity="info" sx={{alignItems: 'center'}}>
                You have received a share password from {share.from}, do you accept it?.
                <IconButton color="success" onClick={() => handleUpdateStatus(share._id, 1)}>
                  <CheckIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleUpdateStatus(share._id, 2)}>
                  <CloseIcon />
                </IconButton>
              </Alert>
            </Box>
          ))
        }
        <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
          <TextField size="small" label="URL" variant="outlined" value={url} onChange={e => setUrl(e.target.value)} />
          <TextField size="small" label="Password" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} />
          <FormGroup sx={{display: 'flex', flexDirection: 'row'}}>
            <FormControlLabel control={<Checkbox checked={checkOptions.alphabet} onChange={e => handleCheckOption('alphabet', e.target.checked)} />} label="alphabet" />
            <FormControlLabel control={<Checkbox checked={checkOptions.numerals} onChange={e => handleCheckOption('numerals', e.target.checked)} />} label="numerals" />
            <FormControlLabel control={<Checkbox checked={checkOptions.symbols} onChange={e => handleCheckOption('symbols', e.target.checked)} />} label="symbols" />
          </FormGroup>
          <TextField sx={{width: 100}} size="small" label="Length" variant="outlined" value={length} onChange={e => setLength(e.target.value)} />
          <Button variant="contained" onClick={createPassword}>Submit</Button>
        </Box>
        <Box display="flex" flexWrap="wrap" gap={1}  mt={2}>
          <TextField size="small" label="Search" variant="outlined" value={searchText} onChange={e => setSearchText(e.target.value)} />
          <Button variant="contained" onClick={() => setConfirmSearchText(searchText)}>Search</Button>
        </Box>
        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>URL</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {passwords.filter(item => !confirmSearchText || (item.url.toLowerCase().indexOf(confirmSearchText.toLowerCase()) >=0 || decryptPassword(item.password, key).toLowerCase().indexOf(confirmSearchText.toLowerCase()) >=0)).map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{row.url}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <span>{row.visible ? decryptPassword(row.password, key) : Array(10).fill('*')}</span>
                        <IconButton size="small" sx={{marginLeft: 1}} onClick={() => {
                          row.visible = !row.visible
                          setPasswords([...passwords])
                        }}>
                          {
                            row.visible ? <VisibilityOffIcon fontSize="10px" /> : <VisibilityIcon fontSize="10px" />
                          }
                        </IconButton>
                        <IconButton size="small" sx={{marginLeft: 1}} onClick={() => navigator.clipboard.writeText(row.password)}>
                          <ContentCopyIcon fontSize="10px" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{new Date(row.updatedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      {
                        row.username === activeUsername && (
                          <Button variant="contained" onClick={() => handleDelete(row._id)}>Delete</Button>
                        )
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  )
}

export default Password
