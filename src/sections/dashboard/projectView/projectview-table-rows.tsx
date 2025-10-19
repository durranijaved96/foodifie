/* eslint-disable @typescript-eslint/no-unused-vars */
import { format } from "date-fns";
// @mui
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
import { IInvoice } from "../../../types.ts/invoice";
import { useBoolean } from "../../../hooks/use-boolean";
import usePopover from "../../../components/custom-popover/use-popover";
import Label from "../../../components/label/label";
import Iconify from "../../../components/iconify/Iconify";
import CustomPopover from "../../../components/custom-popover/custom-popover";
import styled from "@emotion/styled";
import i18n from "../../../i18n";
import { t } from "i18next";
import CloseIcon from "@mui/icons-material/Close";
import { Dialog, DialogActions, DialogContent, DialogTitle, Box } from "@mui/material";
import { useState } from "react";

// ----------------------------------------------------------------------

const StyledTableCell = styled(TableCell)({
  // Add any additional styling for TableCell if needed
});

const StyledImageContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
}));

const StyledAvatar = styled("div")(({ theme }) => ({
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

  const statustranslationkey = `dashboard.projectlist.table-row.label-status-${status
    .toLowerCase()
    .split(" ")
    .join("-")}`;
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const confirm = useBoolean();
  const popover = usePopover();

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleOpenDetailsDialog = () => {
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
  };

  return (
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
                onClick={handleOpenDetailsDialog}
                sx={{ color: "text.disabled", cursor: "pointer" }}
              >
                {i18n.t("dashboard.projectlist.table-row.link-project-details")}
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

      {/* Project Details Modal */}
      <Dialog 
        open={isDetailsDialogOpen} 
        onClose={handleCloseDetailsDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          pb: 2 
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {t("dashboard.dialog-details-title") || "Project Details"}
          </Typography>
          <IconButton
            onClick={handleCloseDetailsDialog}
            sx={{
              color: "#000",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Project Name */}
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {t("dashboard.dialog-details-name") || "Project Name"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                {name}
              </Typography>
            </Box>

            {/* Client */}
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {t("dashboard.dialog-details-client") || "Client"}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {client}
              </Typography>
            </Box>

            {/* Status */}
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                {t("dashboard.dialog-details-status") || "Status"}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
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
                    `projectlist.table-row.label-status-${status
                      .toLowerCase()
                      .replace(/ /g, "-")}`
                  )}
                </Label>
              </Box>
            </Box>

            {/* Created Date */}
            {created_at && (
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  {t("dashboard.dialog-details-created") || "Created"}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {format(new Date(created_at), "dd MMM yyyy 'at' p")}
                </Typography>
              </Box>
            )}

            {/* Last Updated */}
            {updated_at && (
              <Box>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  {t("dashboard.dialog-details-updated") || "Last Updated"}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {format(new Date(updated_at), "dd MMM yyyy 'at' p")}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseDetailsDialog}
            variant="contained"
            sx={{
              backgroundColor: "#00A5AA",
              color: "white",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": {
                backgroundColor: "#32B7BB",
              },
            }}
          >
            {t("dashboard.dialog-details-btn-close") || "Close"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirm.value} onClose={confirm.onFalse}>
        <IconButton
          onClick={confirm.onFalse}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#000",
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

          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              paddingBottom: "16px",
              paddingRight: "16px",
              paddingLeft: "16px",
            }}
          >
            <Button
              onClick={handleCloseDeleteDialog}
              size="small"
              type="submit"
              variant="outlined"
              sx={{
                fontFamily: "Public Sans, sans-serif",
                fontSize: "15px",
                fontStyle: "normal",
                fontWeight: 700,
                borderRadius: 2,
                borderColor: "black",
                color: "black",
                textTransform: "none",
                width: "auto",
                padding: "8px 16px",
                "&:hover": {
                  backgroundColor: "transparent",
                  borderColor: "black",
                  color: "black",
                },
                boxShadow: "none",
              }}
            >
              {t("dashboard.dialog-delete-btn-cancel")}
            </Button>

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
                padding: "8px 32px",
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