export type WidgetId = "notes" | "tasks" | "news" | "chart" | "project" | "subscriptions";

export type WidgetDef = {
  id: WidgetId;
  name: string;
  description: string;
  defaultSize: { w: number; h: number };
  // simple string for MUI icon name helper or pass node at runtime
  icon?: React.ReactNode;
};

export type SelectedWidget = {
  id: WidgetId;
};
