import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function truncateAddress(address) {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatAge(ts) {
  if (!ts) return '';
  const diff = Date.now() - Number(ts);
  const sec = Math.max(0, Math.floor(diff / 1000));
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  return `${day}d`;
}

export default function Transactions({ address }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set('limit', '50');
    if (address) params.set('address', address);
    return params.toString();
  }, [address]);

  useEffect(() => {
    let cancelled = false;
    async function fetchTransactions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/transactions?${query}`);
        if (!res.ok) throw new Error(`Failed to load transactions: ${res.status}`);
        const json = await res.json();
        if (!cancelled && json.data) setTransactions(json.data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to fetch transactions');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchTransactions();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <section className="transactions-section">
      <div className="transactions-header">
        <h2>Transactions</h2>
        <p className="transactions-subtitle">
          {address ? (
            <>Filtered to connected wallet: <span title={address} className="mono">{truncateAddress(address)}</span></>
          ) : (
            <>Showing latest transactions (connect a wallet to filter)</>
          )}
        </p>
      </div>

      {loading && (
        <div className="loading-row">
          <span className="spinner" aria-label="Loading" />
          <span>Loading transactions…</span>
        </div>
      )}

      {error && <p className="projects-error">{error}</p>}

      {!loading && !error && (
        <div className="tx-table-wrap">
          <table className="tx-table">
            <thead>
              <tr>
                <th>Age</th>
                <th>From</th>
                <th>To</th>
                <th>Token</th>
                <th>Value</th>
                <th>Chain</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="tx-empty">No transactions found.</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{formatAge(t.timestamp)}</td>
                    <td title={t.from} className="mono">{truncateAddress(t.from)}</td>
                    <td title={t.to} className="mono">{truncateAddress(t.to)}</td>
                    <td>{t.token}</td>
                    <td>{t.value}</td>
                    <td>{t.chainId}</td>
                    <td><span className={`badge badge--${(t.status || '').toLowerCase()}`}>{t.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
