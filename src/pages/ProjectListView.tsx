/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback, useEffect } from "react";
// @mui
import { useTheme, alpha, styled } from "@mui/material/styles";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
import {
  IInvoice,
  IInvoiceTableFilterValue,
  IInvoiceTableFilters,
} from "../types.ts/invoice";
import { useSettingsContext } from "../components/settings/context/settings-context";
//import { useRouter } from "../hooks/use-router";
import i18n from "../i18n";
import useTable from "../components/table/use-table";
import { emptyRows, getComparator } from "../components/table/util";
import { useBoolean } from "../hooks/use-boolean";
import { INVOICE_SERVICE_OPTIONS } from "../mock/_invoice";
import { paths } from "../routes/paths";
import CustomBreadcrumbs from "../components/custom-breadcrumbs/custom-breadcrumbs";
import Iconify from "../components/iconify/Iconify";
import Label from "../components/label/label";
import InvoiceTableToolbar from "../sections/dashboard/projectView/projectview-table-toolbar";
import InvoiceTableFiltersResult from "../sections/dashboard/projectView/projectview-table-filters";
import TableSelectedAction from "../components/table/table-selected-action";
import TableHeadCustom from "../components/table/table-head-custom";
import InvoiceTableRow from "../sections/dashboard/projectView/projectview-table-rows";
import TableNoData from "../components/table/table-no-data";
import TableEmptyRows from "../components/table/table-empty-rows";
import TablePaginationCustom from "../components/table/table-pagination-custom";
import ConfirmDialog from "../components/custom-dialog/custom-dialog";
import { fTimestamp } from "../utils/format-time";
import { supabase } from "../supabase";
import { useTranslation } from "react-i18next";

import loadingAnimation from "../../src/assets/gifs/Loading.gif";
import jwt from "jsonwebtoken";
import { t } from "i18next";

import { TFunction } from "i18next";
//import Chatbot from "../sections/chatgpt/chatbot";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  {
    id: "name",
    label: "dashboard.project-name",
  },
  { id: "client", label: "dashboard.client" },
  {
    id: "created_at",
    label: "dashboard.created-at",
  },
  {
    id: "last_updated",
    label: "dashboard.updated-at",
  },
  { id: "status", label: "dashboard.status" },
];
const BouncyButton = styled(Button)(({ theme }) => ({
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.05)",
    backgroundColor: "rgba(0, 165, 170, 0.2)", // Add the hover background color
    border: "2px solid rgba(0, 165, 170, 0.5)", // Change the border color on hover
  },
}));

const defaultFilters: IInvoiceTableFilters = {
  name: "",
  service: [],
  status: "all",
  startDate: null,
  endDate: null,
  created_at: null,
  user_id: "",
  client: "",
  updated_at: null,
  id: "",
};

// ----------------------------------------------------------------------

