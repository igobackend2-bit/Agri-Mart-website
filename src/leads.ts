// ─────────────────────────────────────────────────────────────────────────────
// Visitor Leads engine (mirrors igonursery.com /admin-visitor-leads)
// Every enquiry made on the storefront (contact form, farm-loan pre-qual,
// expert-service requests, etc.) is captured here and shown in the
// Admin → Visitor Leads tab with status tracking and CSV export.
// Leads are stored locally AND best-effort synced to Firestore so they
// survive across devices.
// ─────────────────────────────────────────────────────────────────────────────
import { db } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

export type LeadSource =
  | 'Contact Form'
  | 'Farm Loan'
  | 'Expert Service'
  | 'Partner Enquiry'
  | 'Newsletter'
  | 'Other';

export type LeadStatus = 'New' | 'Contacted' | 'Converted' | 'Closed';

export interface VisitorLead {
  id: string;
  createdAt: string;        // ISO timestamp
  source: LeadSource;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message?: string;
  status: LeadStatus;
}

const LS_KEY = 'igo_visitor_leads';
const FS_COLLECTION = 'visitorLeads';

function readLocal(): VisitorLead[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function writeLocal(leads: VisitorLead[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(leads));
}

/** Capture a lead from any storefront form. Never throws — storefront UX first. */
export function captureLead(input: {
  source: LeadSource;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message?: string;
}): VisitorLead {
  const lead: VisitorLead = {
    id: 'lead-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    status: 'New',
    source: input.source,
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    subject: input.subject?.trim() || undefined,
    message: input.message?.trim() || undefined,
  };
  try {
    writeLocal([lead, ...readLocal()]);
  } catch { /* ignore */ }
  // Best-effort cloud sync (works when Firestore rules allow)
  try {
    setDoc(doc(db, FS_COLLECTION, lead.id), lead as any).catch(() => { /* offline/rules: ignore */ });
  } catch { /* ignore */ }
  return lead;
}

/** All leads, newest first (local + cloud merged, de-duplicated by id). */
export async function fetchAllLeads(): Promise<VisitorLead[]> {
  const map = new Map<string, VisitorLead>();
  readLocal().forEach(l => map.set(l.id, l));
  try {
    const snap = await getDocs(collection(db, FS_COLLECTION));
    snap.docs.forEach(d => {
      const l = d.data() as VisitorLead;
      if (l && l.id) map.set(l.id, { ...l, ...(map.get(l.id) || {}) });
    });
  } catch { /* cloud unavailable: local only */ }
  return Array.from(map.values()).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

export async function setLeadStatus(id: string, status: LeadStatus): Promise<void> {
  writeLocal(readLocal().map(l => l.id === id ? { ...l, status } : l));
  try { await updateDoc(doc(db, FS_COLLECTION, id), { status }); } catch { /* ignore */ }
}

export async function removeLead(id: string): Promise<void> {
  writeLocal(readLocal().filter(l => l.id !== id));
  try { await deleteDoc(doc(db, FS_COLLECTION, id)); } catch { /* ignore */ }
}

/** Build a CSV string of the given leads (Excel-compatible). */
export function leadsToCsv(leads: VisitorLead[]): string {
  const esc = (v: any) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const rows = [
    ['Date', 'Source', 'Name', 'Phone', 'Email', 'Subject', 'Message', 'Status'].join(','),
    ...leads.map(l => [
      new Date(l.createdAt).toLocaleString('en-IN'),
      l.source, l.name, l.phone, l.email || '', l.subject || '', l.message || '', l.status,
    ].map(esc).join(',')),
  ];
  return rows.join('\n');
}

export function downloadLeadsCsv(leads: VisitorLead[]): void {
  const blob = new Blob(['﻿' + leadsToCsv(leads)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'igo-agrimart-visitor-leads-' + new Date().toISOString().slice(0, 10) + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
