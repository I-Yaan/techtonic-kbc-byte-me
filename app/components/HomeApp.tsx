"use client";

import { useState } from "react";
import { ArrowUpRight, Bell, Landmark, MoreHorizontal, PiggyBank, TrendingUp } from "lucide-react";
import { CUSTOMER } from "@/lib/customer";

type Notification = {
  id: string;
  title: string;
  detail: string;
  date: string;
  category: string;
  tone: "blue" | "yellow" | "green";
  icon: typeof TrendingUp;
  amount?: string;
  description: string;
  options: string[];
};

type View = "notifications" | "situation";

const PATRIMONY = [
  { month: "Oct", value: 18.4 },
  { month: "Nov", value: 19.1 },
  { month: "Dec", value: 19.8 },
  { month: "Jan", value: 20.2 },
  { month: "Feb", value: 21.0 },
  { month: "Mar", value: 21.8 },
  { month: "Apr", value: 22.4 },
  { month: "May", value: 23.1 },
  { month: "Jun", value: 23.8 },
  { month: "Jul", value: 24.4 },
  { month: "Aug", value: 25.0 },
  { month: "Sep", value: 25.7 },
];

const EXPENSES = [
  { label: "Housing", value: 42, color: "#0057b8" },
  { label: "Daily life", value: 25, color: "#49a078" },
  { label: "Mobility", value: 18, color: "#f5c842" },
  { label: "Leisure", value: 15, color: "#9aaabd" },
];

const NOTIFICATIONS: Notification[] = [
  {
    id: "bike",
    title: "Bike purchase detected",
    detail: "A new bike purchase was spotted",
    date: "Today",
    category: "Purchase",
    tone: "blue",
    icon: PiggyBank,
    amount: "€1,240",
    description: "We noticed a recent bike purchase. Protect it from theft, damage and unexpected repair costs with the right cover.",
    options: ["Explore bike insurance", "See my existing coverage"],
  },
  {
    id: "car",
    title: "Time for a new car?",
    detail: "Your current car may be ready for an upgrade",
    date: "Yesterday",
    category: "Mobility",
    tone: "green",
    icon: Landmark,
    amount: "Your next big decision",
    description: "Your mobility costs and recent account activity suggest it may be time to think about your next car, before the decision becomes urgent.",
    options: ["Get support buying a new car", "Compare financing options"],
  },
  {
    id: "fuel",
    title: "Frequent fuel purchases",
    detail: "Your fuel spending is becoming a pattern",
    date: "5 days ago",
    category: "Mobility",
    tone: "blue",
    icon: TrendingUp,
    amount: "€186 / month",
    description: "You have made frequent fuel purchases recently. An electric car could change your monthly running costs, but the right choice depends on charging, distance and purchase price.",
    options: ["Discover electric car options", "Compare electric vs petrol costs", "See my fuel spending"],
  },
];

