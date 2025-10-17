// src/pages/Home/TasksTableWidget.tsx
import * as React from "react";
import {
  Card, CardContent, Box, Typography, Stack, Chip, Button, Divider, alpha
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";

const TEAL = "#66C9CC";

type Row = {
  id: string;
  customer: string;
  createdAt: string;
  dueAt: string;
  amount: number;
  sent: number;
  status: "Paid" | "Pending" | "Overdue" | "Draft";
};

const rows: Row[] = [
  { id: "INV-19919", customer: "Amiah Pruitt", createdAt: "2025-09-09 21:33", dueAt: "2025-11-02 16:33", amount: 2331.63, sent: 9, status: "Paid" },
  { id: "INV-19918", customer: "Ariana Lang", createdAt: "2025-09-10 21:33", dueAt: "2025-11-01 15:33", amount: 2372.93, sent: 4, status: "Overdue" },
  { id: "INV-19917", customer: "Lawson Bass", createdAt: "2025-09-11 21:33", dueAt: "2025-10-31 14:33", amount: 2283.97, sent: 9, status: "Paid" },
  { id: "INV-19916", customer: "Jaslyn Hansen", createdAt: "2025-09-12 21:33", dueAt: "2025-10-25 13:33", amount: 1620.50, sent: 2, status: "Pending" },
  { id: "INV-19915", customer: "Gordon Hart", createdAt: "2025-09-13 21:33", dueAt: "2025-10-21 12:33", amount: 945.00, sent: 1, status: "Draft" },
];

const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

const statusChip = (s: Row["status"]) => {
  switch (s) {
    case "Paid":
      return <Chip label="Paid" size="small" sx={{ bgcolor: (t) => alpha(t.palette.success.main, 0.15) }} />;
    case "Pending":
      return <Chip label="Pending" size="small" sx={{ bgcolor: (t) => alpha(t.palette.info.main, 0.15) }} />;
    case "Overdue":
      return <Chip label="Overdue" size="small" color="error" variant="outlined" />;
    default:
      return <Chip label="Draft" size="small" sx={{ bgcolor: (t) => alpha(t.palette.grey[500], 0.15) }} />;
  }
};

const columns: GridColDef<Row>[] = [
  { field: "customer", headerName: "Customer", flex: 1, minWidth: 160 },
  { field: "createdAt", headerName: "Create", width: 160 },
  { field: "dueAt", headerName: "Due", width: 160 },
  {
    field: "amount",
    headerName: "Amount",
    width: 140,
    valueFormatter: ({ value }) => currency(value as number),
  },
  { field: "sent", headerName: "Sent", width: 90, align: "center", headerAlign: "center" },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (params) => statusChip(params.value as Row["status"]),
    sortable: false,
  },
  { field: "id", headerName: "Invoice #", width: 140 },
];

export default function TasksTableWidget() {
  const [filter, setFilter] = React.useState<"All" | Row["status"]>("All");

  const filtered = React.useMemo(
    () => (filter === "All" ? rows : rows.filter((r) => r.status === filter)),
    [filter]
  );

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 3,
        border: `1px solid ${TEAL}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Invoices</Typography>
            <Typography variant="body2" color="text.secondary">Table preview (dummy data)</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            {(["All", "Paid", "Pending", "Overdue", "Draft"] as const).map((k) => (
              <Chip
                key={k}
                label={k}
                variant={filter === k ? "filled" : "outlined"}
                onClick={() => setFilter(k)}
                sx={{
                  ...(filter === k
                    ? { bgcolor: TEAL, color: "white", borderColor: TEAL }
                    : { borderColor: TEAL }),
                }}
              />
            ))}
          </Stack>
        </Stack>
      </CardContent>

      <Divider />

      {/* Scrollable table area */}
      <Box sx={{ flex: 1, minHeight: 0, p: 1.5 }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
            sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
          }}

          slotProps={{
            toolbar: { quickFilterProps: { debounceMs: 250 }, showQuickFilter: true },
          }}
          sx={{
            borderRadius: 2,
            borderColor: TEAL,
            "& .MuiDataGrid-columnHeaders": {
              position: "sticky",
              top: 0,
              zIndex: 1,
              bgcolor: "background.paper",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
          }}
        />
      </Box>
    </Card>
  );
}
