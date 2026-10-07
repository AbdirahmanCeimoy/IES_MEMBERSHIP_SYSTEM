export type NavigationLayout = 'link' | 'dropdown' | 'mega';

export interface NavigationItem {
  label: string;
  href?: string;
  description?: string;
  external?: boolean;
  /** Looks like a normal link but does nothing on click (page not built yet). */
  inactive?: boolean;
  children?: NavigationItem[];
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export interface NavigationEntry {
  label: string;
  href?: string;
  layout?: NavigationLayout;
  groups?: NavigationGroup[];
  children?: NavigationItem[];
}
