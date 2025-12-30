import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  Menu as MenuIcon,
  NotificationsNone,
  SettingsOutlined,
  DashboardOutlined,
  ReceiptLongOutlined,
  Inventory2Outlined,
  PeopleAltOutlined,
  AddCircleOutline,
  TrendingUp,
  BarChart,
  Timeline,
  Group,
  CheckCircle,
  WarningAmber,
  LocalShipping,
  ShoppingCart,
  Download,
} from "@mui/icons-material";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarExport,
} from "@mui/x-data-grid";
import type { GridPaginationModel, GridColDef} from "@mui/x-data-grid";

import { LineChart } from "@mui/x-charts/LineChart";
import { useForm } from "react-hook-form";
import { createTheme, ThemeProvider } from "@mui/material/styles";

/* ---------------------------
   THEME (corporativo / igual imagem)
---------------------------- */
const theme = createTheme({
  palette: {
    primary: { main: "#1976D2" },
    background: { default: "#EEF1F5" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: ["Inter", "system-ui", "Segoe UI", "Roboto", "Arial"].join(","),
  },
  components: {
    MuiAppBar: {
      styleOverrides: { root: { boxShadow: "none" } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.06)",
        },
      },
    },
  },
});

/* ---------------------------
   MOCK DATA
---------------------------- */
type Role = "admin" | "user";
type Density = "compact" | "comfortable";

const drawerWidth = 280;

function formatPct(n: number) {
  return `${n.toFixed(1)}%`;
}

function kpiDeltaChip(delta: number) {
  const up = delta >= 0;
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {up ? (
        <TrendingUp fontSize="small" sx={{ color: "#2E7D32" }} />
      ) : (
        <TrendingUp
          fontSize="small"
          sx={{ color: "#D32F2F", transform: "rotate(180deg)" }}
        />
      )}
      <Typography variant="body2" sx={{ color: up ? "#2E7D32" : "#D32F2F", fontWeight: 600 }}>
        {up ? `+${formatPct(delta)}` : `${formatPct(delta)}`}{" "}
        <Typography component="span" variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
          vs last week
        </Typography>
      </Typography>
    </Stack>
  );
}

type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  tag: string;
  kind: "success" | "warning" | "info" | "new";
};

const activities: ActivityItem[] = [
  {
    id: "a1",
    title: "Production Order Completed",
    subtitle: "Order #PO-4521 processed successfully",
    time: "5 min ago",
    tag: "Production",
    kind: "success",
  },
  {
    id: "a2",
    title: "Low Stock Alert",
    subtitle: "Raw material inventory below threshold",
    time: "12 min ago",
    tag: "Inventory",
    kind: "warning",
  },
  {
    id: "a3",
    title: "Shipment Dispatched",
    subtitle: "Delivery #DL-8934 in transit",
    time: "28 min ago",
    tag: "Logistics",
    kind: "info",
  },
  {
    id: "a4",
    title: "New Order Received",
    subtitle: "Order #SO-7623 from client ABC Corp",
    time: "1 hour ago",
    tag: "Sales",
    kind: "new",
  },
];

function activityIcon(kind: ActivityItem["kind"]) {
  if (kind === "success") return <CheckCircle sx={{ color: "#2E7D32" }} />;
  if (kind === "warning") return <WarningAmber sx={{ color: "#ED6C02" }} />;
  if (kind === "info") return <LocalShipping sx={{ color: "#1976D2" }} />;
  return <ShoppingCart sx={{ color: "#2E7D32" }} />;
}

function activityChipColor(tag: string) {
  const map: Record<string, "primary" | "success" | "warning" | "secondary" | "info"> = {
    Production: "primary",
    Inventory: "warning",
    Logistics: "secondary",
    Sales: "success",
  };
  return map[tag] ?? "info";
}

/* ---------------------------
   MOCK SERVER-SIDE PAGINATION
---------------------------- */
type OrderRow = {
  id: number;
  orderNo: string;
  customer: string;
  status: "Open" | "Paid" | "Overdue" | "Cancelled";
  total: number;
  dueDate: string;
};

