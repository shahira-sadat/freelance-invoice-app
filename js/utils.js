export const uid = () => Date.now();

const LS = {
  clients: 'fi_clients',
  invoices: 'fi_invoices'
};

export const getJSON = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

export const setJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const keys = LS;

export const formatMoney = (n) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(n||0));

export const byId = (id) => document.getElementById(id);

export const setActiveNav = () => {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (location.pathname.endsWith(href)) a.classList.add('active');
  });
};

export const todayString = () => {
  const d = new Date();
  return d.toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' });
};
