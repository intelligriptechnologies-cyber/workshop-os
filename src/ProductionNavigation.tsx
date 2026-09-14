import { permittedProductionNavigation } from "./production-navigation";

export function ProductionNavigation({ permissions }: { permissions: string[] }) {
  const items = permittedProductionNavigation(permissions);
  if (!items.length) return null;
  return <nav aria-label="Production navigation"><ul>{items.map((item) => <li key={item.href}><a href={item.href}>{item.label}</a></li>)}</ul></nav>;
}
