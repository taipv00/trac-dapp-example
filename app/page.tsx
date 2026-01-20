"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Stack,
} from '@mui/material';

type Row = { id: number; name: string; tx: string };

const STATE_KEY = '02edbc4f6746b1cfd2c2c3358d8f3e310429060a780b4e277d6f16982c72a40e';
const POLL_MS = 3000;

function normalizeRows(payload: any): Row[] {
  // Preferred shape: { pokemons: "[ {id,name,tx}, ... ]" }
  try {
    let raw: any = (payload as any)?.pokemons;
    if (!raw && (payload as any)?.value) {
      const v: any = (payload as any).value;
      raw = typeof v === 'object' ? v.pokemons : undefined;
      if (!raw && typeof v === 'string') {
        try { raw = JSON.parse(v).pokemons; } catch {}
      }
    }
    if (raw) {
      const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (Array.isArray(arr)) {
        return arr.map((item: any, idx: number) => ({
          id: typeof item?.id === 'number' ? item.id : idx,
          name: String(item?.name ?? ''),
          tx: String(item?.tx ?? ''),
        }));
      }
    }
  } catch {}
  return [];
}

export default function Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = new URLSearchParams({ key: `app/pokedex/${STATE_KEY}` }).toString()

  debugger
  const fetchState = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/state?${query}`, { cache: 'no-store' });
      const text = await res.text();
      let json: any;
      try { json = JSON.parse(text); } catch { json = text; }
      const next = normalizeRows(json);
      setRows(next);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch state');
    }
  }, [query]);

  useEffect(() => {
    setLoading(true);
    fetchState().finally(() => setLoading(false));
    const id = setInterval(fetchState, POLL_MS);
    return () => clearInterval(id);
  }, [fetchState]);

  const handleCatch = useCallback(async () => {
    try {
      const body = { command: JSON.stringify({ type: 'catch', value: { msg: 'hi' } }) };
      const res = await fetch('/api/tx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      try { console.log('Catch response (JSON):', JSON.parse(text)); } catch { console.log('Catch response (text):', text); }
      fetchState();
    } catch (e) {
      console.error('Catch failed:', e);
      setError('Catch request failed');
    }
  }, [fetchState]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div">Pokedex</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCatch}>Catch</Button>
          {loading && <Typography variant="body2">Loading…</Typography>}
        </Stack>
        {error && <Alert severity="error" sx={{ mb: 2 }}>Error: {error}</Alert>}

        <TableContainer component={Paper}>
          <Table aria-label="Pokedex table">
            <caption>Pokedex</caption>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Tx</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace' }}>{r.tx}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2}><em>No entries yet.</em></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
