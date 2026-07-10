import React, { useEffect, useState } from "react";
import { CreditCard, History, AlertCircle } from "lucide-react";
import { fetchUserPayments } from "../services/api";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchUserPayments();
      setPayments(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-32 pb-16 flex justify-center text-gold">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="mb-10">
          <h1 className="font-display text-4xl text-ivory flex items-center gap-3">
            <History className="text-gold" /> Payment History
          </h1>
          <p className="mt-2 text-smoke">Review your past transactions and payment receipts.</p>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-20 bg-obsidian-light/30 border border-obsidian-border rounded-xl">
            <AlertCircle className="w-12 h-12 text-smoke mx-auto mb-4 opacity-50" />
            <h3 className="text-ivory font-display text-xl mb-2">No Transactions Found</h3>
            <p className="text-smoke">You have no recorded payments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-obsidian-light/60 border border-obsidian-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-obsidian-border/60 bg-obsidian/40 text-xs uppercase tracking-wider text-smoke">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Transaction ID</th>
                  <th className="p-4 font-semibold">Method</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-border/40 text-sm">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-obsidian/20 transition-colors">
                    <td className="p-4 text-ivory">
                      {new Date(payment.transaction_date).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4 text-smoke font-mono text-xs">
                      {payment.razorpay_payment_id || `COD-${payment.id.substring(0,8)}`}
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-2 text-smoke">
                        <CreditCard className="w-4 h-4 text-gold/70" />
                        {payment.payment_method}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        payment.payment_status === 'Success' ? 'bg-green-500/10 text-green-400' :
                        payment.payment_status === 'Failed' ? 'bg-rose/10 text-rose' :
                        'bg-gold/10 text-gold'
                      }`}>
                        {payment.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium text-ivory">
                      ${payment.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
