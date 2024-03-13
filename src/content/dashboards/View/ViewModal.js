import {
    Modal,
    Button
  } from '@mui/material';
import { useState, useEffect } from 'react';
import 'react-date-range/dist/styles';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import axios from 'axios';

  const ViewModal = () => {
    
    const [open, Setopen] = useState(false);

    const [startDate, SetstartDate] = useState(new Date());
    const [endDate, SetendDate] = useState(new Date());
    // const [result, SetResult] = useState([]);

    useEffect(()=> {
        // axios.get('#').then((res) => {
        //     SetResult(res.data);
        // })
    },[])

    const selectRange = () => ({
        startDate: startDate,
        endDate:endDate,
        key:'selection',
    })

    const handleRange = (date) => {
        SetstartDate(date.selection.startDate);
        SetendDate(date.selection.endDate)
    }

    axios.post('#', {startDate, endDate}).then((res) => {
        console.log(res);
        console.log(res.data);
    });

    const handleClose = () => {
        Setopen(false);
    }

    const handleOpen = () => {
        Setopen(true);
    }

    return(
        <div>
            <Button variant= "outlined" onClick={handleOpen}>View More</Button>
            <Modal
                onClose={handleClose}
                open={open}
                style={{
                    position: 'absolute',
                    border: '2px solid #000',
                    backgroundColor: 'white',
                    boxShadow: '2px solid black',
                    height: 80,
                    width: 540,
                    margin: 'auto'
                }}
            >
                <div>
                    <h2 style={{justifyContent: 'center'}}>Details</h2>
                    <DateRangePicker 
                        ranges={[selectRange]}
                        onChange={handleRange}
                    />
                </div>
            </Modal>
        </div>
    );
  }
  export default ViewModal;