export default function InvoiceListView() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  const settings = useSettingsContext();
  const table = useTable({ defaultOrderBy: "createDate" });

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IInvoice[]>([]);

  useEffect(() => {
    const fetchSupabaseData = async () => {
      try {
        if (!supabase) {
          console.error("Supabase client is not available.");
          return;
        }

        const { data, error } = await supabase.auth.getUser();

        if (error || !data || !data.user || !data.user.id) {
          console.error("Error fetching user from Supabase:", error);
          console.error("User is not authenticated or does not have an ID");
          return;
        }

        const { data: projectData, error: fetchError } = await supabase
          .from("Project")
          .select("*")
          .eq("user_id", data.user.id);

        if (fetchError) {
          console.error("Error fetching data from Supabase:", fetchError);
          return;
        }

        if (projectData) {
          setTableData(projectData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Unexpected error during data fetching:", error);
        setIsLoading(false);
      }
    };

    if (isLoading) {
      fetchSupabaseData();
    }
  }, [tableData, isLoading]);

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    !!filters.service.length ||
    filters.status !== "all" ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const getInvoiceLength = (status: string | null) =>
    status
      ? tableData.filter((item) => item.status === status).length
      : tableData.length;

  const TABS = [
    {
      value: "all",
      label: t("dashboard.projectlist.tabs.all"),
      color: "default",
      count: tableData.length,
    },
    {
      value: "Done",
      label: t("dashboard.projectlist.tabs.done"),
      color: "success",
      count: getInvoiceLength("Done"),
    },
    {
      value: "In Progress",
      label: t("dashboard.projectlist.tabs.in-progress"),
      color: "info",
      count: getInvoiceLength("In Progress"),
    },
    {
      value: "Draft",
      label: t("dashboard.projectlist.tabs.draft"),
      color: "warning",
      count: getInvoiceLength("Draft"),
    },
  ] as const;

  const handleCreateProject = useCallback(async () => {
    try {
      // Check if supabase is available
      if (!supabase) {
        console.error("Supabase client is not available.");
        return;
      }

      // Fetch user data from Supabase
      const { data, error } = await supabase.auth.getUser();

      if (error || !data || !data.user || !data.user.id) {
        console.error("Error fetching user from Supabase:", error);
        console.error("User is not authenticated or does not have an ID");
        return;
      }

      // Your secret key for signing the token
      const secretKey = "x5usha342Fe23g32";

      // Payload for the token
      const tokenPayload = {
        user_id: data.user.id,
        project_id: "empty", // Replace with the actual project_id
      };

      // Sign the token using your secret key
      const authToken = jwt.sign(tokenPayload, secretKey, {
        expiresIn: 604800, // Expires in 7 days
      });

      // Your create URL with the token as a query parameter
      const createUrl = ` https://project.com/?token=${authToken}`;

      // Open the createUrl in a new tab
      window.open(createUrl, "_blank");
    } catch (error) {
      console.error("Unexpected error during token generation:", error);
    }
  }, []);
  const handleFilters = useCallback(
    (name: string, value: IInvoiceTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );
  const handleDeleteRow = useCallback(
    async (id: string) => {
      try {
        // Check if supabase is available
        if (!supabase) {
          console.error("Supabase client is not available.");
          return;
        }

        const selectedRow = tableData.find((row) => row.id === id);

        if (selectedRow) {
          const { user_id, id } = selectedRow;

          // Make the delete request to Supabase
          const { error } = await supabase
            .from("Project")
            .delete()
            .eq("user_id", user_id)
            .eq("id", id);

          if (error) {
            console.error("Error deleting project from Supabase:", error);
            return;
          }

          // If successful, update the client-side state
          const updatedTableData = tableData.filter((row) => row.id !== id);
          setTableData(updatedTableData);

          // Update the page after deleting a row
          table.onUpdatePageDeleteRow(dataInPage.length);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    },
    [dataInPage.length, table, tableData, setTableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.id)
    );
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    async (id: string) => {
      try {
        const selectedRow = tableData.find((row) => row.id === id);

        if (selectedRow) {
          const { user_id, id: project_id } = selectedRow;

          // Your secret key for signing the token
          const secretKey = "x5usha342Fe23g32";

          // Payload for the token
          const tokenPayload = {
            user_id,
            project_id,
          };

          // Sign the token using your secret key
          const authToken = jwt.sign(tokenPayload, secretKey, {
            expiresIn: 604800, // Expires in 7 days
          });

          // Your edit URL with the token as a query parameter
          const editUrl = `https://?token=${authToken}`;

          // Redirect the user to the editUrl
          window.open(editUrl, "_blank");
        }
      } catch (error) {
        console.error("Unexpected error during project edit:", error);
      }
    },
    [tableData]
  );

  const handleViewRow = useCallback(
    async (id: string) => {
      try {
        const selectedRow = tableData.find((row) => row.id === id);

        if (selectedRow) {
          const { user_id, id: project_id } = selectedRow;

          // Your secret key for signing the token
          const secretKey = "x5usha342Fe23g32";

          // Payload for the token
          const tokenPayload = {
            user_id,
            project_id,
          };
          // Sign the token using your secret key
          const authToken = jwt.sign(tokenPayload, secretKey, {
            expiresIn: 604800, // Expires in 7 days
          });
          // Your view URL with the token as a query parameter
          const viewUrl = ` https://project.com/?token=${authToken}`;
          // Open the viewUrl in a new tab
          window.open(viewUrl, "_blank");
        }
      } catch (error) {
        console.error("Unexpected error during project view:", error);
      }
    },
    [tableData]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);
  const allStatus = "all";

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      if (newValue === allStatus) {
        // If "All" tab is selected, reset filters
        handleResetFilters();
      } else {
        handleFilters("status", newValue === allStatus ? null : newValue);
      }
    },
    [handleFilters, handleResetFilters]
  );
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          sx={{
            color: "var(--Text-Primary, #212B36)",
            fontFamily: "Public Sans, sans-serif",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "36px",
            mb: { xs: 3, md: 5 },
          }}
          heading={t("dashboard.title")}
          links={[
            {
              name: "App",
              href: paths.dashboard.root,
            },
            {
              name: t("dashboard.title"),
              href: paths.dashboard.root,
            },
            {
              name: t("dashboard.nav-title"),
            },
          ]}
          action={
            <BouncyButton
              variant="outlined"
              onClick={handleCreateProject}
              style={{
                borderRadius: 12,
                color: "#00A5AA",
             borderColor: "rgba(0, 165, 170, 0.5)", // Initial border color
                width: "100%",
                textTransform: "none",
                boxShadow: "none", // Remove the shadow
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#32B7BB !important", // Hover state color
                },
                "&:active, &:focus": {
                  backgroundColor: "#008B8F !important", // Pressed state color
                },
                textTransform: "none",
              }}
            >
              {t("dashboard.btn-project-create")}
            </BouncyButton>
          }
        />

        <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        ></Card>

        <Card
          sx={{
            mb: { xs: 3, md: 5 },
            borderRadius: 3,
            border: "0.5px solid rgba(0, 0, 0, 0.1)", // Add a border to make edges more visible
          }}
        >
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              mb: { xs: 3, md: 5 },
              "& .MuiTab-root": {
                textTransform: "capitalize",
                flexDirection: "row",
                alignItems: "center",
                fontFamily: "Public Sans, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
              },
              "& .Mui-selected": {
                color: "var(--Text-Primary, #212B36)", // Selected tab text color
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "var(--Text-Primary, #212B36)", // Tab indicator color
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                icon={
                  <Label
                    variant={
                      ((tab.value === "all" || tab.value === filters.status) &&
                        "filled") ||
                      "soft"
                    }
                    color={tab.color}
                  >
                    {tab.count}
                  </Label>
                }
                sx={{
                  textTransform: "capitalize",
                  fontFamily: "Public Sans, sans-serif",
                  // Applying styles to the selected tab
                  "&.Mui-selected": {
                    color: "var(--Text-Primary, black)", // Color when selected
                  },
                  "&.MuiTabs-indicator": {
                    backgroundColor: "var(--Text-Primary, #212B36)", // Indicator color when tab is active
                  },
                }}
              />
            ))}
          </Tabs>

          <InvoiceTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            dateError={dateError}
            serviceOptions={INVOICE_SERVICE_OPTIONS.map(
              (option) => option.name
            )}
          />

          {canReset && (
            <InvoiceTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Stack direction="row">
                  <Tooltip title="Sent">
                    <IconButton color="primary">
                      <Iconify icon="iconamoon:send-fill" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Print">
                    <IconButton color="primary">
                      <Iconify icon="solar:printer-minimalistic-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="primary" onClick={confirm.onTrue}>
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              }
            />

            {/* Wrap the Table directly without Scrollbar */}
            {isLoading || (dataFiltered.length === 0 && !notFound) ? (
              <div style={{ textAlign: "center", marginTop: "50px" }}>
                <img src={loadingAnimation} alt="Loading" />
                <p>Loading project data...</p>
              </div>
            ) : (
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 800 }}
              >
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD.map((item) => ({
                    ...item,
                    label: t(item.label), // Translate each label dynamically
                  }))}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <InvoiceTableRow
                        key={row.id}
                        row={row}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}
                  {dataFiltered.length === 0 && !notFound && (
                    <div style={{ textAlign: "center", marginTop: "50px" }}>
                      <img src={loadingAnimation} alt="Loading" />
                      <p>Loading project data...</p>
                    </div>
                  )}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      tableData.length
                    )}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            )}
          </TableContainer>

          {/*<TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
                    /> */}
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete{" "}
            <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
      {/* <Chatbot />*/}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IInvoice[];
  comparator: (a: any, b: any) => number;
  filters: IInvoiceTableFilters;
  dateError: boolean;
}) {
  const { status, client, startDate, endDate, name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (status !== "all") {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (invoice) =>
          fTimestamp(invoice.created_at) >= fTimestamp(startDate) &&
          fTimestamp(invoice.updated_at) <= fTimestamp(endDate)
      );
    }
  }

  if (client) {
    inputData = inputData.filter((invoice) =>
      invoice.client.toLowerCase().includes(client.toLowerCase())
    );
  }

  if (name) {
    // check if search term matches with project or client name, case insensitive
    inputData = inputData.filter((invoice) =>
      invoice.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return inputData;
}
