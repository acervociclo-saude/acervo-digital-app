import { describe, it, expect } from 'vitest';
import { findRoute, getAllRoutesForState } from './routeEngine';
import maPsData from '../data/ma_protecao_social.json';
import paPsData from '../data/pa_protecao_social.json';
import mgPsData from '../data/mg_protecao_social.json';
import maSaudeData from '../data/ma_saude_sus.json';

describe('Proteção Social - Test Suite (MA, PA, MG)', () => {
  it('loads exactly 7 unique topics for each Proteção Social dataset', () => {
    [maPsData, paPsData, mgPsData].forEach((dataset) => {
      expect(dataset).toHaveLength(7);
      const numbers = dataset.map((t) => t.numero);
      expect(new Set(numbers).size).toBe(7);
    });
  });

  it('verifies all 7 topics across all 3 states have valid Google Drive URLs', () => {
    [maPsData, paPsData, mgPsData].forEach((dataset) => {
      dataset.forEach((topic) => {
        expect(topic.linkDrive).toMatch(/^https:\/\/drive\.google\.com\/drive\/(u\/\d+\/)?folders\//);
        expect(topic.tema.length).toBeGreaterThan(0);
      });
    });
  });

  it('guarantees complete isolation between MA, PA, MG and Saúde Drive links', () => {
    const maPsLinks = new Set(maPsData.map((t) => t.linkDrive));
    const paPsLinks = new Set(paPsData.map((t) => t.linkDrive));
    const mgPsLinks = new Set(mgPsData.map((t) => t.linkDrive));
    const saudeLinks = new Set(maSaudeData.map((t) => t.linkDrive));

    // No overlap between any PS datasets
    maPsData.forEach((t) => {
      expect(paPsLinks.has(t.linkDrive)).toBe(false);
      expect(mgPsLinks.has(t.linkDrive)).toBe(false);
      expect(saudeLinks.has(t.linkDrive)).toBe(false);
    });

    paPsData.forEach((t) => {
      expect(maPsLinks.has(t.linkDrive)).toBe(false);
      expect(mgPsLinks.has(t.linkDrive)).toBe(false);
      expect(saudeLinks.has(t.linkDrive)).toBe(false);
    });
  });

  it('retrieves exactly 14 Proteção Social routes per state', () => {
    ['MA', 'PA', 'MG'].forEach((state) => {
      const psRoutes = getAllRoutesForState(state).filter((r) => r.routeCode.includes('PROT_SOCIAL'));
      expect(psRoutes).toHaveLength(14);
    });
  });

  it('resolves 1-theme, 2-theme and 3-theme routes for Proteção Social in MA, PA, MG', () => {
    ['MA', 'PA', 'MG'].forEach((state) => {
      const code = state + '_PROT_SOCIAL';
      expect(findRoute(state, ['Proteção Social'])?.routeCode).toBe(code);
      expect(findRoute(state, ['CRAS'])?.routeCode).toBe(code);
      expect(findRoute(state, ['SUAS'])?.routeCode).toBe(code);
      expect(findRoute(state, ['Ass. Social'])?.routeCode).toBe(code);

      expect(findRoute(state, ['CRAS', 'SUAS'])?.routeCode).toBe(code);
      expect(findRoute(state, ['SUAS', 'CRAS'])?.routeCode).toBe(code);
      expect(findRoute(state, ['Proteção Social', 'CRAS', 'SUAS'])?.routeCode).toBe(code);
    });
  });

  it('rejects combinations mixing Saúde and Proteção Social themes', () => {
    ['MA', 'PA', 'MG'].forEach((state) => {
      expect(findRoute(state, ['Saúde', 'CRAS'])).toBeNull();
      expect(findRoute(state, ['SUS', 'SUAS'])).toBeNull();
      expect(findRoute(state, ['UBS', 'Ass. Social'])).toBeNull();
      expect(findRoute(state, ['Campanha', 'Proteção Social'])).toBeNull();
    });
  });
});
