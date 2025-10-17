/* eslint-disable @typescript-eslint/no-unused-vars */
import { format } from "date-fns";
// @mui
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
//import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";
import { IInvoice } from "../../../types.ts/invoice";
import { useBoolean } from "../../../hooks/use-boolean";
import usePopover from "../../../components/custom-popover/use-popover";
import Label from "../../../components/label/label";
import Iconify from "../../../components/iconify/Iconify";
import CustomPopover from "../../../components/custom-popover/custom-popover";
//import ConfirmDialog from "../../../components/custom-dialog/custom-dialog";
import styled from "@emotion/styled";
import i18n from "../../../i18n";
import { t } from "i18next";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { useState } from "react";

// hooks
// ----------------------------------------------------------------------

const StyledTableCell = styled(TableCell)({
  // Add any additional styling for TableCell if needed
});

const StyledImageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  //marginBottom: theme.spacing(4),
}));

const StyledAvatar = styled("div")(({ theme }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
}));
type Props = {
  row: IInvoice; // Assuming IInvoice matches your API response

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

  const statustranslationkey = `dashboard.projectlist.table-row.label-status-${status
    .toLowerCase()
    .split(" ")
    .join("-")}`;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const confirm = useBoolean();

  const popover = usePopover();

  //const handleOpenDialog = () => {
  // setIsDialogOpen(true);
  // };
  // Function to close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <>
        <TableRow>
          <StyledTableCell></StyledTableCell>

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
                 
                  sx={{ color: "text.disabled", cursor: "pointer" }}
                >
                  {i18n.t(
                    "dashboard.projectlist.table-row.link-project-details"
                  )}
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
            >
              {t(
                `dashboard.projectlist.table-row.label-status-${status
                  .toLowerCase()
                  .replace(/ /g, "-")}`
              )}
            </Label>
          </TableCell>
          <TableCell align="right" sx={{ px: 1 }}>
            <IconButton
              color={popover.open ? "inherit" : "default"}
              onClick={popover.onOpen}
            >
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
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" /> {t("dashboard.btn-prtoject-edit")}
          </MenuItem>

          <Divider sx={{ borderStyle: "dashed" }} />

          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            {t("dashboard.btn-project-delete")}
          </MenuItem>
        </CustomPopover>

        {/*<ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}

        sx={{
          color: "var(--Text-Secondary, #637381)",
          fontFamily: "Public Sans, sans-serif",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "22px",
        }}
        title={t("dashboard.dialog-delete-title")}
        content={t("dashboard.dialog-delete-project")}
        action={<Button variant="contained" color="error" onClick={onDeleteRow}>
          {t("dashboard.btn-project-delete")}
        </Button>} /> */}
      </>
      <Dialog open={confirm.value} onClose={confirm.onFalse}>
        <IconButton
          onClick={confirm.onFalse}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#000", // Set the color of the icon
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent
          sx={{
            alignItems: "center",
            gap: "24px",
            padding: "32px 64px",
            borderRadius: "4px",
            border: "1px #E0E0E0",
            background: "var(--primary-contrast, #FFF)",
          }}
        >
          {/* SVG placed on top left */}
          <StyledImageContainer>
            <StyledAvatar>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                style={{ width: "40px", height: "40px", flexShrink: 0 }}
              >
                <path
                  d="M20.0002 3.33337C10.8002 3.33337 3.3335 10.8 3.3335 20C3.3335 29.2 10.8002 36.6667 20.0002 36.6667C29.2002 36.6667 36.6668 29.2 36.6668 20C36.6668 10.8 29.2002 3.33337 20.0002 3.33337ZM21.6668 28.3334H18.3335V25H21.6668V28.3334ZM21.6668 21.6667H18.3335V11.6667H21.6668V21.6667Z"
                  fill="#4F536E"
                />
              </svg>
            </StyledAvatar>
          </StyledImageContainer>

          <Typography
            variant="h4"
            sx={{
              color: "var(--Text-Primary, #212B36)",
              fontFamily: "Public Sans, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "36px",
              alignSelf: "center",
              fontStyle: "normal",
            }}
          >
            {t("dashboard.dialog-delete-title")}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              width: "350px",
              color: "var(--Text-Secondary, #637381)",
              fontFamily: "Public Sans, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "22px",
            }}
          >
            <br />
            {t("dashboard.dialog-delete-project")}{" "}
            <span
              style={{
                color: "var(--secondary-dark, #4F536E)",
                fontFamily: "Public Sans, sans-serif",
                fontSize: 14,
                fontWeight: 600,
                fontStyle: "normal",
              }}
            >
              {t("dashboard.dialog-delete-proceed")}
            </span>
          </Typography>
          <br />

          {/* Dialog actions container */}
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between", // This ensures the buttons are spaced apart
              paddingBottom: "16px", // Optional: Adjust this value for spacing between buttons and bottom of dialog
              paddingRight: "16px", // Optional: Adjust this value for right margin of the buttons
              paddingLeft: "16px", // Optional: Adjust this value for left margin of the buttons
            }}
          >
            {/* Button to cancel the dialog */}
            <Button
              onClick={handleCloseDialog}
              size="small"
              type="submit"
              variant="outlined"
              sx={{
                fontFamily: "Public Sans, sans-serif",
                fontSize: "15px",
                fontStyle: "normal",
                fontWeight: 700,
                borderRadius: 2,
                borderColor: "black", // Black border color
                color: "black", // Black text color
                textTransform: "none",
                width: "auto",
                padding: "8px 16px", // Adjust padding as needed
                "&:hover": {
                  backgroundColor: "transparent",
                  borderColor: "black",
                  color: "black", // Keep the text color black on hover
                },
                boxShadow: "none",
              }}
            >
              {t("dashboard.dialog-delete-btn-cancel")}
            </Button>

            {/* Button to confirm cancellation */}
            <Button
              onClick={onDeleteRow}
              size="small"
              type="submit"
              variant="contained"
              sx={{
                fontFamily: "Public Sans, sans-serif",
                fontSize: "15px",
                fontStyle: "normal",
                fontWeight: 700,
                borderRadius: 2,
                backgroundColor: "#00A5AA",
                color: "white",
                textTransform: "none",
                width: "auto",
                padding: "8px 32px", // Adjust padding as needed
                "&:hover": {
                  backgroundColor: "#32B7BB",
                  color: "white",
                },
                boxShadow: "none",
              }}
            >
              {t("dashboard.dialog-delete-btn-delete")}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
