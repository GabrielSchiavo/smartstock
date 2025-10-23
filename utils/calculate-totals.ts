import { CalculableTotalItemProps, LocaleType, TotalValuesProps, TotalValuesWithUnitsProps, BaseUnitType, UnitType } from "@/types";
import { normalizeValue } from "@/utils/unit-conversion";

/**
 * Calcula os totais normalizados de peso, volume e unidades para uma lista de itens
 * @param data - Array de itens com propriedades de quantidade e unidades
 * @param initialValues - Valores iniciais para os totais (opcional)
 * @returns Objeto com os totais calculados. Somente retornará units caso não existir unitWeight e/ou unitOfUnitWeight. 
 *          Caso contrário será convertido units em KG ou L e somado com weight ou volume.
 */
export const calculateTotals = <T extends CalculableTotalItemProps>(
  data: T[],
  initialValues: TotalValuesProps = { weight: 0, volume: 0, units: 0 }
): TotalValuesProps => {
  return data.reduce((total: TotalValuesProps, item) => {
    // Extração segura das propriedades do item
    const quantity = item.quantity ?? 0;
    const unit = item.unit;
    const unitWeight = item.unitWeight ?? 0;
    const unitOfUnitWeight = item.unitOfUnitWeight;

    // Validação básica para evitar processamento desnecessário
    if (quantity <= 0) {
      return total;
    }

    // Normalização do valor do item
    const normalizedValue = normalizeValue(
      quantity,
      unit as UnitType,
      unitWeight,
      unitOfUnitWeight
    );

    // Atualização dos totais
    return {
      weight: total.weight + normalizedValue.weight,
      volume: total.volume + normalizedValue.volume,
      units: total.units + normalizedValue.units,
    };
  }, initialValues);
};

/**
 * Formata um número para exibição com configuração de decimais
 * @param value - Valor numérico
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns String formatada
 */
const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toLocaleString(LocaleType.PT_BR, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 3
  });
};

/**
 * Adiciona unidades de medida base para visualização dos totais
 * @param totals - Objeto com totais calculados
 * @param options - Opções de formatação
 * @returns Totais com unidades formatadas para exibição
 * EX.: const displayTotals = addUnitsForDisplay(totals); //console.log(displayTotals.weight.formatted); // "150,25 KG"
 */
export const addUnitsForDisplay = (
  totals: TotalValuesProps,
  options: {
    weightDecimals?: number;
    volumeDecimals?: number;
    unitsDecimals?: number;
  } = {}
): TotalValuesWithUnitsProps => {
  const {
    weightDecimals = 2,
    volumeDecimals = 2,
    unitsDecimals = 0
  } = options;

  return {
    weight: {
      value: totals.weight,
      unit: BaseUnitType.KG,
      formatted: `${formatNumber(totals.weight, weightDecimals)} KG`
    },
    volume: {
      value: totals.volume,
      unit: BaseUnitType.L,
      formatted: `${formatNumber(totals.volume, volumeDecimals)} L`
    },
    units: {
      value: totals.units,
      unit: BaseUnitType.UN,
      formatted: `${formatNumber(totals.units, unitsDecimals)} UN`
    }
  };
};

/**
 * Função utilitária para obter apenas as strings formatadas
 * @param totals - Totais calculados
 * @returns Array com strings formatadas [peso, volume, unidades]
 * EX.: const [weightStr, volumeStr, unitsStr] = getTotalDisplayStrings(totals);
 */
export const getTotalDisplayStrings = (totals: TotalValuesProps): [string, string, string] => {
  const display = addUnitsForDisplay(totals);
  return [
    display.weight.formatted,
    display.volume.formatted,
    display.units.formatted
  ];
};

/**
 * Função para criar um resumo textual dos totais
 * @param totals - Totais calculados
 * @param separator - Separador entre os valores (padrão: ' | ')
 * @returns String com resumo formatado
 * EX.: const summary = createTotalSummary(totalValues, ' | ', { showZeroValues: true }); // "150,25 KG | 45,80 L | 0 UN"
 */
export const createTotalSummary = (
  totals: TotalValuesProps, 
  separator: string = ' | ',
  options: {
    showZeroValues?: boolean;
    threshold?: number;
  } = {}
): string => {
  const { showZeroValues = false, threshold = 0 } = options;

  const display = addUnitsForDisplay(totals);
  const parts: string[] = [];

  // Adiciona weight se não for zero (ou se showZeroValues for true)
  if (showZeroValues || totals.weight > threshold) {
    parts.push(display.weight.formatted);
  }

  // Adiciona volume se não for zero (ou se showZeroValues for true)
  if (showZeroValues || totals.volume > threshold) {
    parts.push(display.volume.formatted);
  }

  // Adiciona units se não for zero (ou se showZeroValues for true)
  if (showZeroValues || totals.units > threshold) {
    parts.push(display.units.formatted);
  }

  return parts.join(separator);
};