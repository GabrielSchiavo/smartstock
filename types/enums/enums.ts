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

export enum validityStatusType {
  VALID = "VALID",
  EXPIRED = "EXPIRED",
  EXPIRING = "EXPIRING",
}

export enum PdfUnitType {
  PT = "pt",
  MM = "mm",
  CM = "cm",
  IN = "in",
  A4 = "a4",
}

export enum LocaleType {
  PT_BR = "pt-BR",
  EN_US = "en-US",
  UTC = "UTC",
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
  DONOR = "donor",
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