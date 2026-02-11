import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Dns,
  Public,
  Update,
  Schedule,
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    success: { main: '#66bb6a' },
    error: { main: '#f44336' },
  },
});

interface Status {
  lastCheck: string | null;
  currentWanIp: string | null;
  currentDnsIp: string | null;
  lastUpdate: string | null;
  lastError: string | null;
  updateCount: number;
  dnsRecord: string;
}

export default function App() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const isInSync = status?.currentWanIp === status?.currentDnsIp;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Dns fontSize="large" color="primary" />
            <Typography variant="h4" component="h1">
              Route53 DDNS Status
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  DNS Record:
                </Typography>
                <Typography variant="body1">{status?.dnsRecord || 'N/A'}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Public fontSize="small" />
                  <Typography variant="subtitle2">Current WAN IP</Typography>
                </Box>
                <Typography variant="h6">{status?.currentWanIp || 'N/A'}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Dns fontSize="small" />
                  <Typography variant="subtitle2">DNS A Record IP</Typography>
                </Box>
                <Typography variant="h6">{status?.currentDnsIp || 'N/A'}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="subtitle2">Status:</Typography>
                {status?.lastError ? (
                  <Chip
                    icon={<Error />}
                    label="Error"
                    color="error"
                    size="small"
                  />
                ) : isInSync ? (
                  <Chip
                    icon={<CheckCircle />}
                    label="In Sync"
                    color="success"
                    size="small"
                  />
                ) : (
                  <Chip
                    icon={<Update />}
                    label="Out of Sync"
                    color="warning"
                    size="small"
                  />
                )}
              </Box>
            </Grid>

            {status?.lastError && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'error.dark' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Last Error:
                  </Typography>
                  <Typography variant="body2">{status.lastError}</Typography>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={1}>
                <Schedule fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Check
                  </Typography>
                  <Typography variant="body2">
                    {status?.lastCheck
                      ? new Date(status.lastCheck).toLocaleString()
                      : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={1}>
                <Update fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Update
                  </Typography>
                  <Typography variant="body2">
                    {status?.lastUpdate
                      ? new Date(status.lastUpdate).toLocaleString()
                      : 'Never'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Total Updates
                </Typography>
                <Typography variant="body2">{status?.updateCount || 0}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
