import { describe, it, expect } from 'vitest';
import { findRoute, getAllRoutesForState } from './routeEngine';
import paSaudeSusData from '../data/pa_saude_sus.json';
import maSaudeSusData from '../data/ma_saude_sus.json';

describe('Pará (PA) - Route Engine & Data Isolation Suite', () => {
  it('loads exactly 13 unique topics for Pará Saúde SUS', () => {
    expect(paSaudeSusData).toHaveLength(13);
    const numbers = paSaudeSusData.map((t) => t.numero);
    const uniqueNumbers = new Set(numbers);
    expect(uniqueNumbers.size).toBe(13);
  });

  it('verifies all 13 Pará topics have valid Google Drive URLs', () => {
    paSaudeSusData.forEach((topic) => {
      expect(topic.linkDrive).toMatch(/^https:\/\/drive\.google\.com\/drive\/(u\/\d+\/)?folders\//);
      expect(topic.tema.length).toBeGreaterThan(0);
    });
  });

  it('guarantees complete isolation between Pará and Maranhão Drive links', () => {
    const maLinks = new Set(maSaudeSusData.map((t) => t.linkDrive));
    paSaudeSusData.forEach((paTopic) => {
      // Pará links must NEVER point to any Maranhão Drive folder
      expect(maLinks.has(paTopic.linkDrive)).toBe(false);
    });
  });

  it('retrieves all routes registered for Pará', () => {
    const paRoutes = getAllRoutesForState('PA');
    expect(paRoutes).toHaveLength(39);
    paRoutes.forEach((route) => {
      expect(route.estado).toBe('PA');
      expect(['PA_SAUDE_SUS', 'PA_PROT_SOCIAL']).toContain(route.routeCode);
    });
  });

  it('resolves 1-theme routes for Pará correctly', () => {
    expect(findRoute('PA', ['Saúde'])?.routeCode).toBe('PA_SAUDE_SUS');
    expect(findRoute('PA', ['Campanha'])?.routeCode).toBe('PA_SAUDE_SUS');
    expect(findRoute('PA', ['SUS'])?.routeCode).toBe('PA_SAUDE_SUS');
    expect(findRoute('PA', ['Cuidado'])?.routeCode).toBe('PA_SAUDE_SUS');
    expect(findRoute('PA', ['UBS'])?.routeCode).toBe('PA_SAUDE_SUS');
  });

  it('resolves 2-theme routes for Pará with order insensitivity', () => {
    expect(findRoute('PA', ['Saúde', 'Campanha'])?.routeCode).toBe('PA_SAUDE_SUS');
    expect(findRoute('PA', ['Campanha', 'Saúde'])?.routeCode).toBe('PA_SAUDE_SUS');

    expect(findRoute('PA', ['Saúde', 'SUS'])?.routeCode).toBe('PA_SAUDE_SUS');
    expect(findRoute('PA', ['SUS', 'Saúde'])?.routeCode).toBe('PA_SAUDE_SUS');

    expect(findRoute('PA', ['Saúde', 'Cuidado'])?.routeCode).toBe('PA_SAUDE_SUS');
    expect(findRoute('PA', ['Cuidado', 'Saúde'])?.routeCode).toBe('PA_SAUDE_SUS');

    expect(findRoute('PA', ['Cuidado', 'UBS'])?.routeCode).toBe('PA_SAUDE_SUS');
    expect(findRoute('PA', ['UBS', 'Cuidado'])?.routeCode).toBe('PA_SAUDE_SUS');
  });

  it('resolves 3-theme routes for Pará with order insensitivity', () => {
    expect(findRoute('PA', ['Saúde', 'SUS', 'UBS'])?.routeCode).toBe('PA_SAUDE_SUS');
    expect(findRoute('PA', ['UBS', 'SUS', 'Saúde'])?.routeCode).toBe('PA_SAUDE_SUS');

    expect(findRoute('PA', ['Saúde', 'Campanha', 'Cuidado'])?.routeCode).toBe('PA_SAUDE_SUS');
    expect(findRoute('PA', ['Cuidado', 'Campanha', 'Saúde'])?.routeCode).toBe('PA_SAUDE_SUS');

    expect(findRoute('PA', ['UBS', 'Cuidado', 'SUS'])?.routeCode).toBe('PA_SAUDE_SUS');
    expect(findRoute('PA', ['Saúde', 'Campanha', 'SUS'])?.routeCode).toBe('PA_SAUDE_SUS');
    expect(findRoute('PA', ['Saúde', 'Campanha', 'UBS'])?.routeCode).toBe('PA_SAUDE_SUS');
  });

  it('resolves Proteção Social themes in Pará', () => {
    expect(findRoute('PA', ['CRAS'])?.routeCode).toBe('PA_PROT_SOCIAL');
    expect(findRoute('PA', ['SUAS'])?.routeCode).toBe('PA_PROT_SOCIAL');
    expect(findRoute('PA', ['Proteção Social'])?.routeCode).toBe('PA_PROT_SOCIAL');
  });

  it('returns null for mixed themes or invalid combinations in Pará', () => {
    expect(findRoute('PA', ['Saúde', 'CRAS'])).toBeNull();
    expect(findRoute('PA', ['UBS', 'SUAS'])).toBeNull();
    expect(findRoute('PA', ['TemaInexistente'])).toBeNull();
  });
});
