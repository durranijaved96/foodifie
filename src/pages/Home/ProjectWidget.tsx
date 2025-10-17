import React from 'react';
import Stack from '@mui/material/Stack';

import InvoiceListView from '../ProjectListView';

const ProjectWidget: React.FC = () => {
 

   return (
    <Stack sx={{ height: '100%', minHeight: 0, overflowY: 'auto' }}>
    <InvoiceListView />
  </Stack>
   );
};

export default ProjectWidget;
