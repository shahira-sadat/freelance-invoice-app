import { getJSON, setJSON, keys, uid } from './utils.js';

export const getClients = () => getJSON(keys.clients);
export const saveClients = (arr) => setJSON(keys.clients, arr);

export const addClient = (client) => {
  const all = getClients();
  const id = uid();
  all.push({ id, ...client });
  saveClients(all);
  return id;
};

export const updateClient = (id, patch) => {
  const all = getClients().map(c => c.id === id ? { ...c, ...patch } : c);
  saveClients(all);
};

export const deleteClient = (id) => {
  const all = getClients().filter(c => c.id !== id);
  saveClients(all);
};

export const findClient = (id) => getClients().find(c => c.id === id);

/* Invoices */
export const getInvoices = () => getJSON(keys.invoices);
export const saveInvoices = (arr) => setJSON(keys.invoices, arr);

export const addInvoice = (invoice) => {
  const all = getInvoices();
  const id = uid();
  all.push({ id, paid:false, ...invoice });
  saveInvoices(all);
  return id;
};

export const updateInvoice = (id, patch) => {
  const all = getInvoices().map(inv => inv.id === id ? { ...inv, ...patch } : inv);
  saveInvoices(all);
};

export const deleteInvoice = (id) => {
  const all = getInvoices().filter(inv => inv.id !== id);
  saveInvoices(all);
};
