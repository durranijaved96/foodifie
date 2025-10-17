import React from 'react';
import Stack from '@mui/material/Stack';
import SubscriptionsPage from '../SubscriptionsPage';

const SubscriptionWidget: React.FC = () => {
  return (
    <Stack sx={{ height: '100%', minHeight: 0, overflowY: 'auto' }}>
      <SubscriptionsPage />
    </Stack>
  );
};
export default SubscriptionWidget;
