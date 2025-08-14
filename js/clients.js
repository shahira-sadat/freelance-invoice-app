import { setActiveNav, byId } from './utils.js';
import { getClients, addClient, updateClient, deleteClient } from './data.js';

setActiveNav();

const tbody = byId('clientsTableBody');
const form = byId('clientForm');
const formTitle = byId('formTitle');
const clientId = byId('clientId');
const nameEl = byId('clientName');
const emailEl = byId('clientEmail');
const companyEl = byId('clientCompany');
const notesEl = byId('clientNotes');
const cancelEdit = byId('cancelEdit');
const searchEl = byId('clientSearch');
const clearSearch = byId('clearSearch');

let all = getClients();

function render(list = all){
  tbody.innerHTML = list.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.company || '-'}</td>
      <td>${c.notes || '-'}</td>
      <td>
        <button class="table-btn" data-action="edit" data-id="${c.id}">Edit</button>
        <button class="table-btn danger" data-action="delete" data-id="${c.id}">Delete</button>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="5">No clients yet. Add your first client.</td></tr>`;
}
render();

tbody.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  const action = btn.dataset.action;
  if (action === 'edit'){
    const c = all.find(x => x.id === id);
    clientId.value = String(c.id);
    nameEl.value = c.name;
    emailEl.value = c.email;
    companyEl.value = c.company || '';
    notesEl.value = c.notes || '';
    formTitle.textContent = 'Edit Client';
  } else if (action === 'delete'){
    if (confirm('Delete this client?')) {
      deleteClient(id);
      all = getClients();
      render();
    }
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  if (!name || !email){
    alert('Name and Email are required.');
    return;
  }
  const company = companyEl.value.trim();
  const notes = notesEl.value.trim();

  if (clientId.value){
    updateClient(Number(clientId.value), { name, email, company, notes });
  } else {
    addClient({ name, email, company, notes });
  }
  all = getClients();
  render();
  form.reset();
  clientId.value = '';
  formTitle.textContent = 'Add New Client';
});

cancelEdit.addEventListener('click', () => {
  form.reset(); clientId.value=''; formTitle.textContent='Add New Client';
});

searchEl.addEventListener('input', () => {
  const q = searchEl.value.toLowerCase();
  const filtered = all.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q) ||
    (c.company||'').toLowerCase().includes(q)
  );
  render(filtered);
});

clearSearch.addEventListener('click', () => {
  searchEl.value=''; render();
});
