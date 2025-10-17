import { Helmet } from "react-helmet-async";
import { Grid, Container, Typography, Stack, Button, styled } from "@mui/material";
import AppSummary from "../sections/dashboard/app/AppSummary";
//import AppUpdate from "../sections/dashboard/app/AppUpdate";
//import { faker } from "@faker-js/faker";
import fleetManagementImage from "../assets/images/icon_fleet.svg";
import chargingInfrastructureImage from "../assets/images/icon_charging.svg";
import Solar from "../assets/images/icon_solar_pv.svg";
import Battery from "../assets/images/icon_stationary_battery.svg";
import OverviewAppView from "./ProjectPage";
import i18n from "../i18n";

// Add the bouncy effect to the button
const BouncyButton = styled(Button)(({ theme }) => ({
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: 'rgba(0, 165, 170, 0.2)', // Add the hover background color
    border: '2px solid rgba(0, 165, 170, 0.5)', // Change the border color on hover
  },
}));

export default function DashboardAppPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard | foodfie</title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
         <Stack spacing={1}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              { i18n.t('dashboard.nav') }
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold">
              Start with a project template
            </Typography>
          </Stack>
          <BouncyButton
            variant="outlined"
            sx={{
              color: "white",
              backgroundColor: "#00A5AA",
              "& .MuiButton-startIcon": {
                marginRight: "0px", // Adjust the spacing here as needed
              },
              textTransform: "none", // Prevent full capitalization of the button title
            }}
          >
            Add Project
          </BouncyButton>
        </Stack>
        <Grid container spacing={3}>
          {/* Custom styles for rounded edges and spacing */}
          <Grid item xs={12} sm={6} md={3}>
            <AppSummary
              title="Fleet"
              subheader="Management"
              image={fleetManagementImage}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppSummary
              title="Charging"
              subheader="Infrastructure"
              image={chargingInfrastructureImage}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppSummary title="Photo" image={Solar} subheader={"voltics"} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppSummary
              title="Stationary"
              image={Battery}
              subheader={"Battery"}
            />
          </Grid>
        </Grid>

        {/* Second Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
          <OverviewAppView/>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