function makeRows(count = 137): OrderRow[] {
  const statuses: OrderRow["status"][] = ["Open", "Paid", "Overdue", "Cancelled"];
  const customers = ["ABC Corp", "NovaTech", "Blue Mining", "HealthCare", "Orion SA", "Senac Ltda"];
  const rows: OrderRow[] = [];
  for (let i = 1; i <= count; i++) {
    rows.push({
      id: i,
      orderNo: `SO-${(7000 + i).toString()}`,
      customer: customers[i % customers.length],
      status: statuses[i % statuses.length],
      total: Math.round((Math.random() * 9000 + 200) * 100) / 100,
      dueDate: new Date(Date.now() + (i % 30) * 86400000).toISOString().slice(0, 10),
    });
  }
  return rows;
}
const ALL_ROWS = makeRows();

function fetchOrdersServerSide(params: {
  page: number;
  pageSize: number;
  quick: string;
  status: string | "All";
}): Promise<{ rows: OrderRow[]; rowCount: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = params.quick.trim().toLowerCase();
      let filtered = [...ALL_ROWS];

      if (params.status !== "All") {
        filtered = filtered.filter((r) => r.status === params.status);
      }
      if (q) {
        filtered = filtered.filter(
          (r) =>
            r.orderNo.toLowerCase().includes(q) ||
            r.customer.toLowerCase().includes(q) ||
            r.status.toLowerCase().includes(q)
        );
      }

      const start = params.page * params.pageSize;
      const end = start + params.pageSize;
      resolve({ rows: filtered.slice(start, end), rowCount: filtered.length });
    }, 450);
  });
}

