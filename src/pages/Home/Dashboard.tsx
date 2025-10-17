// src/pages/Home/Dashboard.tsx
import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import WidgetsOutlined from "@mui/icons-material/WidgetsOutlined";
import DragIndicator from "@mui/icons-material/DragIndicator";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import GridLayout, { WidthProvider, type Layout, type Layouts } from "react-grid-layout";

import { useLocalStorage } from "./UseLocalStorage";
import type { WidgetDef, WidgetId, SelectedWidget } from "./types";
import { WidgetPicker } from "./WidgetPicker";
import { TasksWidget } from "./Widgets";
import ProjectWidget from "./ProjectWidget";
import SubscriptionWidget from "./SubscriptionWidget";
import { NotesWidget } from "./Widgets";

// 🔽 Adjust this path if needed (this assumes: src/pages/Home/Dashboard.tsx -> src/assets/svg/No-Data.svg)
import noDataSvg from "../../assets/svg/No-Data.svg";

const RGL = WidthProvider(GridLayout);

/* ---------------- Fixed widgets (always visible, not in the grid) ---------------- */

function getGreetingForHour(hour: number): "Morning" | "Afternoon" | "Evening" | "Night" {
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
}

const TOP_CARD_HEIGHT = 180; // keep both greeting & news the same height

function GreetingWidgetFixed() {
  const now = React.useMemo(() => new Date(), []);
  const greet = getGreetingForHour(now.getHours());

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
       
        height: TOP_CARD_HEIGHT,
        display: "flex",
        alignItems: "center",
        px: 3,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {now.toLocaleString()}
        </Typography>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          {`Good ${greet}, User`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome to your dashboard — add widgets and drag them around to make it yours.
        </Typography>
      </CardContent>
    </Card>
  );
}

const DEMO_NEWS = [
  { id: 1, title: "All-hands on Friday", body: "Company update & Q&A in Town Hall at 15:00." },
  { id: 2, title: "Storybook refresh", body: "New tokens and components shipped this sprint." },
  { id: 3, title: "Security reminder", body: "Rotate PATs and review repo access this week." },
];

