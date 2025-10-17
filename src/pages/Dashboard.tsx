import { Helmet } from "react-helmet-async";
import { Grid, Container } from "@mui/material";
import InvoiceListView from "./ProjectListView";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function DashboardAppPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard | foodifie</title>
      </Helmet>

      <Container maxWidth="xl">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
           <InvoiceListView/>
            </Grid>
          </Grid>
          </LocalizationProvider>
       
      </Container>
    </>
 );
}
