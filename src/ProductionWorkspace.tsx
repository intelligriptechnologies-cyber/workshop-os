import { Boxes, Building2, ChevronLeft, ChevronRight, FileText, Gauge, LogOut, Menu, Settings, ShieldCheck, UserRound, Wrench, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PRODUCTION_NAVIGATION } from "./production-navigation";
import { hasLocalSignedOut, loadProductionSession, logoutProductionSession, resumeLocalSession, type ProductionSession } from "./production-session";
import "./production-workspace.css";

const groups = [
  { label: "Workshop", icon: <Wrench size={17}/>, routes: ["/production/jobs","/production/work-items","/production/media","/production/estimates","/production/tasks","/production/qc","/production/billing"] },
  { label: "Records", icon: <FileText size={17}/>, routes: ["/production/customers","/production/vehicles"] },
  { label: "Operations", icon: <Boxes size={17}/>, routes: ["/production/inventory","/production/materials","/production/appointments","/production/follow-ups","/production/action-inbox"] },
  { label: "Administration", icon: <Settings size={17}/>, routes: ["/production/users","/production/roles","/production/settings","/production/reports","/production/masters","/production/data-flow","/production/search"] },
];
const COLLAPSE_KEY = "workshopos.production.sidebar-collapsed.v1";
const listRoutes = new Set(["/production/jobs", "/production/customers", "/production/vehicles", "/production/work-items", "/production/inventory", "/production/materials", "/production/appointments", "/production/follow-ups", "/production/action-inbox"]);

export function ProductionWorkspace({ children }: { children: ReactNode }) {
  const [production,setProduction]=useState<ProductionSession>(),[error,setError]=useState(""),[signedOut,setSignedOut]=useState(hasLocalSignedOut),[collapsed,setCollapsed]=useState(()=>localStorage.getItem(COLLAPSE_KEY)==="true"),[drawerOpen,setDrawerOpen]=useState(false);
  const trigger=useRef<HTMLButtonElement>(null);
  useEffect(()=>{if(signedOut)return;let current=true;void loadProductionSession().then(value=>{if(current)setProduction(value)}).catch(value=>{if(current)setError(value instanceof Error?value.message:"Session unavailable")});return()=>{current=false}},[signedOut]);
  useEffect(()=>{if(!drawerOpen)return;const close=(event:KeyboardEvent)=>{if(event.key==="Escape"){setDrawerOpen(false);requestAnimationFrame(()=>trigger.current?.focus())}};document.addEventListener("keydown",close);return()=>document.removeEventListener("keydown",close)},[drawerOpen]);
  const toggle=()=>setCollapsed(value=>{localStorage.setItem(COLLAPSE_KEY,String(!value));return !value});
  const logout=()=>{if(!production)return;logoutProductionSession(production.auth);if(production.auth.mode==="local"){setProduction(undefined);setSignedOut(true);setDrawerOpen(false)}};
  if(signedOut)return <main className="ws-session-state"><ShieldCheck/><h1>Signed out of WorkshopOS</h1><p>Your local production session has ended.</p><button onClick={()=>{resumeLocalSession();setSignedOut(false)}}>Return to local sign in</button></main>;
  if(error)return <main className="ws-session-state"><h1>WorkshopOS</h1><p role="alert">{error}</p></main>;
  if(!production)return <main className="ws-session-state"><p>Loading WorkshopOS…</p></main>;
  const {membership,tenant}=production.session,granted=new Set(membership.permissions),overview=location.pathname==="/"||location.pathname==="/production";
  return <div className={`ws-workspace${collapsed?" is-collapsed":""}${drawerOpen?" drawer-open":""}`} data-ui-system="workshopos" data-list-workspace={listRoutes.has(location.pathname) || undefined}>
    <header className="ws-mobile-header"><button ref={trigger} className="ws-icon-button" aria-label="Open navigation" aria-expanded={drawerOpen} aria-controls="workshop-navigation" onClick={()=>setDrawerOpen(true)}><Menu/></button><a className="ws-mobile-brand" href="/"><Building2/><span>WorkshopOS</span></a><span className="ws-mobile-avatar"><UserRound/></span></header>
    <button className="ws-drawer-scrim" aria-label="Close navigation" onClick={()=>setDrawerOpen(false)}/>
    <aside className="ws-sidebar" aria-label="Workshop workspace"><div className="ws-brand"><Building2 size={30}/><span><strong>WorkshopOS</strong><small>Workshop Management. Simplified.</small></span></div><button className="ws-drawer-close ws-icon-button" aria-label="Close navigation" onClick={()=>{setDrawerOpen(false);requestAnimationFrame(()=>trigger.current?.focus())}}><X/></button>
      <nav id="workshop-navigation" aria-label="Workshop navigation"><a href="/" className={overview?"active":""} aria-current={overview?"page":undefined} title="Overview"><Gauge size={18}/><span>Overview</span></a>{groups.map(group=>{const items=PRODUCTION_NAVIGATION.filter(item=>group.routes.includes(item.href)&&granted.has(item.permission));return items.length?<section className="ws-nav-group" aria-labelledby={`nav-${group.label}`} key={group.label}><h2 id={`nav-${group.label}`}>{group.icon}<span>{group.label}</span></h2>{items.map(item=>{const active=location.pathname===item.href;return <a href={item.href} key={item.href} className={active?"active":""} aria-current={active?"page":undefined} title={item.label} onClick={()=>setDrawerOpen(false)}><span>{item.label}</span></a>})}</section>:null})}</nav>
      <button className="ws-collapse" onClick={toggle} aria-label={collapsed?"Expand navigation":"Collapse navigation"}>{collapsed?<ChevronRight/>:<ChevronLeft/>}<span>Collapse</span></button></aside>
    <div className="ws-stage"><header className="ws-account-header"><div><strong>{tenant?.name||"WorkshopOS"}</strong><span>Production workspace</span></div><div className="ws-account"><span className="ws-account-avatar"><UserRound/></span><span><strong>{membership.displayName||"Authenticated member"}</strong><small>{membership.email||"Production account"}</small></span><button onClick={logout}><LogOut size={17}/>Logout</button></div></header><div className="ws-route-content">{children}</div></div>
  </div>;
}
