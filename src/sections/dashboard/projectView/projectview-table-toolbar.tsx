import React, { useEffect } from "react";
//import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "../../../components/iconify/Iconify";
import {
  IInvoiceTableFilters,
  IInvoiceTableFilterValue,
} from "../../../types.ts/invoice";
import { supabase } from "../../../supabase";
import i18n from "../../../i18n";

type Props = {
  filters: IInvoiceTableFilters;
  onFilters: (name: string, value: IInvoiceTableFilterValue) => void;
  dateError: boolean;
  serviceOptions: string[];
};

export default function InvoiceTableToolbar({
  filters,
  onFilters,
  dateError,
  serviceOptions,
}: Props) {
  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilters("name", event.target.value);
  };

  // Handle start date change
  /* const handleFilterStartDate = (newValue: Date | null) => {
    onFilters("created_at", newValue);
  };

  // Handle end date change
  const handleFilterEndDate = (newValue: Date | null) => {
    onFilters("updated_at", newValue);
  };
  */

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (supabase) {
          const query = supabase
            .from("Project")
            .select("*")
            .eq("name", filters.name)
            .eq("user_id", filters.user_id)
            .eq("id", filters.id);

          if (filters.created_at !== null) {
            const startDate = filters.created_at.toISOString();
            const endDate = filters.updated_at?.toISOString();

            if (endDate) {
              // Apply range filter for date range
              query
                .gte("created_at", new Date(startDate))
                .lte("updated_at", new Date(endDate));
            } else {
              // Apply equality filter for a single date
              query.eq("created_at", new Date(startDate));
              query.eq("updated_at", new Date(startDate));
            }
          }

          const { data, error } = await query;

          if (error) {
            console.error("Error fetching data from Supabase:", error);
            return;
          }

          if (data) {
            console.log("Filtered data:", data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filters]);

  return (
    <Stack
      spacing={1}
      alignItems={{ xs: "flex-end", md: "center" }}
      direction={{
        xs: "column",
        md: "row",
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      {/* TextField for name filter */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        flexGrow={1}
        sx={{ maxwidth: 250 }}
      >
        <TextField
          fullWidth
          value={filters.name}
          onChange={handleFilterName}
          placeholder={i18n.t("dashboard.projectlist.search-bar.hint")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#212B36", // Your desired color when focused
              },
              "&:hover fieldset": {
                borderColor: "#212B36", // Hover color
              },
            },
          }}
        />
      </Stack>
    </Stack>
  );
}
