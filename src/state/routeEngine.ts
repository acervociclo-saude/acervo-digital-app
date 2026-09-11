import type { RouteEntry } from './types';
import routesData from '../data/rotas.json';

export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ');
}

export function areThemeSetsEqual(setA: string[], setB: string[]): boolean {
  if (setA.length !== setB.length) return false;
  const normA = setA.map(normalizeText).sort();
  const normB = setB.map(normalizeText).sort();
  for (let i = 0; i < normA.length; i++) {
    if (normA[i] !== normB[i]) return false;
  }
  return true;
}

export function findRoute(
  estado: string,
  themes: string[],
  routes: RouteEntry[] = routesData as RouteEntry[]
): RouteEntry | null {
  if (!estado || themes.length < 1 || themes.length > 3) {
    return null;
  }

  const normEstado = estado.trim().toUpperCase();

  // Find exact matching route where normalized theme set matches
  for (const route of routes) {
    if (route.estado.trim().toUpperCase() !== normEstado) {
      continue;
    }
    if (areThemeSetsEqual(themes, route.themes)) {
      return route;
    }
  }

  return null;
}