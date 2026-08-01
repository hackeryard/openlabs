export type TitrationType = 'strong-acid-strong-base' | 'weak-acid-strong-base' | 'strong-acid-weak-base' | 'redox';
export type IndicatorType = 'phenolphthalein' | 'methyl-orange' | 'universal' | 'none';

export interface TitrationParams {
  type: TitrationType;
  titrantConcentration: number; // mol/L (C1)
  analyteVolume: number; // mL (V2)
  analyteConcentration: number; // mol/L (C2)
  pKa?: number; // For weak acids (e.g. 4.74 for Acetic Acid)
  pKb?: number; // For weak bases (e.g. 4.75 for Ammonia)
}

export interface TitrationState {
  titrantAdded: number; // mL
  pH: number;
  potential?: number; // for redox
  color: string;
  isEquivalencePoint: boolean;
  isHalfEquivalencePoint: boolean;
}

export function calculatePH(params: TitrationParams, titrantAdded: number): number {
  const { type, titrantConcentration: cT, analyteVolume: vA, analyteConcentration: cA, pKa, pKb } = params;
  
  const molesA = (cA * vA) / 1000;
  const molesT = (cT * titrantAdded) / 1000;
  const totalVolume = (vA + titrantAdded) / 1000; // in L

  if (type === 'strong-acid-strong-base') {
    if (molesA > molesT) {
      // Acid in excess
      const concH = (molesA - molesT) / totalVolume;
      return -Math.log10(concH);
    } else if (molesT > molesA) {
      // Base in excess
      const concOH = (molesT - molesA) / totalVolume;
      const pOH = -Math.log10(concOH);
      return 14 - pOH;
    } else {
      return 7.0;
    }
  } 
  else if (type === 'weak-acid-strong-base' && pKa !== undefined) {
    const ka = Math.pow(10, -pKa);
    if (titrantAdded === 0) {
      // Initial pH: weak acid only
      const concH = Math.sqrt(ka * cA);
      return -Math.log10(concH);
    } else if (molesA > molesT) {
      // Buffer region (Henderson-Hasselbalch)
      return pKa + Math.log10(molesT / (molesA - molesT));
    } else if (molesA === molesT) {
      // Equivalence point: weak conjugate base
      const concCb = molesA / totalVolume;
      const kb = 1e-14 / ka;
      const concOH = Math.sqrt(kb * concCb);
      const pOH = -Math.log10(concOH);
      return 14 - pOH;
    } else {
      // Base in excess
      const concOH = (molesT - molesA) / totalVolume;
      const pOH = -Math.log10(concOH);
      return 14 - pOH;
    }
  }
  else if (type === 'strong-acid-weak-base' && pKb !== undefined) {
    const kb = Math.pow(10, -pKb);
    if (titrantAdded === 0) {
      // Initial pH: weak base only
      const concOH = Math.sqrt(kb * cA);
      const pOH = -Math.log10(concOH);
      return 14 - pOH;
    } else if (molesA > molesT) {
      // Buffer region (Henderson-Hasselbalch)
      const pOH = pKb + Math.log10(molesT / (molesA - molesT));
      return 14 - pOH;
    } else if (molesA === molesT) {
      // Equivalence point: weak conjugate acid
      const concCa = molesA / totalVolume;
      const ka = 1e-14 / kb;
      const concH = Math.sqrt(ka * concCa);
      return -Math.log10(concH);
    } else {
      // Acid in excess
      const concH = (molesT - molesA) / totalVolume;
      return -Math.log10(concH);
    }
  }

  return 7.0;
}

export function calculatePotential(params: TitrationParams, titrantAdded: number): number {
  // Simple approximation for KMnO4 + FeSO4 redox potential curve
  const { titrantConcentration: cT, analyteVolume: vA, analyteConcentration: cA } = params;
  const eqVolume = (cA * vA * 5) / cT; // 5 moles of Fe2+ per mole of MnO4-
  
  if (titrantAdded === 0) return 0.77; // Fe3+/Fe2+ standard approx
  if (titrantAdded < eqVolume) {
    const ratio = titrantAdded / (eqVolume - titrantAdded);
    if (ratio <= 0) return 0.77;
    return 0.77 + 0.059 * Math.log10(ratio);
  } else if (titrantAdded === eqVolume) {
    return (0.77 + 5 * 1.51) / 6; // Weighted average of E0
  } else {
    const ratio = (titrantAdded - eqVolume) / eqVolume;
    if (ratio <= 0) return 1.51;
    return 1.51 - 0.059/5 * Math.log10(1/ratio);
  }
}

// Indicator colors
export function getIndicatorColor(indicator: IndicatorType, pH: number, type: TitrationType, titrantAdded: number, eqVolume: number): string {
  if (type === 'redox') {
    // KMnO4 acts as its own indicator
    if (titrantAdded < eqVolume) return 'rgba(255, 255, 255, 0.1)'; // Colorless / very pale
    if (titrantAdded >= eqVolume && titrantAdded < eqVolume + 0.5) return 'rgba(200, 150, 255, 0.4)'; // Pale purple
    return 'rgba(150, 50, 200, 0.7)'; // Deep purple
  }

  if (indicator === 'phenolphthalein') {
    if (pH < 8.2) return 'rgba(255, 255, 255, 0.1)'; // Colorless
    if (pH < 10.0) return 'rgba(255, 105, 180, 0.3)'; // Pale pink
    return 'rgba(255, 20, 147, 0.6)'; // Bright pink
  }
  
  if (indicator === 'methyl-orange') {
    if (pH < 3.1) return 'rgba(255, 0, 0, 0.5)'; // Red
    if (pH < 4.4) return 'rgba(255, 140, 0, 0.5)'; // Orange
    return 'rgba(255, 215, 0, 0.5)'; // Yellow
  }

  if (indicator === 'universal') {
    if (pH < 3) return 'rgba(255, 0, 0, 0.5)'; // Red
    if (pH < 6) return 'rgba(255, 165, 0, 0.5)'; // Orange
    if (pH < 8) return 'rgba(0, 255, 0, 0.5)'; // Green
    if (pH < 11) return 'rgba(0, 0, 255, 0.5)'; // Blue
    return 'rgba(128, 0, 128, 0.5)'; // Purple
  }

  return 'rgba(255, 255, 255, 0.1)';
}
