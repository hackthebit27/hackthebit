// lib/localUser.ts
export type UserProfile = {
  name: string;
  email: string;
  interests: string[];
  createdAt: string; // ISO
};

export type Enrollment = {
  id: string;          // course id/slug
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  enrolledAt: string;  // ISO
};

const UKEY = "htb:user";
const EKEY = "htb:enrollments";

const isBrowser = () => typeof window !== "undefined";

export function getUser(): UserProfile | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(UKEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

export function setUser(u: UserProfile) {
  if (!isBrowser()) return;
  localStorage.setItem(UKEY, JSON.stringify(u));
}

export function clearUser() {
  if (!isBrowser()) return;
  localStorage.removeItem(UKEY);
  localStorage.removeItem(EKEY);
}

export function getEnrollments(): Enrollment[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(EKEY);
  return raw ? (JSON.parse(raw) as Enrollment[]) : [];
}

export function addEnrollment(e: Enrollment) {
  if (!isBrowser()) return;
  const current = getEnrollments();
  // avoid duplicates by id
  if (!current.some((x) => x.id === e.id)) {
    localStorage.setItem(EKEY, JSON.stringify([e, ...current]));
  }
}