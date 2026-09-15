import { describe, it, expect } from 'vitest';
import { findRoute, getAllRoutesForState } from './routeEngine';
import mgSaudeSusData from '../data/mg_saude_sus.json';
import maSaudeSusData from '../data/ma_saude_sus.json';
import paSaudeSusData from '../data/pa_saude_sus.json';

describe('Minas Gerais (MG) - Saúde SUS Test Suite', () => {
  it('loads exactly 13 unique topics for Minas Gerais Saúde SUS', () => {
    expect(mgSaudeSusData).toHaveLength(13);
    const numbers = mgSaudeSusData.map((t) => t.numero);
    const uniqueNumbers = new Set(numbers);
    expect(uniqueNumbers.size).toBe(13);
  });

  it('verifies all 13 MG topics have valid Google Drive URLs', () => {
    mgSaudeSusData.forEach((topic) => {
      expect(topic.linkDrive).toMatch(/^https:\/\/drive\.google\.com\/drive\/(u\/\d+\/)?folders\//);
      expect(topic.tema.length).toBeGreaterThan(0);
    });
  });

  it('guarantees complete isolation between MG, PA, and MA Drive links', () => {
    const maLinks = new Set(maSaudeSusData.map((t) => t.linkDrive));
    const paLinks = new Set(paSaudeSusData.map((t) => t.linkDrive));

    mgSaudeSusData.forEach((mgTopic) => {
      expect(maLinks.has(mgTopic.linkDrive)).toBe(false);
      expect(paLinks.has(mgTopic.linkDrive)).toBe(false);
    });
  });

  it('retrieves all routes registered for Minas Gerais', () => {
    const mgRoutes = getAllRoutesForState('MG');
    expect(mgRoutes).toHaveLength(39); // 25 Saude + 14 Protecao Social
    const mgSaudeRoutes = mgRoutes.filter((r) => r.routeCode === 'MG_SAUDE_SUS');
    expect(mgSaudeRoutes).toHaveLength(25);
  });

  it('resolves 1-theme routes for MG Saúde correctly', () => {
    expect(findRoute('MG', ['Saúde'])?.routeCode).toBe('MG_SAUDE_SUS');
    expect(findRoute('MG', ['Campanha'])?.routeCode).toBe('MG_SAUDE_SUS');
    expect(findRoute('MG', ['SUS'])?.routeCode).toBe('MG_SAUDE_SUS');
    expect(findRoute('MG', ['Cuidado'])?.routeCode).toBe('MG_SAUDE_SUS');
    expect(findRoute('MG', ['UBS'])?.routeCode).toBe('MG_SAUDE_SUS');
  });

  it('resolves 2-theme and 3-theme routes for MG Saúde with order insensitivity', () => {
    expect(findRoute('MG', ['Saúde', 'Campanha'])?.routeCode).toBe('MG_SAUDE_SUS');
    expect(findRoute('MG', ['Campanha', 'Saúde'])?.routeCode).toBe('MG_SAUDE_SUS');
    expect(findRoute('MG', ['UBS', 'Cuidado', 'SUS'])?.routeCode).toBe('MG_SAUDE_SUS');
    expect(findRoute('MG', ['SUS', 'UBS', 'Cuidado'])?.routeCode).toBe('MG_SAUDE_SUS');
  });
});
