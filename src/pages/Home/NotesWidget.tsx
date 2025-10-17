import * as React from "react";
import {
  Card, CardContent, Typography, Box, Stack, TextField, Button,
  IconButton, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip
} from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Add from "@mui/icons-material/Add";

type Note = { id: string; title: string; body: string; createdAt: number };

const LS_KEY = "notesWidget.v2";

export function NotesWidget() {
  // --- State & persistence ---
  const [notes, setNotes] = React.useState<Note[]>(() => {
    try {
      // migrate from old single-text value if present
      const legacy = localStorage.getItem("notesWidget");
      const json = localStorage.getItem(LS_KEY);
      if (json) return JSON.parse(json);
      if (legacy && legacy.trim()) {
        const first: Note = {
          id: crypto.randomUUID(),
          title: "Imported note",
          body: legacy,
          createdAt: Date.now(),
        };
        localStorage.removeItem("notesWidget");
        return [first];
      }
    } catch {}
    return [];
  });

  React.useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(notes));
  }, [notes]);

  // --- Form state ---
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");

  // --- Delete confirmation ---
  const [toDelete, setToDelete] = React.useState<Note | "ALL" | null>(null);

  const onAdd = () => {
    if (!title.trim() && !body.trim()) return;
    const note: Note = {
      id: crypto.randomUUID(),
      title: title.trim() || "Untitled",
      body: body.trim(),
      createdAt: Date.now(),
    };
    setNotes((n) => [note, ...n]);
    setTitle("");
    setBody("");
  };

  const onConfirmDelete = () => {
    if (toDelete === "ALL") {
      setNotes([]);
    } else if (toDelete) {
      setNotes((n) => n.filter((x) => x.id !== toDelete.id));
    }
    setToDelete(null);
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header / composer (non-scrolling) */}
      <CardContent sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Notes</Typography>
          {notes.length > 0 && (
            <Button size="small" color="error" onClick={() => setToDelete("ALL")} variant="text">
              Clear all
            </Button>
          )}
        </Stack>

        <Stack spacing={1} sx={{ mt: 1 }}>
          <TextField
            size="small"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quick title"
            fullWidth
          />
          <TextField
            label="Note"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Jot something down…"
            multiline
            minRows={3}
            fullWidth
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onAdd();
            }}
          />
          <Stack direction="row" justifyContent="flex-end">
            <Button
              startIcon={<Add />}
              onClick={onAdd}
              variant="contained"
              sx={{ textTransform: "none", bgcolor: "#00A5AA", "&:hover": { bgcolor: "#008B8F" } }}
            >
              Add note
            </Button>
          </Stack>
        </Stack>
      </CardContent>

      <Divider />

      {/* List area (scrolls internally) */}
      <Box sx={{ p: 1.5, pt: 1, flex: 1, minHeight: 0, overflowY: "auto" }}>
        <Stack spacing={1}>
          {notes.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No notes yet. Add your first note above.
            </Typography>
          )}

          {notes.map((n) => (
            <Box
              key={n.id}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                p: 1,
                position: "relative",
                bgcolor: "background.paper",
              }}
            >
              <Stack direction="row" alignItems="start" spacing={1}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap title={n.title} sx={{ fontWeight: 600 }}>
                    {n.title}
                  </Typography>
                  {n.body && (
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {n.body}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(n.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                <Tooltip title="Delete note">
                  <IconButton
                    size="small"
                    onClick={() => setToDelete(n)}
                    sx={{ ml: 0.5 }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>
          {toDelete === "ALL" ? "Delete all notes?" : "Delete this note?"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {toDelete === "ALL"
              ? "This action cannot be undone."
              : "You won’t be able to recover it after deletion."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={onConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
