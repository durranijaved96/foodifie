import * as React from "react";
import { Card, CardContent, Typography, Box, Stack, Button, TextField } from "@mui/material";

export function NotesWidget() {
  const [text, setText] = React.useState<string>(() => localStorage.getItem("notesWidget") || "");
  React.useEffect(() => {
    localStorage.setItem("notesWidget", text);
  }, [text]);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column"}}>
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 400 }}>Notes</Typography>
        <TextField
          placeholder="Add your notes here..."
          multiline
          minRows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
        />
      </CardContent>
    </Card>
  );
}

export function TasksWidget() {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="subtitle1">My Tasks</Typography>
        <Typography variant="body2" color="text.secondary">Sample content — plug your data here.</Typography>
        <Stack mt={1} spacing={1}>
          <Box sx={{ p: 1, borderRadius: 1, bgcolor: "action.hover" }}>• Fix layout jitter in dashboard</Box>
          <Box sx={{ p: 1, borderRadius: 1, bgcolor: "action.hover" }}>• Add Joyride tour toggle</Box>
          <Box sx={{ p: 1, borderRadius: 1, bgcolor: "action.hover" }}>• Refactor KPI formula Popper</Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function NewsWidget() {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>News</Typography>
        <Typography variant="body2" color="text.secondary">Your customizable news widget.</Typography>
        <Stack mt={1} spacing={0.5}>
          <Button variant="text" size="small">Open News Settings</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function ChartWidget() {
  // Placeholder; plug your chart library here.
  return (
    <Card sx={{
        height: 100,
        borderRadius: 2,
        
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
     }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Status Overview</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Replace with your Pie/Bar chart.
        </Typography>
      </CardContent>
    </Card>
  );
}
