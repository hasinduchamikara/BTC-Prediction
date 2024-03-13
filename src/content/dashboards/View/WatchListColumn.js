import {
  Button,
  Card,
  CardActions,
  Box,
  Typography,
  Avatar,
  Grid,
  alpha,
  useTheme,
  styled
} from '@mui/material';
import { addMinutes, setSeconds, addDays, format, isSameHour , setMinutes} from 'date-fns'
// import Label from 'src/components/Label';
// import Text from 'src/components/Text';
import Chart from 'react-apexcharts';
 import ViewButton from './ViewButton';
// import ViewModal from './ViewModal';
import axios from 'axios';
import { useState, useEffect } from 'react';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(0, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${theme.palette.mode === 'dark'
      ? theme.colors.alpha.trueWhite[30]
      : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`
);

function WatchListColumn() {
  const theme = useTheme();

  const [data, setData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [allTimes, setAllTimes] = useState([]);

  const[showTable, setShowTable] = useState(false);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart',
          {
            params: {
              vs_currency: 'usd',
              days: 1, // Fetch data for the last 24 hours
            },
          }
        );
        const prices = response.data.prices;
        console.log("Coin Prices: ", prices);

        // Extract data and timestamps
        const [timestamps, priceData] = formatLiveData(prices.map((entry) => entry[1].toFixed(3)), prices.map((entry) => entry[0]));
        const allTimes = getAllTimes(timestamps[0]);
        
        // console.log('test');
        // console.log(getAllTimes(timestamps[0])[0]);

        const predictedResponse = await axios.get(
          'http://34.138.112.70:5000/api/predict',
          {
            params: {
              start: format( allTimes[0], 'yyyy-MM-dd hh:mm'),
              end: format( allTimes[allTimes.length - 1], 'yyyy-MM-dd hh:mm'),
            },
          }
        );

           console.log(format( allTimes[0], 'yyyy-MM-dd hh:mm'));
          //  console.log(format( allTimes[allTimes.length - 1], 'yyyy-MM-dd hh:mm'));
          // console.log(getAllTimes(timestamps[0])-[24]);

        setAllTimes(allTimes.map((time) => format( new Date(time), 'MM-dd hh:mm aa')));
        setTimestamps(timestamps.map((time) => format(time, 'MM-dd hh:mm aa')));
        setData(priceData);
        setPredictedData(predictedResponse.data.data.predicted_prices);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchData();
  }, []);

  const ViewTable = () => {
    setShowTable(!showTable);
  }

  const chartOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      zoom: {
        enabled: false
      }
    },
    fill: {
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [0, 100]
      }
    },
    colors: [theme.colors.primary.main, theme.colors.secondary.main],
    dataLabels: {
      enabled: false
    },
    theme: {
      mode: theme.palette.mode
    },
    stroke: {
      show: true,
      colors: [theme.colors.primary.main, theme.colors.secondary.main],
      width: 3
    },
    legend: {
      show: false
    },
    xaxis: {
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false,
      tickAmount: 5
    },
    tooltip: {
      x: {
        show: true
      },
      y: {
        title: {
          formatter() {
            return 'Price: $';
          }
        }
      },
      marker: {
        show: false
      }
    }
  };

  const formatLiveData = (priceData, timestamps) => {
    const dateObjects = timestamps.map((time) => new Date(time));
    const finalPriceData = [];
    const finalTimeStamps = [];
    let prevHour = null;

    dateObjects.forEach((date, index) => {
      if (!prevHour || !isSameHour(date, prevHour)) {
        finalPriceData.push(priceData[index]);
        finalTimeStamps.push(date);
        prevHour = date;
      }
    });

    return [finalTimeStamps, finalPriceData]
  }


  const getAllTimes = (startTime) => {
    const start = setMinutes(startTime, 0);
    let currentTimePointer = addDays(start, 1);
    const timeArray = [];
    while (currentTimePointer <= addDays(start, 2)) {
      currentTimePointer = setSeconds(currentTimePointer, 0);
      timeArray.push(currentTimePointer);
      currentTimePointer = addMinutes(currentTimePointer, 60);
    }

    return timeArray;
  }


  console.log(timestamps);

  return (
    <Card>
    <Grid
      container
      direction="row"
      justifyContent="left"
      alignItems="stretch"
      spacing={8}
    >
      <Grid item md={6} xs={12}>
        <Card
          sx={{
            overflow: 'visible'
          }}
        >
          <Box
            sx={{
              p: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper>
                <img
                  alt="BTC"
                  src="/static/images/placeholders/logo/bitcoin.png"
                />
              </AvatarWrapper>
              <Box>
                <Typography variant="h4" noWrap>
                  Bitcoin
                </Typography>
                <Typography variant="subtitle1" noWrap>
                  BTC
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pt: 3
              }}
            >
              {/* <Typography
                variant="h2"
                sx={{
                  pr: 1,
                  mb: 1
                }}
              >
                $56,475.99
              </Typography>
              <Text color="success">
                <b>+12.5%</b>
              </Text> */}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              {/* <Label color="success">+$500</Label> */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  pl: 1
                }}
              >
                Present 24h
              </Typography>
            </Box>
          </Box>
          <Chart
            options={{
              ...chartOptions,
              labels:timestamps
            }}
            series={[ {
              name: 'Actual Bitcoin Price',
              data: data
            }]}
            type="area"
            height={200}
          />
        </Card>
      </Grid>
      <Grid item md={6} xs={12}>
        <Card
          sx={{
            overflow: 'visible'
          }}
        >
          <Box
            sx={{
              p: 3
            }}
          >
            <Box display="flex" alignItems="center">
              <AvatarWrapper>
                <img
                  alt="BTC"
                  src="/static/images/placeholders/logo/bitcoin.png"
                />
              </AvatarWrapper>
              <Box>
                <Typography variant="h4" noWrap>
                  Bitcoin
                </Typography>
                <Typography variant="subtitle1" noWrap>
                  BTC
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pt: 3
              }}
            >
              {/* <Typography
                variant="h2"
                sx={{
                  pr: 1,
                  mb: 1
                }}
              >
                $56,475.99
              </Typography>
              <Text color="success">
                <b>+12.5%</b>
              </Text> */}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              {/* <Label color="success">+$500</Label> */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  pl: 1
                }}
              >
                Predicted 24h
              </Typography>
            </Box>
          </Box>
          <Chart
            options={{
              ...chartOptions,
              labels:allTimes
            }}
            series={[ {
              name: 'Predicted Bitcoin Price',
              data: predictedData
            }]}
            type="area"
            height={200}
          />
        </Card>
      </Grid>
      
    </Grid>
    <CardActions
        disableSpacing
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button variant="outlined" onClick={ViewTable}>View more</Button>
       
        {/* <ViewModal/> */}
      </CardActions>
      <div>
        {showTable && <ViewButton/>}
        </div>
    </Card>
  );
}

export default WatchListColumn;
