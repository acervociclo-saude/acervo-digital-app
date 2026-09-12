import { describe, it, expect } from 'vitest';
import { normalizeText, areThemeSetsEqual, findRoute } from './routeEngine';
import routesData from '../data/rotas.json';
import type { RouteEntry } from './types';

describe('routeEngine', () => {
  it('normalizes accents, casing, and spaces', () => {
    expect(normalizeText(' Saúde ')).toBe('saude');
    expect(normalizeText('Ass.  Social')).toBe('ass. social');
  });

  it('compares theme sets independently of order', () => {
    expect(areThemeSetsEqual(['Saúde', 'SUS'], ['SUS', 'Saúde'])).toBe(true);
    expect(areThemeSetsEqual(['UBS', 'Cuidado', 'SUS'], ['SUS', 'UBS', 'Cuidado'])).toBe(true);
    expect(areThemeSetsEqual(['Saúde'], ['SUS'])).toBe(false);
  });

  it('finds valid route for single theme Saúde in MA', () => {
    const route = findRoute('MA', ['Saúde'], routesData as RouteEntry[]);
    expect(route).not.toBeNull();
    expect(route?.destinationSheet).toBe('MA_SAUDE_SUS');
  });

  it('finds valid route for 2 themes regardless of order', () => {
    const route1 = findRoute('MA', ['Saúde', 'SUS'], routesData as RouteEntry[]);
    const route2 = findRoute('MA', ['SUS', 'Saúde'], routesData as RouteEntry[]);
    expect(route1).not.toBeNull();
    expect(route2).not.toBeNull();
    expect(route1?.routeCode).toBe('MA_SAUDE_SUS');
  });

  it('finds valid route for 3 themes regardless of order', () => {
    const route = findRoute('MA', ['UBS', 'Cuidado', 'SUS'], routesData as RouteEntry[]);
    expect(route).not.toBeNull();
    expect(route?.routeCode).toBe('MA_SAUDE_SUS');
  });

  it('finds valid route for Saúde + Campanha', () => {
    const route1 = findRoute('MA', ['Saúde', 'Campanha'], routesData as RouteEntry[]);
    const route2 = findRoute('MA', ['Campanha', 'Saúde'], routesData as RouteEntry[]);
    expect(route1).not.toBeNull();
    expect(route2).not.toBeNull();
    expect(route1?.destinationSheet).toBe('MA_SAUDE_SUS');
  });

  it('rejects combinations without route in spreadsheet', () => {
    const route = findRoute('MA', ['CRAS', 'SUAS'], routesData as RouteEntry[]);
    expect(route).toBeNull();
  });

  it('rejects empty themes or more than 3 themes', () => {
    expect(findRoute('MA', [], routesData as RouteEntry[])).toBeNull();
    expect(findRoute('MA', ['Saúde', 'SUS', 'UBS', 'Cuidado'], routesData as RouteEntry[])).toBeNull();
  });
});