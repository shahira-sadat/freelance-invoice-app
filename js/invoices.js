import { setActiveNav, byId, formatMoney } from './utils.js';
import { getClients, getInvoices, addInvoice, deleteInvoice, updateInvoice } from './data.js';

setActiveNav();

const form = byId('invoiceForm');
const clientSel = byId('invoiceClient');
const titleEl = byId('invoiceTitle');
const descEl = byId('invoiceDesc');
const amountEl = byId('invoiceAmount');
const dateEl = byId('invoiceDate');
const tbody = byId('invoicesTableBody');
const statusFilter = byId('statusFilter');

let clients = getClients();
let invoices = getInvoices();

function loadClientsIntoSelect(){
  clientSel.innerHTML = '';
  if (clients.length === 0){
    clientSel.innerHTML = `<option value="">No clients yet</option>`;
    clientSel.disabled = true;
  } else {
    clientSel.disabled = false;
    clientSel.innerHTML = clients.map(c => `<option value="${c.id}">${c.name} ${c.company ? '— '+c.company : ''}</option>`).join('');
  }
}
loadClientsIntoSelect();

function render(list = invoices){
  const filt = statusFilter.value;
  const filtered = list.filter(inv => {
    if (filt === 'paid') return inv.paid;
    if (filt === 'unpaid') return !inv.paid;
    return true;
  });

  tbody.innerHTML = filtered.map(inv => {
    const client = clients.find(c => c.id === inv.clientId);
    const name = client ? client.name : 'Unknown';
    const statusClass = inv.paid ? 'status-paid' : 'status-unpaid';
    const statusText = inv.paid ? 'Paid' : 'Unpaid';
    return `<tr>
      <td>${name}</td>
      <td>${inv.title}</td>
      <td>${inv.date}</td>
      <td>${formatMoney(inv.amount)}</td>
      <td><span class="status-pill ${statusClass}">${statusText}</span></td>
      <td>
        <button class="table-btn success" data-action="toggle" data-id="${inv.id}">${inv.paid ? 'Mark Unpaid' : 'Mark Paid'}</button>
        <button class="table-btn danger" data-action="delete" data-id="${inv.id}">Delete</button>
      </td>
    </tr>`;
  }).join('') || `<tr><td colspan="6">No invoices yet.</td></tr>`;
}
render();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const clientId = Number(clientSel.value);
  const title = titleEl.value.trim();
  const amount = Number(amountEl.value);
  const date = dateEl.value;
  if (!clientId || !title || !amount || !date){
    alert('Please fill in all required fields.');
    return;
  }
  addInvoice({ clientId, title, description: descEl.value.trim(), amount, date });
  invoices = getInvoices();
  render();
  form.reset();
});

tbody.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;
  if (action === 'delete'){
    if (confirm('Delete this invoice?')){
      deleteInvoice(id);
      invoices = getInvoices();
      render();
    }
  } else if (action === 'toggle'){
    const inv = invoices.find(i => i.id === id);
    updateInvoice(id, { paid: !inv.paid });
    invoices = getInvoices();
    render();
  }
});

statusFilter.addEventListener('change', () => render());
