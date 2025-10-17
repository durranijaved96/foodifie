import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Card, { CardProps } from '@mui/material/Card';
import TableContainer from '@mui/material/TableContainer';
import Scrollbar from '../../../components/scrollbar/Scrollbar';
import TableHeadCustom from '../../../components/table/table-head-custom';
import usePopover from '../../../components/custom-popover/use-popover';
import { fCurrency } from '../../../utils/formatNumber';
import Iconify from '../../../components/iconify/Iconify';
import CustomPopover from '../../../components/custom-popover/custom-popover';

// Define the types for the row and table labels
interface RowProps {
  id: string;
  price: number;
  status: string;
  category: string;
  invoiceNumber: string;
}

interface TableLabels {
  id: string;
  label: string;
}

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableData: RowProps[]; // Prop for table data
  tableLabels: TableLabels[]; // Prop for table labels
}

export default function AppNewInvoice({
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 680 }}>
            <TableHeadCustom headLabel={tableLabels} order={'desc'} orderBy={''} />

            <TableBody>
              {tableData.map((row) => (
                <AppNewInvoiceRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={10} />}
        >
          View All
        </Button>
      </Box>
    </Card>
  );
}

// Define the types for the row prop
interface AppNewInvoiceRowProps {
  row: RowProps;
}

function AppNewInvoiceRow({ row }: AppNewInvoiceRowProps) {
  const popover = usePopover();

  const handleDownload = () => {
    popover.onClose();
    console.info('EDIT', row.id);
  };

  const handleDelete = () => {
    popover.onClose();
    console.info('DELETE', row.id);
  };

  return (
    <>
      <TableRow>
        <TableCell>{row.invoiceNumber}</TableCell>

        <TableCell>{row.category}</TableCell>

        <TableCell>{fCurrency(row.price)}</TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem onClick={handleDownload}>
          <Iconify icon="eva:cloud-download-fill" />
          Edit
        </MenuItem>
        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