function NewsSliderFixed() {
  const [idx, setIdx] = React.useState(0);
  const next = () => setIdx((i) => (i + 1) % DEMO_NEWS.length);
  const prev = () => setIdx((i) => (i - 1 + DEMO_NEWS.length) % DEMO_NEWS.length);

  React.useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, []);

  const item = DEMO_NEWS[idx];

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
      
        height: TOP_CARD_HEIGHT,
        display: "flex",
        alignItems: "center",
        px: 3,
      }}
    >
      <CardContent sx={{ p: 0, width: "100%", display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton size="small" onClick={prev} aria-label="Previous news" className="no-drag">
          <ChevronLeft />
        </IconButton>
        <Box sx={{ flex: 1, px: 1 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.body}
          </Typography>
          <Typography variant="caption" color="text.disabled">{`${idx + 1} / ${DEMO_NEWS.length}`}</Typography>
        </Box>
        <IconButton size="small" onClick={next} aria-label="Next news" className="no-drag">
          <ChevronRight />
        </IconButton>
      </CardContent>
    </Card>
  );
}

/* ---------------- Catalog (exclude 'news' because it's fixed above) ---------------- */

const CATALOG: WidgetDef[] = [
  { id: "notes", name: "Notes", description: "Quick personal notes with autosave.", defaultSize: { w: 2, h: 2 } },
  { id: "tasks", name: "My Tasks", description: "See tasks assigned to you.", defaultSize: { w: 2, h: 2 } },
  { id: "chart", name: "Subscriptions", description: "Overview subscriptions", defaultSize: { w: 2, h: 2 } },
  { id: "project", name: "Projects", description: "Overview projects", defaultSize: { w: 2, h: 2 } },
];

type SavedState = {
  widgets: SelectedWidget[];
  layouts: Layouts;
};

const INITIAL: SavedState = {
  widgets: [],
  layouts: { lg: [], md: [], sm: [], xs: [], xxs: [] },
};

// Helper to build a layout item (each widget takes half row: w=2 of 4 cols)
function makeLayoutItem(key: string, w: number, h: number, index: number): Layout {
     const x = (index % 2 === 0) ? 0 : 2;              // left/right alternating
     const row = Math.floor(index / 2);
     return {
       i: key,
       x,
       y: row * Math.max(2, h), // stack rows; each row uses the widget's height
       w: 2,                    // force two-per-row
       h: Math.max(2, h),
       minW: 2,
       maxW: 2,
       minH: 2,
     };
   }
  
function renderWidget(id: WidgetId) {
  switch (id) {
    case "notes": return <NotesWidget />;
    case "tasks": return <TasksWidget />;
    case "chart": return <ProjectWidget />;
    case "subscriptions": return <SubscriptionWidget />;
    case "project": return <SubscriptionWidget />;
  }
  return null;
}

export default function HomeDashboard() {
  const [state, setState] = useLocalStorage<SavedState>("home.dashboard.v1", INITIAL);
  const [pickerOpen, setPickerOpen] = React.useState(false);

  // Ensure all layout keys exist
  const layouts = React.useMemo<Layouts>(() => {
    const out: Layouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };
    (Object.keys(out) as (keyof Layouts)[]).forEach((bp) => {
      out[bp] = state.layouts[bp] ?? [];
    });
    return out;
  }, [state.layouts]);

  const selectedIds = state.widgets.map((w) => w.id);

  const handleToggleWidget = (id: WidgetId) => {
    setState((prev) => {
      const exists = prev.widgets.some((w) => w.id === id);
      if (exists) {
        // remove widget and its layout entries across breakpoints
        const nextWidgets = prev.widgets.filter((w) => w.id !== id);
        const nextLayouts: Layouts = Object.fromEntries(
          Object.entries(prev.layouts).map(([bp, items]) => [
            bp,
            (items as Layout[]).filter((li) => li.i !== id),
          ])
        ) as Layouts;
        return { widgets: nextWidgets, layouts: nextLayouts };
      } else {
        const def = CATALOG.find((c) => c.id === id)!;
        const nextWidgets = [...prev.widgets, { id }];
        const nextLayouts: Layouts = Object.fromEntries(
          Object.entries(prev.layouts).map(([bp, items]) => [
            bp,
            [...(items as Layout[]), makeLayoutItem(id, def.defaultSize.w, def.defaultSize.h, (items as Layout[]).length)],
          ])
        ) as Layouts;
        return { widgets: nextWidgets, layouts: nextLayouts };
      }
    });
  };

  const removeWidget = (id: WidgetId) => handleToggleWidget(id);

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Card sx={{ borderRadius: 3, mb: 2 }} variant="outlined">
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Home
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your customizable dashboard
            </Typography>
          </Box>

          <Button
            onClick={() => setPickerOpen(true)}
            variant="outlined"
            startIcon={<WidgetsOutlined />}
            sx={{ borderRadius: 2, color: "#00A5AA",borderColor: "#00A5AA", '&:hover': { borderColor: "#008B8F", backgroundColor: "rgba(0, 165, 170, 0.04)" } , textTransform: "Capitalize"}} 
          >
            Add widgets
          </Button>
        </CardContent>
      </Card>

      {/* Fixed top row: Greeting (left) + News slider (right) */}
      <Grid container spacing={2} alignItems="stretch" sx={{ mb: 2 }}>
        <Grid item xs={12} md={7}>
          <GreetingWidgetFixed />
        </Grid>
        <Grid item xs={12} md={5}>
          <NewsSliderFixed />
        </Grid>
      </Grid>

      {/* ----- Empty state vs Grid ----- */}
      {state.widgets.length === 0 ? (
        // EMPTY STATE
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            borderColor: " #00A5AA",
            py: 8,
            px: 2,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            borderStyle: "dashed",
          }}
        >
          <Box sx={{ maxWidth: 420, mx: "auto" }}>
            <Box
              component="img"
              src={noDataSvg}
              alt="No data"
              sx={{ width: "100%", maxWidth: 200, mx: "auto", mb: 2, opacity: 0.95 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              No widgets yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No widgets are added yet. Please add a widget to your home screen.
            </Typography>
           
          </Box>
        </Card>
      ) : (
        // GRID WITH WIDGETS
        <RGL
          className="layout"
          layout={layouts.lg}           // single source of truth (4 cols)
          cols={4}                      // two widgets per row (each w=2)
          rowHeight={120}
          margin={[12, 12]}
          containerPadding={[0, 0]}
          compactType="vertical"
          draggableHandle=".widget-drag-handle"
          draggableCancel=".no-drag"
          isBounded
          // If you still see jumping, try: useCSSTransforms={false}
          onLayoutChange={(l) => {
            // mirror all breakpoints to avoid mismatch
            setState((prev) => ({
              ...prev,
              layouts: { lg: l, md: l, sm: l, xs: l, xxs: l },
            }));
          }}
        >
          {state.widgets.map((w) => (
            <div key={w.id}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                     willChange: "transform",
                     boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                     "&:hover": {
                       transform: "translateY(-4px) scale(1.01)",     // subtle bounce
                       boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
                     },
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
                variant="outlined"
              >
                {/* Card header: drag handle + delete */}
                <CardContent
                  sx={{
                    py: 1,
                    px: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Drag handle (left) */}
                  <Box
                    className="widget-drag-handle"
                    sx={{ display: "flex", alignItems: "center", gap: 0.75, cursor: "move" }}
                  >
                    <DragIndicator fontSize="small" sx={{ color: "text.secondary" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {CATALOG.find((c) => c.id === w.id)?.name ?? w.id}
                    </Typography>
                  </Box>

                  {/* Actions (right) – not draggable */}
                  <Box className="no-drag">
                    <Tooltip title="Remove widget">
                      <IconButton
                        size="small"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => removeWidget(w.id)}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>

                {/* Body */}
                <Box sx={{ p: 1.5, flex: 1, minHeight: 0 }} className="no-drag">
                  {renderWidget(w.id)}
                </Box>
              </Card>
            </div>
          ))}
        </RGL>
      )}

      {/* Picker dialog for adding grid widgets */}
      <WidgetPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        catalog={CATALOG}
        selected={selectedIds}
        onToggle={handleToggleWidget}
      />
    </Box>
  );
}