/* ---------------------------
   CUSTOM GRID TOOLBAR (QuickFilter + Export)
---------------------------- */
function OrdersToolbar({
  status,
  onStatusChange,
}: {
  status: string | "All";
  onStatusChange: (v: string | "All") => void;
}) {
  return (
    <GridToolbarContainer sx={{ p: 1, gap: 1, justifyContent: "space-between" }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <GridToolbarQuickFilter debounceMs={250} />
        <ToggleButtonGroup
          size="small"
          exclusive
          value={status}
          onChange={(_, v) => v && onStatusChange(v)}
        >
          <ToggleButton value="All">All</ToggleButton>
          <ToggleButton value="Open">Open</ToggleButton>
          <ToggleButton value="Paid">Paid</ToggleButton>
          <ToggleButton value="Overdue">Overdue</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="Export CSV">
          <span>
            <GridToolbarExport csvOptions={{ fileName: "orders" }} />
          </span>
        </Tooltip>
        <Button
          size="small"
          variant="outlined"
          startIcon={<Download />}
          onClick={() => alert("Gancho para PDF: use jsPDF + html2canvas ou print stylesheet.")}
        >
          PDF
        </Button>
      </Stack>
    </GridToolbarContainer>
  );
}

/* ---------------------------
   WIZARD (Stepper) inside Dialog
---------------------------- */
const wizardSteps = ["Basic Info", "Billing", "Review"];

type WizardForm = {
  customer: string;
  total: number;
  dueDate: string;
  notes: string;
};

function WizardDialog({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const { register, handleSubmit, reset, watch } = useForm<WizardForm>({
    defaultValues: {
      customer: "",
      total: 0,
      dueDate: new Date().toISOString().slice(0, 10),
      notes: "",
    },
  });

  const values = watch();

  const next = () => setActiveStep((s) => Math.min(s + 1, wizardSteps.length - 1));
  const back = () => setActiveStep((s) => Math.max(s - 1, 0));

  const close = () => {
    setActiveStep(0);
    reset();
    onClose();
  };

  const submit = handleSubmit(() => {
    onSaved();
    close();
  });

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>New Sales Order</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
          {wizardSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Stack spacing={2}>
            <TextField
              label="Customer"
              fullWidth
              {...register("customer", { required: true })}
            />
            <TextField
              label="Notes (optional)"
              fullWidth
              multiline
              minRows={3}
              {...register("notes")}
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={2}>
            <TextField
              label="Total (USD)"
              type="number"
              fullWidth
              inputProps={{ step: "0.01" }}
              {...register("total", { valueAsNumber: true })}
            />
            <TextField
              label="Due date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("dueDate")}
            />
          </Stack>
        )}

        {activeStep === 2 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Review
              </Typography>
              <Typography sx={{ mt: 1 }}>
                <b>Customer:</b> {values.customer || "—"}
              </Typography>
              <Typography>
                <b>Total:</b> {values.total ? `$${values.total.toFixed(2)}` : "—"}
              </Typography>
              <Typography>
                <b>Due:</b> {values.dueDate || "—"}
              </Typography>
              <Typography sx={{ mt: 1 }} color="text.secondary">
                {values.notes || "No notes"}
              </Typography>
            </CardContent>
          </Card>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={close}>Cancel</Button>
        <Button onClick={back} disabled={activeStep === 0}>
          Back
        </Button>
        {activeStep < wizardSteps.length - 1 ? (
          <Button variant="contained" onClick={next}>
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={submit}>
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

/* ---------------------------
   MAIN APP (single screen)
---------------------------- */
export default function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [role, setRole] = React.useState<Role>("admin");
  const [density, setDensity] = React.useState<Density>("comfortable");

  // DataGrid state
  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [rows, setRows] = React.useState<OrderRow[]>([]);
  const [rowCount, setRowCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState<string | "All">("All");
  const [quick, setQuick] = React.useState(""); // will read from quick filter via API? we’ll bind with grid filter model later

  // Wizard + snackbar
  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [snack, setSnack] = React.useState<{ open: boolean; msg: string; sev: "success" | "info" }>({
    open: false,
    msg: "",
    sev: "success",
  });

  // Fetch server-side paginated data
  React.useEffect(() => {
    let alive = true;
    setLoading(true);

    fetchOrdersServerSide({
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      quick,
      status,
    }).then((res) => {
      if (!alive) return;
      setRows(res.rows);
      setRowCount(res.rowCount);
      setLoading(false);
    });

    return () => {
      alive = false;
    };
  }, [paginationModel.page, paginationModel.pageSize, quick, status]);

  const handleDrawerToggle = () => setMobileOpen((s) => !s);

  const cols: GridColDef<OrderRow>[] = [
    { field: "orderNo", headerName: "Order", flex: 1, minWidth: 120 },
    { field: "customer", headerName: "Customer", flex: 1.3, minWidth: 160 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (p) => {
        const v = p.value as OrderRow["status"];
        const color =
          v === "Paid" ? "success" : v === "Overdue" ? "error" : v === "Open" ? "info" : "default";
        return <Chip size="small" label={v} color={color as any} variant="outlined" />;
      },
    },
    {
      field: "total",
      headerName: "Total",
      flex: 1,
      minWidth: 120,
      valueFormatter: (v) => `$${Number(v.value).toFixed(2)}`,
    },
    { field: "dueDate", headerName: "Due", flex: 1, minWidth: 120 },
  ];

  const drawer = (
    <Box sx={{ height: "100%" }}>
      <Toolbar />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Navigation
        </Typography>
      </Box>
      <List>
        <ListItemButton selected>
          <ListItemIcon>
            <DashboardOutlined />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <ReceiptLongOutlined />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <Inventory2Outlined />
          </ListItemIcon>
          <ListItemText primary="Inventory" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <PeopleAltOutlined />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
      </List>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Variations
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={role === "admin"}
              onChange={(e) => setRole(e.target.checked ? "admin" : "user")}
            />
          }
          label={`Role: ${role}`}
        />

        <ToggleButtonGroup
          size="small"
          exclusive
          value={density}
          onChange={(_, v) => v && setDensity(v)}
          sx={{ mt: 1 }}
        >
          <ToggleButton value="comfortable">Comfort</ToggleButton>
          <ToggleButton value="compact">Compact</ToggleButton>
        </ToggleButtonGroup>

        <Button
          sx={{ mt: 2 }}
          fullWidth
          variant="contained"
          startIcon={<AddCircleOutline />}
          onClick={() => setWizardOpen(true)}
          disabled={role !== "admin"}
        >
          New Order
        </Button>

        {role !== "admin" && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            (User role can’t create orders)
          </Typography>
        )}
      </Box>
    </Box>
  );

  // Chart data (similar to image)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const series = [
    { label: "Production", data: [82, 85, 83, 88, 90, 86, 84] },
    { label: "Operations", data: [75, 78, 80, 82, 85, 83, 81] },
    { label: "Logistics", data: [68, 70, 72, 74, 78, 73, 69] },
    { label: "Sales", data: [88, 86, 89, 92, 91, 88, 86] },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" color="primary">
        <Toolbar sx={{ gap: 1.5 }}>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: "rgba(255,255,255,0.9)",
                mask: "linear-gradient(#000 0 0)",
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ERP Management System
            </Typography>
          </Stack>

          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <NotificationsNone />
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton color="inherit">
              <SettingsOutlined />
            </IconButton>
          </Tooltip>

          <Avatar sx={{ width: 32, height: 32, bgcolor: "rgba(0,0,0,0.25)" }}>A</Avatar>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box sx={{ display: "flex" }}>
        <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />

          <Container maxWidth="xl" sx={{ pb: 3 }}>
            {/* Header */}
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Monitor your system&apos;s productivity, resource density, and operational patterns
            </Typography>

            {/* KPI cards */}
            <Grid container spacing={3}>
              {[
                {
                  title: "Overall Productivity",
                  value: "87.5%",
                  delta: 5.2,
                  icon: <Timeline sx={{ color: "#2E7D32" }} />,
                  tint: "rgba(46,125,50,0.12)",
                },
                {
                  title: "Resource Density",
                  value: "1,247",
                  delta: 12.8,
                  icon: <BarChart sx={{ color: "#1976D2" }} />,
                  tint: "rgba(25,118,210,0.12)",
                },
                {
                  title: "Pattern Accuracy",
                  value: "94.2%",
                  delta: -1.3,
                  icon: <TrendingUp sx={{ color: "#ED6C02" }} />,
                  tint: "rgba(237,108,2,0.12)",
                },
                {
                  title: "Active Users",
                  value: "342",
                  delta: 8.5,
                  icon: <Group sx={{ color: "#9C27B0" }} />,
                  tint: "rgba(156,39,176,0.12)",
                },
              ].map((k) => (
                <Grid key={k.title} item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="subtitle2" color="text.secondary">
                          {k.title}
                        </Typography>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 1.5,
                            bgcolor: k.tint,
                            display: "grid",
                            placeItems: "center",
                          }}
                        >
                          {k.icon}
                        </Box>
                      </Stack>

                      <Typography variant="h4" sx={{ fontWeight: 800, mt: 2 }}>
                        {k.value}
                      </Typography>

                      <Box sx={{ mt: 1.5 }}>{kpiDeltaChip(k.delta)}</Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Chart + Activity */}
            <Grid container spacing={3} sx={{ mt: 0 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Productivity Trends
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Weekly performance metrics across departments
                    </Typography>

                    <Box sx={{ height: 320 }}>
                      <LineChart
                        xAxis={[{ scaleType: "point", data: days }]}
                        series={series as any}
                        height={320}
                        margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
                        grid={{ horizontal: true, vertical: true }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Recent Activity
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Latest system events
                    </Typography>

                    <Stack spacing={2}>
                      {activities.map((a) => (
                        <Stack
                          key={a.id}
                          direction="row"
                          spacing={2}
                          alignItems="flex-start"
                          sx={{ p: 1, borderRadius: 2 }}
                        >
                          <Avatar sx={{ bgcolor: "rgba(0,0,0,0.04)", color: "inherit" }}>
                            {activityIcon(a.kind)}
                          </Avatar>

                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 800 }}>{a.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {a.subtitle}
                            </Typography>

                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {a.time}
                              </Typography>
                              <Chip size="small" label={a.tag} color={activityChipColor(a.tag)} />
                            </Stack>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* DataGrid (filters + server-side pagination) */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Orders (Advanced Filters + Server Pagination)
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutline />}
                    onClick={() => setWizardOpen(true)}
                    disabled={role !== "admin"}
                  >
                    Create Order
                  </Button>
                </Stack>

                <Box sx={{ height: 520, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={cols}
                    loading={loading}
                    rowCount={rowCount}
                    paginationMode="server"
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    density={density}
                    disableRowSelectionOnClick
                    slots={{
                      toolbar: () => (
                        <OrdersToolbar
                          status={status}
                          onStatusChange={(v) => {
                            setStatus(v);
                            setPaginationModel((p) => ({ ...p, page: 0 }));
                          }}
                        />
                      ),
                    }}
                    // “QuickFilter” do toolbar atualiza internamente, mas pra simular server-side
                    // a gente captura pelo built-in input via querySelector seria gambiarra.
                    // Então deixei um filtro simples também:
                    onFilterModelChange={(m) => {
                      const q = (m.quickFilterValues?.[0] ?? "").toString();
                      setQuick(q);
                      setPaginationModel((p) => ({ ...p, page: 0 }));
                    }}
                  />
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                  CSV export via GridToolbarExport. PDF: use jsPDF/html2canvas ou stylesheet + window.print().
                </Typography>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </Box>

      {/* Wizard */}
      <WizardDialog
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSaved={() => setSnack({ open: true, msg: "Order created successfully", sev: "success" })}
      />

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2200}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snack.sev}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
