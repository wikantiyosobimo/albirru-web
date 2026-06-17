import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface FeatureItem {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface StatItem {
  id: string;
  icon: LucideIcon;
  value: string;
  label: string;
}

export interface UniversityItem {
  id: string;
  abbr: string;
  name: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  program: string;
}

export interface TrustItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

export interface SidebarItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  topic: string;
  color: string;
}

export interface SubjectProgress {
  id: string;
  label: string;
  value: number;
}
