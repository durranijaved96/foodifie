/* eslint-disable @typescript-eslint/no-unused-vars */
import { format } from "date-fns";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import { useState } from "react";

import { IInvoice } from "../../../types.ts/invoice";
import { useBoolean } from "../../../hooks/use-boolean";
import usePopover from "../../../components/custom-popover/use-popover";
import Label from "../../../components/label/label";
import Iconify from "../../../components/iconify/Iconify";
import CustomPopover from "../../../components/custom-popover/custom-popover";

// ----------------------------------------------------------------------

const StyledTableCell = styled(TableCell)({});

const StyledImageContainer = styled("div")(() => ({
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
}));

const StyledAvatar = styled("div")(() => ({
  width: 40,
  height: 40,
  flexShrink: 0,
}));

type Props = {
  row: IInvoice;
  onViewRow: VoidFunction;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function InvoiceTableRow({
  row,
  onViewRow,
  onEditRow,
  onDeleteRow,
}: Props) {
  const { created_at, updated_at, client, status, name } = row;

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const confirm = useBoolean();
  const popover = usePopover();

  const handleOpenDetailsDialog = () => setIsDetailsDialogOpen(true);
  const handleCloseDetailsDialog = () => setIsDetailsDialogOpen(false);

  return (
    <>
      <TableRow>
        <StyledTableCell />

        <TableCell sx={{ display: "flex", alignItems: "flex-start" }}>
          <Avatar alt={name} sx={{ mr: 2 }}>
            {name.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            disableTypography
            primary={
              <Typography variant="body2" noWrap>
                {name}
              </Typography>
            }
            secondary={
              <Link
                noWrap
                variant="body2"
                onClick={handleOpenDetailsDialog}
                sx={{ color: "text.disabled", cursor: "pointer" }}
              >
                View project details
              </Link>
            }
          />
        </TableCell>

        <TableCell>{client}</TableCell>

        <TableCell>
          {created_at && (
            <ListItemText
              primary={format(new Date(created_at), "dd MMM yyyy")}
              secondary={format(new Date(created_at), "p")}
              primaryTypographyProps={{ typography: "body2", noWrap: true }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: "span",
                typography: "caption",
              }}
            />
          )}
        </TableCell>

        <TableCell>
          {updated_at && (
            <ListItemText
              primary={format(new Date(updated_at), "dd MMM yyyy")}
              secondary={format(new Date(updated_at), "p")}
              primaryTypographyProps={{ typography: "body2", noWrap: true }}
              secondaryTypographyProps={{
                mt: 0.5,
                component: "span",
                typography: "caption",
              }}
            />
          )}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (status === "Done" && "success") ||
              (status === "In Progress" && "info") ||
              (status === "Draft" && "warning") ||
              "default"
            }
            sx={{ borderRadius: 3 }}
          >
            {status}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton
            color={popover.open ? "inherit" : "default"}
            onClick={popover.onOpen}
            sx={{ borderRadius: 3 }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160, "& .MuiPaper-root": { borderRadius: 3 } }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
          sx={{ borderRadius: 3 }}
        >
          <Iconify icon="solar:pen-bold" /> Edit project
        </MenuItem>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: "error.main", borderRadius: 3 }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete project
        </MenuItem>
      </CustomPopover>

      {/* Project Details Dialog */}
      <Dialog
        open={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E0E0E0",
            py: 2,
            px: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#212B36" }}>
            Project Details
          </Typography>
          <IconButton
            onClick={handleCloseDetailsDialog}
            sx={{
              borderRadius: 2,
              border: "1px solid #E0E0E0",
              backgroundColor: "#F9FAFB",
              "&:hover": {
                backgroundColor: "#F4F6F8",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            py: 3,
            px: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: "#FFF",
            direction: "rtl",
            textAlign: "right",
          }}
        >
          <br />
          {[
            { label: "Project Name", value: name, icon: "mdi:folder-outline" },
            { label: "Client", value: client, icon: "mdi:account-outline" },
            {
              label: "Status",
              value: (
                <Label
                  variant="soft"
                  color={
                    (status === "Done" && "success") ||
                    (status === "In Progress" && "info") ||
                    (status === "Draft" && "warning") ||
                    "default"
                  }
                  sx={{
                    borderRadius: 3,
                    textTransform: "capitalize",
                    direction: "ltr", // keep text left-to-right inside status chip
                  }}
                >
                  {status}
                </Label>
              ),
              icon: "mdi:chart-timeline-variant-shimmer",
            },
            created_at && {
              label: "Created",
              value: format(new Date(created_at), "dd MMM yyyy 'at' p"),
              icon: "mdi:calendar-plus-outline",
            },
            updated_at && {
              label: "Last Updated",
              value: format(new Date(updated_at), "dd MMM yyyy 'at' p"),
              icon: "mdi:update",
            },
          ]
            .filter(Boolean)
            .map((field, idx) => (
              <Box key={idx}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexDirection: "row-reverse", // 👈 flip icon and label order
                  }}
                >
                  <Iconify icon={field.icon as string} width={16} height={16} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#637381",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.3,
                    }}
                  >
                    {field.label}
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    mt: 0.5,
                    fontWeight: 500,
                    direction: "ltr", // 👈 keep value text left-to-right (for dates etc.)
                  }}
                >
                  {field.value}
                </Typography>
              </Box>
            ))}
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: "1px solid #E0E0E0",
            px: 3,
            py: 2.5,
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={handleCloseDetailsDialog}
            variant="contained"
            sx={{
              backgroundColor: "#00A5AA",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#32B7BB",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirm.value}
        onClose={confirm.onFalse}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
            borderBottom: "1px solid #E0E0E0",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#212B36" }}>
            Delete Project
          </Typography>
          <IconButton
            onClick={confirm.onFalse}
            sx={{
              borderRadius: 3,
              border: "1px solid #E0E0E0",
              backgroundColor: "#F9FAFB",
              "&:hover": { backgroundColor: "#F4F6F8" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            p: 4,
            backgroundColor: "#FFF",
          }}
        >
          <Box sx={{ mb: 2 }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M20.0002 3.33337C10.8002 3.33337 3.3335 10.8 3.3335 20C3.3335 29.2 10.8002 36.6667 20.0002 36.6667C29.2002 36.6667 36.6668 29.2 36.6668 20C36.6668 10.8 29.2002 3.33337 20.0002 3.33337ZM21.6668 28.3334H18.3335V25H21.6668V28.3334ZM21.6668 21.6667H18.3335V11.6667H21.6668V21.6667Z"
                fill="#4F536E"
              />
            </svg>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, color: "#212B36" }}>
            Are you sure you want to delete this project?
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#637381",
              mt: 1,
              maxWidth: 360,
              lineHeight: "22px",
            }}
          >
            This action cannot be undone. Deleting this project will remove all
            related data.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #E0E0E0",
            px: 3,
            py: 2.5,
          }}
        >
          <Button
            onClick={confirm.onFalse}
            variant="outlined"
            sx={{
              borderRadius: 3,
              color: "#212B36",
              borderColor: "#212B36",
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              "&:hover": {
                backgroundColor: "#F4F6F8",
                borderColor: "#212B36",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={onDeleteRow}
            variant="contained"
            sx={{
              borderRadius: 3,
              backgroundColor: "#00A5AA",
              color: "#FFF",
              fontWeight: 600,
              textTransform: "none",
              px: 4,
              "&:hover": {
                backgroundColor: "#32B7BB",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
