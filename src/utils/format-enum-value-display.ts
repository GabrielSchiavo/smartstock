import {
  ActionType,
  AdjustmentMovementCategoryType,
  AdjustmentType,
  EntityType,
  InputMovementCategoryType,
  MovementType,
  OutputMovementCategoryType,
  ProductType,
  ReportType,
  UserType,
} from "@/types";

// Tipos para formatação de texto
type TextCase = "uppercase" | "lowercase" | "capitalize";

// Mapa global de traduções para todos os enums
const enumTranslations: Record<string, string> = {
  [UserType.ADMIN]: "Admin",
  [UserType.CADASTRE]: "Cadastro",
  [UserType.DEFAULT]: "Padrão",
  [UserType.REPORT]: "Relatório",

  [ProductType.DONATED]: "Doado",
  [ProductType.PURCHASED]: "Comprado",

  [ReportType.VALIDITY]: "Validade",
  [ReportType.DONATIONS]: "Doações",
  // [ReportType.PURCHASED]: "Compras",
  [ReportType.INVENTORY]: "Inventário",
  [ReportType.RECEIVERS]: "Recebedores",
  [ReportType.SUPPLIERS]: "Fornecedores",
  [ReportType.INPUTS]: "Entradas",
  [ReportType.OUTPUTS]: "Saídas",
  [ReportType.ADJUSTMENTS]: "Ajustes",

  [MovementType.INPUT]: "Entrada",
  [MovementType.OUTPUT]: "Saída",
  [MovementType.ADJUSTMENT_POSITIVE]: "Ajuste Positivo",
  [MovementType.ADJUSTMENT_NEGATIVE]: "Ajuste Negativo",

  [InputMovementCategoryType.PURCHASE]: "Compra",
  [InputMovementCategoryType.DONATION]: "Doação",
  [InputMovementCategoryType.RETURN]: "Devolução",
  [InputMovementCategoryType.TRANSFER]: "Transferência",

  [OutputMovementCategoryType.SALE]: "Venda",
  [OutputMovementCategoryType.CONSUMPTION]: "Consumo",
  // [OutputMovementCategoryType.RETURN]: "Devolução",
  // [OutputMovementCategoryType.DONATION]: "Doação",
  // [OutputMovementCategoryType.TRANSFER]: "Transferência",

  [AdjustmentMovementCategoryType.GENERAL]: "Geral",
  [AdjustmentMovementCategoryType.LOSS_DAMAGE]: "Perda/Avaria",
  [AdjustmentMovementCategoryType.THEFT_MISPLACEMENT]: "Furto/Extravio",
  [AdjustmentMovementCategoryType.DUE_DATE]: "Vencimento",
  [AdjustmentMovementCategoryType.CORRECTION]: "Correção",

  [AdjustmentType.NEGATIVE]: "Negativo",
  [AdjustmentType.POSITIVE]: "Positivo",

  [ActionType.CREATE]: "Criar",
  [ActionType.UPDATE]: "Atualizar",
  [ActionType.DELETE]: "Excluir",
  [ActionType.LOGIN]: "Login",
  [ActionType.LOGOUT]: "Logout",
  [ActionType.LOGIN_FAILURE]: "Falha de Login",

  [EntityType.USER]: "Usuário",
  [EntityType.MASTER_PRODUCT]: "Produto Mestre",
  [EntityType.PRODUCT]: "Produto",
  // [EntityType.INPUT]: "Entrada",
  // [EntityType.OUTPUT]: "Saída",
  // [EntityType.ADJUSTMENT_POSITIVE]: "Ajuste Positivo",
  // [EntityType.ADJUSTMENT_NEGATIVE]: "Ajuste Negativo",
  [EntityType.CATEGORY]: "Categoria",
  [EntityType.GROUP]: "Grupo",
  [EntityType.SUBGROUP]: "Subgrupo",
  [EntityType.SUPPLIER]: "Fornecedor",
  [EntityType.RECEIVER]: "Recebedor",
  [EntityType.SYSTEM]: "Sistema",
};

// Função para aplicar formatação de texto
function applyTextCase(text: string, textCase: TextCase): string {
  switch (textCase) {
    case "uppercase":
      return text.toUpperCase();
    case "lowercase":
      return text.toLowerCase();
    case "capitalize":
      return text
             .toLowerCase()
             .replace(/\p{L}+/gu, (word) => word[0].toUpperCase() + word.slice(1));
    default:
      return text;
  }
}

// Função principal simples
export function formatEnumValueDisplay(
  enumValue: string | number,
  textCase: TextCase = "capitalize"
): string {
  const key = String(enumValue);
  const translation = enumTranslations[key];

  if (translation) {
    return applyTextCase(translation, textCase);
  }

  // Fallback: retorna o próprio valor do enum
  return String(enumValue);
}

// Exemplos de uso:
// Uso básico - retorna com primeira letra maiúscula
// getEnumDisplayValue(AdjustmentType.Positive) // "Positivo"

// Com formatação específica
// getEnumDisplayValue(AdjustmentType.Positive, 'uppercase')   // "POSITIVO"
// getEnumDisplayValue(AdjustmentType.Positive, 'lowercase')   // "positivo"
// getEnumDisplayValue(AdjustmentType.Positive, 'capitalize')  // "Positivo"
