

import {useState} from 'react';

import Auth from '../utils/auth';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import Login from './Login';
import Signup from './Signup';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const Navigator = () => {

        const [open, setOpen] = useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);

        const token = Auth.getToken();


        // function submit a form...
      
        return (
          <div>
            <Button onClick={handleOpen}>{ token ? 'Wecome in!': "Login/Signup" }</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>

                { token ? (
                  <div>
                    <div>Signout button..</div>
                    <button onClick={() => {
                      Auth.removeToken();
                      window.location.href = '/';
                    }}>Logout</button>
                  </div>
                ) : null }

                { !token ? (
                  <div>
                    <Login />
                    <Signup />
                  </div>
                ) : null }
           

          




              </Box>
            </Modal>
          </div>
        );

};




export default Navigator;