export default function HomeApp() {
  const [view, setView] = useState<View>("notifications");
  const [selectedId, setSelectedId] = useState(NOTIFICATIONS[0].id);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const selected = NOTIFICATIONS.find((notification) => notification.id === selectedId) ?? NOTIFICATIONS[0];
  const SelectedIcon = selected.icon;

  function selectNotification(id: string) {
    setSelectedId(id);
    setSelectedOption(null);
    window.setTimeout(() => {
      document.getElementById("notification-detail")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 0);
  }

  return (
    <div className="tx-shell tx-notification-shell">
      <aside className="tx-notification-sidebar">
        <div className="tx-notification-brand"><span className="tx-kbc-mark">K</span><strong>KBC</strong></div>
        <div className="tx-sidebar-profile"><span className="tx-avatar">SD</span><span><strong>{CUSTOMER.name}</strong><small>Personal view</small></span><MoreHorizontal size={17} /></div>
        <nav className="tx-notification-nav" aria-label="Main navigation">
          <button className={view === "notifications" ? "tx-nav-active" : ""} type="button" onClick={() => setView("notifications")}><Bell size={17} /><span>Notifications</span><b>3</b></button>
          <button className={view === "situation" ? "tx-nav-active" : ""} type="button" onClick={() => setView("situation")}><TrendingUp size={17} /><span>My situation</span></button>
        </nav>
        <div className="tx-sidebar-footer"><span className="tx-live"><i /> Live analysis</span><small>Last updated<br />September 30, 2026, 09:42</small></div>
      </aside>

      <main className="tx-notification-main">
        {view === "notifications" ? <>
          <header className="tx-notification-header"><div><p className="tx-notification-eyebrow">Notification centre</p><h1>The signals that matter.</h1><p>We noticed a few changes in your financial life.</p></div><button type="button" className="tx-icon-button" aria-label="Notifications" onClick={() => setView("notifications")}><Bell size={19} /></button></header>
          <div className="tx-notification-layout">
          <section className="tx-notification-list" aria-label="Financial notifications">
            <div className="tx-list-header"><strong>Recent</strong><span>3 signals</span></div>
            {NOTIFICATIONS.map((notification) => {
              const Icon = notification.icon;
              return <button key={notification.id} type="button" aria-pressed={selected.id === notification.id} className={`tx-notification-item ${selected.id === notification.id ? "tx-notification-item-selected" : ""}`} onClick={() => selectNotification(notification.id)}><span className={`tx-notification-icon tx-tone-${notification.tone}`}><Icon size={18} /></span><span className="tx-notification-copy"><strong>{notification.title}</strong><small>{notification.detail}</small><em>{notification.date}</em></span><ArrowUpRight size={16} className="tx-notification-arrow" /></button>;
            })}
          </section>
          <section id="notification-detail" className={`tx-notification-detail tx-detail-${selected.tone}`} aria-live="polite"><div className="tx-detail-top"><span className={`tx-notification-icon tx-tone-${selected.tone}`}><SelectedIcon size={21} /></span><span>{selected.category}</span><small>{selected.date}</small></div><h2>{selected.title}</h2><p>{selected.description}</p><div className="tx-detail-amount"><small>Detected value</small><strong>{selected.amount}</strong></div><div className="tx-detail-options"><small>What would you like to do?</small>{selected.options.map((option) => <button key={option} type="button" className={`tx-detail-action ${selectedOption === option ? "tx-detail-action-selected" : ""}`} onClick={() => setSelectedOption(option)}>{selectedOption === option ? "Selected — we'll prepare this" : option}<ArrowUpRight size={16} /></button>)}</div></section>
          </div>
        </> : <SituationView />}
        <footer className="tx-notification-footer"><span>Analysis based on your KBC account activity</span><span>Private · For your eyes only</span></footer>
      </main>
    </div>
  );
}

function SituationView() {
  const points = PATRIMONY.map((point, index) => `${index * 33.5},${150 - ((point.value - 18) / 8) * 112}`).join(" ");

  return (
    <>
      <header className="tx-notification-header"><div><p className="tx-notification-eyebrow">My situation</p><h1>Your financial year at a glance.</h1><p>See how your wealth and spending have evolved over the last 12 months.</p></div><button type="button" className="tx-icon-button" aria-label="Open notifications"><Bell size={19} /></button></header>
      <div className="tx-situation-summary"><div><small>Current net worth</small><strong>€25,700</strong></div><div><small>Growth this year</small><strong className="tx-positive">+€7,300</strong></div><div><small>Safety buffer</small><strong>189%</strong></div></div>
      <div className="tx-chart-grid">
        <section className="tx-data-card tx-patrimony-card"><div className="tx-data-card-head"><div><p className="tx-notification-eyebrow">Patrimony</p><h2>Growing steadily</h2></div><span className="tx-chart-period">Last 12 months</span></div><div className="tx-chart-value"><strong>€25.7k</strong><span>+39.7% since October</span></div><div className="tx-line-chart"><svg viewBox="0 0 368 180" role="img" aria-label="Patrimony growth over the last 12 months"><path className="tx-chart-area" d={`M 0 150 L ${points} L 368 150 Z`} /><polyline points={points} fill="none" /></svg><div className="tx-chart-labels">{PATRIMONY.filter((_, index) => index % 3 === 0).map((point) => <span key={point.month}>{point.month}</span>)}</div></div></section>
        <section className="tx-data-card"><div className="tx-data-card-head"><div><p className="tx-notification-eyebrow">Expenses</p><h2>Where your money goes</h2></div><span className="tx-chart-period">This month</span></div><div className="tx-pie-layout"><div className="tx-pie-chart" aria-label="Expense distribution pie chart" /><ul className="tx-pie-legend">{EXPENSES.map((expense) => <li key={expense.label}><i style={{ background: expense.color }} /><span>{expense.label}</span><strong>{expense.value}%</strong></li>)}</ul></div><p className="tx-chart-note">Mobility is your fastest-growing category this month.</p></section>
      </div>
    </>
  );
}
