import React, { useEffect, useState } from 'react';
import apiService from '../../services/api';

const AdminWithdrawals = () => {
  const [status, setStatus] = useState('pending');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiService.getAdminWithdrawals({ status, page, limit });
      if (res.success) {
        setWithdrawals(res.withdrawals || []);
      } else {
        setError(res.message || 'Failed to load');
      }
    } catch (e) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  const approve = async (id) => {
    try {
      await apiService.approveAdminWithdrawal(id);
      setWithdrawals((prev) => prev.filter((w) => w.id !== id));
    } catch (e) {
      alert(e.message || 'Failed to approve');
    }
  };

  const reject = async (id) => {
    const reason = window.prompt('Enter reason for rejection');
    if (!reason) return;
    try {
      await apiService.rejectAdminWithdrawal(id, reason);
      setWithdrawals((prev) => prev.filter((w) => w.id !== id));
    } catch (e) {
      alert(e.message || 'Failed to reject');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wallet Withdrawals</h1>
          <p className="text-gray-600 mt-2">Review and process user withdrawal requests</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{status.charAt(0).toUpperCase() + status.slice(1)} Withdrawals</h3>
        </div>

        {loading ? (
          <div className="p-8">Loading...</div>
        ) : error ? (
          <div className="p-8 text-red-600">{error}</div>
        ) : withdrawals.length === 0 ? (
          <div className="p-8 text-gray-500">No withdrawals</div>
        ) : (
          <div className="divide-y">
            {withdrawals.map((w) => (
              <div key={w.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">#{w.id} • ${Math.abs(Number(w.amount)).toFixed(2)}</div>
                  <div className="text-sm text-gray-600">{w.user_name} • {new Date(w.created_at).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{w.description}</div>
                </div>
                {w.status === 'pending' ? (
                  <div className="space-x-2">
                    <button onClick={() => approve(w.id)} className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700">Approve</button>
                    <button onClick={() => reject(w.id)} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700">Reject</button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-700">{w.status}</span>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page}</span>
          <button
            className="px-3 py-1 rounded border border-gray-300"
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawals;


