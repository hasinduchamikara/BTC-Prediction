import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody

} from '@mui/material';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

const ViewButton = () => {
 
  // const [data, setData] = useState([]);
  // const [timestamps, setTimestamps] = useState([]);
  // const [predictedData, setPredictedData] = useState([]);
  // const [allTimes, setAllTimes] = useState([]);

  const [dateTime, setDateTime] = useState();
  const [predictedPrice, setPredictedPrice] = useState();
  const [actualPrice, setActualPrice] = useState();

  useEffect(() =>{
    fetchAllData();
    fetchPredictedData();
  },[]);

const fetchAllData = async () => {
  try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
          {
            params: {
              vs_currency: 'usd',
              days: 1,// Fetch data for the last 24 hours
            },
          }
        );
        let prices = response.data.prices;
        console.log("Prices inside button: ", format(prices[0][0], "hh:mm") + ' - ' + prices[0][1]);
        setActualPrice(prices[0][1]);
  } catch (error) {
    console.log(error);
  }
}

const fetchPredictedData = async () => {
  try {
    const predictedResponse = await axios.get(
      'http://34.138.112.70:5000/api/predict',
      {
        params: {
          start: format( Date.now(), 'yyyy-MM-dd hh:mm'),
          end: format( Date.now(), 'yyyy-MM-dd hh:mm'),
        },
      }
    );
    setDateTime(predictedResponse?.data?.data?.start);
    setPredictedPrice(predictedResponse?.data?.data?.predicted_prices[0]);
  } catch (error) {
    console.log(error);
  }
}

const getAverageDiff = (predicted, actual) => {
  let avg = ((actual - predicted) / predicted) * 100;
  return avg.toFixed(2);
}

  return (
    <div>
      {/* <Button variant='outlined' onClick={View}>View More</Button> */}
      <div>
        <h2>Price Comparison Details Of Actual And Predicted Prices</h2>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Date & Time</TableCell>
                <TableCell align="center">Predicted Price</TableCell>
                <TableCell align="center">Actual Price</TableCell>
                <TableCell align="center">As a Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">{dateTime}</TableCell>
                <TableCell align="center">{parseFloat(predictedPrice).toFixed(2)}</TableCell>
                <TableCell align="center">{parseFloat(actualPrice).toFixed(2)}</TableCell>
                <TableCell align="center" style={{color: getAverageDiff(parseFloat(predictedPrice), parseFloat(actualPrice)) > 0 ? "green" : "red"}}>
                  {
                    getAverageDiff(parseFloat(predictedPrice), parseFloat(actualPrice))
                  } % 
                </TableCell>
              </TableRow>
              {/* {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
export default ViewButton;