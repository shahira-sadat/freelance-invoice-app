import { setActiveNav, todayString, formatMoney } from './utils.js';
import { getClients, getInvoices } from './data.js';

setActiveNav();

const todayEl = document.getElementById('today');
if (todayEl) todayEl.textContent = todayString();

const clients = getClients();
const invoices = getInvoices();

const totalClients = clients.length;
const totalInvoices = invoices.length;
const totalValue = invoices.reduce((sum, i) => sum + Number(i.amount || 0), 0);
const paidCount = invoices.filter(i => i.paid).length;
const unpaidCount = totalInvoices - paidCount;

const el = (id) => document.getElementById(id);
if (el('totalClients')) el('totalClients').textContent = totalClients;
if (el('totalInvoices')) el('totalInvoices').textContent = totalInvoices;
if (el('totalValue')) el('totalValue').textContent = formatMoney(totalValue);
if (el('paidCount')) el('paidCount').textContent = paidCount;
if (el('unpaidCount')) el('unpaidCount').textContent = unpaidCount;

const recentBody = document.getElementById('recentInvoices');
if (recentBody) {
  const recent = invoices.slice(-5).reverse();
  recentBody.innerHTML = recent.map(inv => {
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
    </tr>`;
  }).join('') || `<tr><td colspan="5">No invoices yet.</td></tr>`;
}

async function loadQuote(){
  try{
    const res = await fetch('./data/quotes.json');
    const quotes = await res.json();
    const q = quotes[Math.floor(Math.random()*quotes.length)];
    document.getElementById('quoteText').textContent = `"${q.text}"`;
    document.getElementById('quoteAuthor').textContent = `— ${q.author || 'Unknown'}`;
  }catch(err){
    document.getElementById('quoteText').textContent = 'Keep going. You are doing great!';
    document.getElementById('quoteAuthor').textContent = '— Unknown';
  }
}
if (document.getElementById('quoteText')) loadQuote();
