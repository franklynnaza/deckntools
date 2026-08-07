function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function formatCurrency(n: number) {
  return `$${n.toFixed(2)}`
}

export function orderConfirmationHtml(params: { firstName: string; orderId: string; items: Array<{ name: string; quantity: number; price: number }>; amount: number }) {
  const { firstName, orderId, items, amount } = params
  const itemsRows = items
    .map((i) => {
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee;color:#111">${escapeHtml(i.name)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;color:#555;text-align:center">${i.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;color:#111;text-align:right">${formatCurrency(i.price)}</td>
      </tr>`
    })
    .join('')

  return `
  <div style="background:#f6f7f9;padding:24px">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
      <div style="background:#111827;color:#ffffff;padding:20px 24px;font-size:18px;font-weight:600">DecknTools</div>
      <div style="padding:24px">
        <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827">Order Confirmed</h1>
        <p style="margin:0 0 16px 0;color:#4b5563">Hi ${escapeHtml(firstName)}, thank you for your order.</p>

        <div style="margin:12px 0;padding:12px;border:1px solid #e5e7eb;border-radius:6px">
          <div style="display:flex;justify-content:space-between;font-family:monospace;color:#374151">
            <span>Order ID</span>
            <strong>${escapeHtml(orderId)}</strong>
          </div>
        </div>

        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:12px">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px;color:#6b7280;font-weight:600;border-bottom:1px solid #e5e7eb">Item</th>
              <th style="text-align:center;padding:8px;color:#6b7280;font-weight:600;border-bottom:1px solid #e5e7eb">Qty</th>
              <th style="text-align:right;padding:8px;color:#6b7280;font-weight:600;border-bottom:1px solid #e5e7eb">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div style="display:flex;justify-content:flex-end;margin-top:16px">
          <div style="min-width:220px">
            <div style="display:flex;justify-content:space-between;color:#374151;padding:4px 0">
              <span>Total</span>
              <strong>${formatCurrency(amount)}</strong>
            </div>
          </div>
        </div>

        <p style="margin-top:20px;color:#4b5563">We'll email you tracking details when your order ships.</p>
        <a href="https://deckntools.example/orders/${encodeURIComponent(orderId)}" style="display:inline-block;margin-top:12px;background:#111827;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:6px;font-weight:600">View Order</a>
      </div>
      <div style="padding:16px 24px;background:#f9fafb;color:#6b7280;font-size:12px">This message was sent by DecknTools</div>
    </div>
  </div>
  `
}

export function orderStatusHtml(params: { firstName: string; orderId: string; status: string }) {
  const { firstName, orderId, status } = params
  return `
  <div style="background:#f6f7f9;padding:24px">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
      <div style="background:#111827;color:#ffffff;padding:20px 24px;font-size:18px;font-weight:600">DecknTools</div>
      <div style="padding:24px">
        <h1 style="margin:0 0 8px 0;font-size:22px;color:#111827">Order Update</h1>
        <p style="margin:0 0 16px 0;color:#4b5563">Hi ${escapeHtml(firstName)}, your order status has changed.</p>
        <div style="margin:12px 0;padding:12px;border:1px solid #e5e7eb;border-radius:6px">
          <div style="display:flex;justify-content:space-between;font-family:monospace;color:#374151">
            <span>Order ID</span>
            <strong>${escapeHtml(orderId)}</strong>
          </div>
        </div>
        <div style="margin-top:8px;color:#111827;font-size:16px">New status: <strong>${escapeHtml(status)}</strong></div>
        <a href="https://deckntools.example/orders/${encodeURIComponent(orderId)}" style="display:inline-block;margin-top:12px;background:#111827;color:#ffffff;text-decoration:none;padding:10px 14px;border-radius:6px;font-weight:600">View Order</a>
      </div>
      <div style="padding:16px 24px;background:#f9fafb;color:#6b7280;font-size:12px">This message was sent by DecknTools</div>
    </div>
  </div>
  `
}

