export enum UserType {
  ADMIN = "ADMIN",
  DEFAULT = "DEFAULT",
  CADASTRE = "CADASTRE",
  REPORT = "REPORT",
}

export enum UnitType {
  KG = "KG",
  G = "G",
  L = "L",
  UN = "UN",
}

export enum ProductType {
  DONATED = "DONATED",
  PURCHASED = "PURCHASED",
}

export enum ReportType {
  VALIDITY = "VALIDITY",
  DONATIONS = "DONATIONS",
  PURCHASED = "PURCHASED",
  INVENTORY = "INVENTORY",
}

export enum ValidityStatusType {
  VALID = "VALID",
  EXPIRED = "EXPIRED",
  EXPIRING = "EXPIRING",
}

export enum PdfUnitType {
  MM = "mm",
  PT = "pt", 
  CM = "cm",
  IN = "in",
  A4 = "a4"
}

export enum LocaleType {
  PT_BR = "pt-BR",
  EN_US = "en-US",
  UTC = "UTC",
  SAO_PAULO = "America/Sao_Paulo",
  DD_MM_YYYY = "dd/MM/yyyy",
}

export enum AlertType {
  EXPIRED = "EXPIRED",
  EXPIRING = "EXPIRING",
}

export enum AlertStyleType {
  DEFAULT = "default",
  DESTRUCTIVE = "destructive",
  READ = "read",
}

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
}

export enum ProductCountType {
  ALL = "all",
  EXPIRED = "expired",
  ABOUT_TO_EXPIRE = "aboutToExpire",
}

export enum ResourceType {
  SUPPLIER = "supplier",
  CATEGORY = "category",
  GROUP = "group",
  RECEIVER = "receiver",
  SUBGROUP = "subgroup",
}

export enum ModeType {
  ADD = "add",
  EDIT = "edit",
}

export enum BaseDataType {
  USER = "user",
  PRODUCT = "product",
}

export enum TableType {
  USER = "user",
  PRODUCT = "product",
  MASTER_ITEM = "masterProduct",
}

export enum MovementType {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
  ADJUSTMENT_POSITIVE = "ADJUSTMENT_POSITIVE",
  ADJUSTMENT_NEGATIVE = "ADJUSTMENT_NEGATIVE",
}

export enum InputMovementCategoryType {
  PURCHASE = "PURCHASE",
  DONATION = "DONATION",
  RETURN = "RETURN",
  TRANSFER = "TRANSFER",
}

export enum OutputMovementCategoryType {
  SALE = "SALE",
  CONSUMPTION = "CONSUMPTION",
  RETURN = "RETURN",
  DONATION = "DONATION",
  TRANSFER = "TRANSFER",
}

export enum AdjustmentMovementCategoryType {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
  LOSS_DAMAGE = "LOSS_DAMAGE",
  THEFT_MISPLACEMENT = "THEFT_MISPLACEMENT",
  POSTING_ERROR = "POSTING_ERROR",
  DUE_DATE = "DUE_DATE",
}

export enum ActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum EntityType {
  USER = "USER",
  MASTER_PRODUCT = "MASTER_PRODUCT",
  PRODUCT = "PRODUCT",
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
  ADJUSTMENT = "ADJUSTMENT",
  CATEGORY = "CATEGORY",
  GROUP = "GROUP",
  SUBGROUP = "SUBGROUP",
  SUPPLIER = "SUPPLIER",
  RECEIVER = "RECEIVER",
}