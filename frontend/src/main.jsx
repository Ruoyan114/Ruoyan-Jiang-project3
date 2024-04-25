import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './index.css'
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import Password from './Password/index.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/sign-up',
    element: <SignUp />
  },
  {
    path: '/password',
    element: <Password />
  },
])



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router } />
    <ToastContainer />
  </React.StrictMode>,
)
