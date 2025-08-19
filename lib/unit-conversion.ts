import { showToast } from "@/components/utils/show-toast";
import { ConvertOptionsProps, ToastType, UnitType } from "@/types";

// Base peso = Kg, base volume = L
const unitConversionFactors: Record<UnitType, number> = {
  [UnitType.KG]: 1,
  [UnitType.G]: 0.001,
  // [UnitType.T]: 1000,
  [UnitType.L]: 1,
  // [UnitType.ML]: 0.001,
  [UnitType.UN]: 1,
};

export function convertUnit(
  value: number,
  from: UnitType,
  to: UnitType,
  unitWeightOrOptions?: number | ConvertOptionsProps,
  unitWeightUnitArg?: UnitType
): number {
  const options: ConvertOptionsProps =
    typeof unitWeightOrOptions === "number"
      ? { unitWeight: unitWeightOrOptions, unitWeightUnit: unitWeightUnitArg }
      : unitWeightOrOptions || {};

  const factor = (u: UnitType): number => {
    if (!(u in unitConversionFactors)) {
      const allowed = Object.keys(unitConversionFactors).join(", ");
      throw new Error(
        `Unidade "${String(u)}" não configurada na unitConversionFactors. Unidades disponíveis: ${allowed}`
      );
    }
    return unitConversionFactors[u];
  };

  if (from === to) return value;

  const unitWeightInBase = (): number => {
    if (options.unitWeight == null || options.unitWeightUnit == null) {
      throw new Error(
        "Para converter a/para 'UN' é necessário informar unitWeight e unitWeightUnit (ex: 250, UnitType.G)."
      );
    }
    return options.unitWeight * factor(options.unitWeightUnit);
  };

  let baseValue: number;
  if (from === UnitType.UN) {
    baseValue = value * unitWeightInBase();
  } else {
    baseValue = value * factor(from);
  }

  let result: number;
  if (to === UnitType.UN) {
    result = baseValue / unitWeightInBase();
  } else {
    result = baseValue / factor(to);
  }

  // Formata o result caso o valor passado para decimals seja diferente de null
  if (options.decimals != null) {
    const p = Math.pow(10, options.decimals);
    return Math.round(result * p) / p;
  }

  return result;
}

/**
 * Normaliza uma quantidade para { weight (kg), volume (L), units (contagem) }.
 *
 * - Se a unidade é KG/G -> retorna weight em KG.
 * - Se a unidade é L -> retorna volume em L.
 * - Se a unidade é UN -> tenta usar unitWeight + unitWeightUnit para derivar weight (kg) ou volume (L).
 *   Se unitWeight não informado, retorna units = quantity.
 *
 * @param quantity quantidade bruta
 * @param unit unidade da quantidade (UnitType)
 * @param unitWeight opcional: peso/volume por unidade (ex: 250)
 * @param unitWeightUnit opcional: unidade do unitWeight (ex: UnitType.G, UnitType.KG, UnitType.L)
 * @param decimals opcional: casas decimais para arredondamento (aplicado apenas nas conversões)
 */
export function normalizeValue(
  quantity: number,
  unit: UnitType,
  unitWeight?: number,
  unitWeightUnit?: UnitType,
  decimals?: number
): { weight: number; volume: number; units: number } {
  let weight = 0;
  let volume = 0;
  let units = 0;

  if (unit === UnitType.KG) {
    weight = quantity; // Sem arredondamento direto
  } else if (unit === UnitType.G) {
    // Usa convertUnit para conversão com possível arredondamento
    weight = convertUnit(quantity, UnitType.G, UnitType.KG, { decimals });
  } else if (unit === UnitType.L) {
    volume = quantity; // Sem arredondamento direto
  } else if (unit === UnitType.UN) {
    if (unitWeight == null || unitWeightUnit == null || unitWeight === 0) {
      units = quantity; // Sem arredondamento direto
    } else {
      // Usa convertUnit para todas as conversões de UN
      if (unitWeightUnit === UnitType.G || unitWeightUnit === UnitType.KG) {
        weight = convertUnit(quantity, UnitType.UN, UnitType.KG, {
          unitWeight,
          unitWeightUnit,
          decimals,
        });
      } else if (unitWeightUnit === UnitType.L) {
        volume = convertUnit(quantity, UnitType.UN, UnitType.L, {
          unitWeight,
          unitWeightUnit,
          decimals,
        });
      } else {
        // Fallback sem conversão (unidades não suportadas)
        weight = quantity * unitWeight; // Sem arredondamento direto
      }
    }
  } else {
    try {
      weight = convertUnit(quantity, unit, UnitType.KG, { decimals });
    } catch {
      try {
        volume = convertUnit(quantity, unit, UnitType.L, { decimals });
      } catch {
        showToast({
          title: "Erro! Não foi possível converter a quantidade.",
          description: "Verifique a unidade de medida.",
          type: ToastType.ERROR,
        });
      }
    }
  }

  return { weight, volume, units };
}