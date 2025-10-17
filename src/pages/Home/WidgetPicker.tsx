import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,

  Grid,
  Card,
  CardActionArea,
  CardContent,

  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
} from "@mui/material";
import Close from "@mui/icons-material/Close";
import SortOutlined from "@mui/icons-material/SortOutlined"; // notes
import LockOutlined from "@mui/icons-material/LockOutlined";

import AssignmentTurnedInOutlined from "@mui/icons-material/AssignmentTurnedInOutlined"; // tasks

import InsertChartOutlined from "@mui/icons-material/InsertChartOutlined"; // chart
import type { WidgetDef, WidgetId } from "./types";

// Ensure that 'subscriptions' is included in the WidgetId type

type Props = {
  open: boolean;
  onClose: () => void;
  catalog: WidgetDef[];
  selected: WidgetId[];
  onToggle: (id: WidgetId) => void; // used for ADD
  onRemove?: (id: WidgetId) => void; // optional explicit REMOVE (falls back to onToggle)
};

const WIDGET_ICONS: Record<WidgetId, React.ReactNode> = {
    notes: <SortOutlined fontSize="large" />,
    tasks: <AssignmentTurnedInOutlined fontSize="large" />,
    subscriptions: <InsertChartOutlined fontSize="large" />, // Ensure 'subscriptions' is defined in WidgetId
    chart: <InsertChartOutlined fontSize="large" />,
    project: <InsertChartOutlined fontSize="large" />,
    news: undefined
};


export function WidgetPicker({
  open,
  onClose,
  catalog,
  selected,
  onToggle,
  onRemove,
}: Props) {
  const remove = onRemove ?? onToggle;

  const handlePick = (id: WidgetId) => {
    if (selected.includes(id)) return; // already added → ignore
    onToggle(id); // add once
    onClose(); // close after single pick (same UX you wanted)
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          Select widgets
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {/* Quick manage: remove already-added widgets */}
        {selected.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
            {selected.map((id) => {
              const name = catalog.find((c) => c.id === id)?.name ?? id;
              return (
                <Chip
                  key={id}
                  label={name}
                  onDelete={() => remove(id)}
                  variant="outlined"
                  className="no-drag"
                />
              );
            })}
          </Stack>
        )}

        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {catalog.map((w) => {
            const isSelected = selected.includes(w.id);
            return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={w.id}>
                <Card
                  variant="outlined"
                  sx={{
                    position: "relative",
                    borderRadius: 3,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    opacity: isSelected ? 0.55 : 1,          // dim when selected
                    filter: isSelected ? "grayscale(0.2)" : "none",
                    transition: "opacity .2s ease, filter .2s ease",
                  }}
                >
                  <CardActionArea
                    className="no-drag"
                    disabled={isSelected}                      // disable click
                    onClick={() => handlePick(w.id)}
                    sx={{
                      height: "100%",
                      pointerEvents: isSelected ? "none" : "auto",
                      borderRadius: 2,
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 0.5,
                        p: 0,
                        textAlign: "center",
                        position: "relative",
                        px: 1,
                        py: 1,
                      }}
                    >
                      <Box>{WIDGET_ICONS[w.id]}</Box>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {w.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
              
                  {/* Top-right lock when selected */}
                  {isSelected && (
                    <Box
                      aria-hidden
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "background.paper",
                        color: "text.disabled",
                        boxShadow: 1,
                      }}
                    >
                      <LockOutlined fontSize="small" />
                    </Box>
                  )}
                </Card>
              </Grid>
              
            );
          })}
        </Grid>
      </DialogContent>

      
    </Dialog>
  );
}
