import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/components/Footer';



import WatchList from './WatchList';

const ShowGraph = () => {
  
    console.log('wada');
  
   return(
    <>
       <Helmet>
            <title>Crypto</title>
       </Helmet>
       <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
        <Grid item xs={12}>
            <WatchList />
          </Grid>
        </Grid>
      </Container>
      <Footer />
      {/* <h2>gfhjfnjdgdgdjk</h2> */}
      
    </>
   );
}
export default ShowGraph;