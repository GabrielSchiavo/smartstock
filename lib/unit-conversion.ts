import { showToast } from "@/components/utils/show-toast";
import { ToastType, UnitType } from "@/types";

// Base peso = Kg, base volume = L
const unitConversionFactors: Record<UnitType, number> = {
  [UnitType.KG]: 1,
  [UnitType.G]: 0.001,
  // [UnitType.T]: 1000,
  [UnitType.L]: 1,
  // [UnitType.ML]: 0.001,
  [UnitType.UN]: 1,
};

type ConvertOptions = {
  unitWeight?: number;
  unitWeightUnit?: UnitType;
  decimals?: number;
};

export function convertUnit(
  value: number,
  from: UnitType,
  to: UnitType,
  unitWeightOrOptions?: number | ConvertOptions,
  unitWeightUnitArg?: UnitType
): number {
  const options: ConvertOptions =
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
 * @param decimals opcional: casas decimais para arredondamento (passa para convertUnit e aplica também a multiplicações diretas)
 */
export function normalizeQuantity(
  quantity: number,
  unit: UnitType,
  unitWeight?: number,
  unitWeightUnit?: UnitType,
  decimals?: number
): { weight: number; volume: number; units: number } {
  let weight = 0;
  let volume = 0;
  let units = 0;

  const roundIf = (v: number): number => {
    if (decimals == null) return v;
    const p = Math.pow(10, decimals);
    return Math.round(v * p) / p;
  };

  if (unit === UnitType.KG) {
    weight = roundIf(quantity);
  } else if (unit === UnitType.G) {
    // converte g -> kg
    weight = convertUnit(quantity, UnitType.G, UnitType.KG, { decimals });
  } else if (unit === UnitType.L) {
    volume = roundIf(quantity);
  } else if (unit === UnitType.UN) {
    // se não informou unitWeight => só sabemos a contagem
    if (unitWeight == null || unitWeightUnit == null) {
      units = roundIf(quantity);
    } else {
      // se unitWeightUnit for massa (G/KG) -> produz weight em KG
      if (unitWeightUnit === UnitType.G || unitWeightUnit === UnitType.KG) {
        weight = convertUnit(quantity, UnitType.UN, UnitType.KG, {
          unitWeight,
          unitWeightUnit,
          decimals,
        });
      }
      // se unitWeightUnit for volume (L / ML) -> produz volume em L
      else if (
        unitWeightUnit === UnitType.L /*|| unitWeightUnit === UnitType.ML*/
      ) {
        volume = convertUnit(quantity, UnitType.UN, UnitType.L, {
          unitWeight,
          unitWeightUnit,
          decimals,
        });
      }
      // fallback conservador: assume unitWeight já está em KG (caso raro)
      else {
        weight = roundIf(quantity * unitWeight);
      }
    }
  } else {
    // para unidades desconhecidas, tente converter diretamente se mapeadas na tabela:
    try {
      // tenta converter para kg (se fizer sentido na tabela)
      weight = convertUnit(quantity, unit, UnitType.KG, { decimals });
    } catch {
      // tenta converter para L
      try {
        volume = convertUnit(quantity, unit, UnitType.L, { decimals });
      } catch {
        weight = 0;
        volume = 0;
        units = 0;

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
