// src/pages/Home/Dashboard.tsx
import * as React from "react";
import {
  Box,
  Card,
  Container,
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
import { Responsive as ResponsiveGridLayout, WidthProvider, type Layout, type Layouts } from "react-grid-layout";


import { useLocalStorage } from "./UseLocalStorage";
import type { WidgetDef, WidgetId, SelectedWidget } from "./types";
import { WidgetPicker } from "./WidgetPicker";
import { TasksWidget } from "./Widgets";
import ProjectWidget from "./ProjectWidget";
import SubscriptionWidget from "./SubscriptionWidget";
import { NotesWidget } from "./Widgets";

// 🔽 Adjust this path if needed (this assumes: src/pages/Home/Dashboard.tsx -> src/assets/svg/No-Data.svg)
import noDataSvg from "../../assets/svg/No-Data.svg";

const RGL = WidthProvider(ResponsiveGridLayout);
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 } as const;
const COLS        = { lg: 12,   md: 10,  sm: 8,   xs: 6,   xxs: 2 } as const;
type BP = keyof typeof BREAKPOINTS; // "lg" | "md" | "sm" | "xs" | "xxs"

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
// default height (grid units) for a widget
const DEFAULT_H = 4;

// compute grid position by index
function posFor(index: number, perRow: number) {
  const xIndex = index % perRow;
  const yIndex = Math.floor(index / perRow);
  return { xIndex, yIndex };
}

// create one layout entry per breakpoint for a given widget
function makeLayoutItemsForAllBps(key: string, index: number): Layouts {
  // width per breakpoint (desktop=2 per row, mobile=1 per row)
  const W: Record<BP, number> = { lg: 6, md: 5, sm: 8, xs: 6, xxs: 2 };

  // widgets per row by breakpoint
  const perRow = {
    lg: Math.floor(COLS.lg / W.lg),   // 12/6 = 2
    md: Math.floor(COLS.md / W.md),   // 10/5 = 2
    sm: Math.floor(COLS.sm / W.sm),   //  8/8 = 1
    xs: Math.floor(COLS.xs / W.xs),   //  6/6 = 1
    xxs: Math.floor(COLS.xxs / W.xxs) //  2/2 = 1
  } as Record<BP, number>;

  const out: Layouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };

  (Object.keys(out) as BP[]).forEach((bp) => {
    const { xIndex, yIndex } = posFor(index, perRow[bp]);
    out[bp] = [
      {
        i: key,
        x: xIndex * W[bp],
        y: yIndex * DEFAULT_H,
        w: W[bp],
        h: DEFAULT_H,
        minW: W[bp], // lock width to keep 2-per-row/1-per-row (optional)
        maxW: W[bp],
        minH: 3
      }
    ];
  });

  return out;
}


// Helper to build a layout item (each widget takes half row: w=2 of 4 cols)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        // remove from widgets + all breakpoints
        const nextWidgets = prev.widgets.filter((w) => w.id !== id);
        const nextLayouts: Layouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };
        (Object.keys(prev.layouts) as (keyof Layouts)[]).forEach((bp) => {
          nextLayouts[bp] = (prev.layouts[bp] || []).filter((li) => li.i !== id);
        });
        return { widgets: nextWidgets, layouts: nextLayouts };
      } else {
        // add to widgets + create entries for each breakpoint
        const nextWidgets = [...prev.widgets, { id }];
        const index = prev.widgets.length; // place at end
        const newLayouts = makeLayoutItemsForAllBps(id, index);
  
        // merge new entry into each breakpoint layout
        const nextLayouts: Layouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };
        (Object.keys(prev.layouts) as (keyof Layouts)[]).forEach((bp) => {
          nextLayouts[bp] = [...(prev.layouts[bp] || []), ...(newLayouts[bp] || [])];
        });
  
        return { widgets: nextWidgets, layouts: nextLayouts };
      }
    });
  };
  
  const removeWidget = (id: WidgetId) => handleToggleWidget(id);
  return (
    <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
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
            sx={{
              borderRadius: 2,
              color: "#00A5AA",
              borderColor: "#00A5AA",
              "&:hover": {
                borderColor: "#008B8F",
                backgroundColor: "rgba(0, 165, 170, 0.04)",
              },
              textTransform: "Capitalize",
            }}
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
            borderColor: "#00A5AA",
            borderStyle: "dashed",
            py: 6,
            px: 3,
            mb: 2,
            maxWidth: 840,      // ⛔ prevents ultra-wide stretching
            mx: "auto",         // center it
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
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
          layouts={layouts}
          breakpoints={BREAKPOINTS}
          cols={COLS}
          rowHeight={90}
          margin={[12, 12]}
          containerPadding={[0, 0]}
          compactType="vertical"
          isBounded
          draggableHandle=".widget-drag-handle"
          draggableCancel=".no-drag"
          onLayoutChange={(_, allLayouts: Layouts) => {
            setState((prev) => ({ ...prev, layouts: allLayouts }));
          }}
        >
          {state.widgets.map((w) => (
            <div key={w.id}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  transition: "transform 180ms ease, box-shadow 180ms ease",
                  willChange: "transform",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 18px rgba(0,0,0,0.10)",
                  },
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
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
                  <Box
                    className="widget-drag-handle"
                    sx={{ display: "flex", alignItems: "center", gap: 0.75, cursor: "move" }}
                  >
                    <DragIndicator fontSize="small" sx={{ color: "text.secondary" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {CATALOG.find((c) => c.id === w.id)?.name ?? w.id}
                    </Typography>
                  </Box>
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
    </Container>
  );
  
}
