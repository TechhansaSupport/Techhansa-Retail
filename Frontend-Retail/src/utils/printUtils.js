export const printInvoice = (invoice) => {
  const invoiceHtml = `
    <html>
      <head>
        <title>Invoice - ${invoice.invoiceId || 'Unknown'}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { margin: 0; color: #2563eb; }
          .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .details div { flex: 1; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8fafc; font-weight: bold; }
          .total { text-align: right; font-size: 1.2em; font-weight: bold; }
          .footer { text-align: center; color: #64748b; font-size: 0.9em; margin-top: 50px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>TECHHANSA RETAIL</h1>
            <p>123 Business Avenue, Tech Park<br>Bangalore 560001</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin-top:0;">INVOICE</h2>
            <p><strong>Invoice #:</strong> ${invoice.invoiceId || 'N/A'}</p>
            <p><strong>Date:</strong> ${new Date(invoice.createdAt || Date.now()).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${invoice.status || 'Pending'}</p>
          </div>
        </div>
        
        <div class="details">
          <div>
            <h3>Bill To:</h3>
            <p><strong>${invoice.partnerName || 'Channel Partner'}</strong><br>
            ${invoice.partnerAddress || 'Address on file'}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Procurement Items (Order ${invoice.orderReference || 'N/A'})</td>
              <td>1</td>
              <td>₹${invoice.amount?.toLocaleString('en-IN') || 0}</td>
              <td>₹${invoice.amount?.toLocaleString('en-IN') || 0}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="total">
          Total Amount: ₹${invoice.amount?.toLocaleString('en-IN') || 0}
        </div>
        
        <div class="footer">
          Thank you for your business!<br>
          For any queries, contact support@techhansha.com
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(invoiceHtml);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

export const printReport = (reportTitle, data) => {
  const reportHtml = `
    <html>
      <head>
        <title>${reportTitle}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8fafc; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${reportTitle}</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              ${Object.keys(data[0] || {}).map(key => `<th>${key}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(row => `
              <tr>
                ${Object.values(row).map(val => `<td>${val}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(reportHtml);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};
