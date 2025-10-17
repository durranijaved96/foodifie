import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useMockedUser } from '../hooks/use-mocked-user';
import AppWelcome from '../sections/dashboard/app/AppWelcome';
import AppNewInvoice from '../sections/dashboard/app/AppNewTable';
import { _appInvoices } from '../mock/_overview';
import { LoadingButton } from '@mui/lab';
import { useSettingsContext } from '../components/settings/context/settings-context';

export default function OverviewAppView() {
  const { user } = useMockedUser();
  const settings = useSettingsContext();

  // Define the URL of the Streamlit app
  const streamlitAppUrl = '';
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtbmJyc2Vuc2NsZWtxaXB1YmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk2NjY0NzAsImV4cCI6MjAwNTI0MjQ3MH0.Zie-feJ4a2U_t19fxmqrzSVpMkp54u2fKBGyg2oHWYA'; // Replace 'your_api_key_here' with your actual API key
  
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
  };
  
  fetch(streamlitAppUrl, {
    method: 'GET',
    headers: headers,
  })
    .then((response) => {
      // Handle the response from the Streamlit app
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  // Function to open the Streamlit app in a new window
  const openStreamlitApp = () => {
    window.open(streamlitAppUrl, '_blank');
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            description="Nice to have you back!"
            action={
              <LoadingButton
                style={{ borderRadius: 8, backgroundColor: '#00A5AA', color: 'white' }}
                onClick={openStreamlitApp} // Call the function to open the Streamlit app
              >
                Show my projects
              </LoadingButton>
            }
          />
    </Grid><br />
        <Grid md={12}>
          <AppNewInvoice
            title="My Projects"
            tableData={_appInvoices}
            tableLabels={[
              { id: 'id', label: 'Project Name' },
              { id: 'status', label: 'Status' },
              { id: 'client', label: 'Client' },
              { id: 'last update', label: 'Last Update' },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
