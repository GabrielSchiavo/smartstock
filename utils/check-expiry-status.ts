import { DateValidationOptions, DateValidationResult, ValidityStatusType } from "@/types";

/**
 * Utilitário para validar datas de expiração
 * 
 * @param validityDate - Data a ser validada (Date ou string)
 * @param options - Configurações opcionais
 * @returns Informações sobre o status da data
 */
export const checkExpiryStatus = (
  validityDate: Date | string,
  options: DateValidationOptions = {}
): DateValidationResult => {
  const {
    dateOnly = false, // Se true, ignora horário e considera apenas a data (00:00:00)
    expiringThreshold = 30, // Número de dias antes da expiração para considerar como "expirando" 
    formatDate = (date: Date) => date.toLocaleDateString() // Função para formatar a data no resultado
  } = options;
  
  // Normalizar datas
  const targetDate = new Date(validityDate);
  const currentDate = new Date();
  
  // Validar se a data é válida
  if (isNaN(targetDate.getTime())) {
    throw new Error(`Data inválida: ${validityDate}`);
  }
  
  // Se dateOnly for true, zerar horários
  if (dateOnly) {
    targetDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
  }
  
  // Calcular dias até expiração
  const timeDiff = targetDate.getTime() - currentDate.getTime();
  const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // converte a diferença de tempo para DIAS
  
  // Determinar status
  let status: ValidityStatusType;
  if (daysUntilExpiry <= 0) {
    status = ValidityStatusType.EXPIRED;
  } else if (daysUntilExpiry <= expiringThreshold) {
    status = ValidityStatusType.EXPIRING;
  } else {
    status = ValidityStatusType.VALID;
  }
  
  return {
    daysUntilExpiry,
    status,
    formattedDate: formatDate(targetDate),
    isExpired: status === ValidityStatusType.EXPIRED,
    isExpiring: status === ValidityStatusType.EXPIRING,
    isValid: status === ValidityStatusType.VALID
  };
};

/**
 * Versão que retorna apenas dias e status
 */
export const getExpiryInfo = (
  validityDate: Date | string,
  options: DateValidationOptions = {}
) => {
  const result = checkExpiryStatus(validityDate, options);
  return {
    daysUntilExpiry: result.daysUntilExpiry,
    status: result.status
  };
};


// ===== EXEMPLOS DE USO =====
/**
 * @example
 * // 1. Uso básico
 * const result = checkExpiryStatus('2024-12-31');
 * console.log(result.daysUntilExpiry); // 127 (exemplo)
 * console.log(result.isExpiring); // false
 * console.log(result.formattedDate); // '31/12/2024'
 * 
 * // 2. Com configurações personalizadas
 * const urgentCheck = checkExpiryStatus('2024-09-15', {
 *   expiringThreshold: 7,  // Avisar com 7 dias
 *   dateOnly: true,        // Ignorar horário
 *   formatDate: (date) => date.toISOString().split('T')[0] // Formato ISO
 * });
 * 
 * // 3. Validação de documento
 * function validateDocument(doc) {
 *   try {
 *     const validation = checkExpiryStatus(doc.expiryDate, { 
 *       expiringThreshold: 30 
 *     });
 *     
 *     if (validation.isExpired) {
 *       return `❌ ${doc.name} expirou há ${Math.abs(validation.daysUntilExpiry)} dias`;
 *     }
 *     
 *     if (validation.isExpiring) {
 *       return `⚠️ ${doc.name} expira em ${validation.daysUntilExpiry} dias`;
 *     }
 *     
 *     return `✅ ${doc.name} válido por mais ${validation.daysUntilExpiry} dias`;
 *   } catch (error) {
 *     return `❌ Data inválida para ${doc.name}`;
 *   }
 * }
 * 
 * // 4. Processamento de lista de documentos
 * const documents = [
 *   { name: 'CNH', expiryDate: '2024-03-15' },
 *   { name: 'Passaporte', expiryDate: '2025-12-31' },
 *   { name: 'Certificado', expiryDate: '2024-09-01' }
 * ];
 * 
 * const validations = documents.map(doc => ({
 *   ...doc,
 *   ...checkExpiryStatus(doc.expiryDate, { expiringThreshold: 60 })
 * }));
 * 
 * // Filtrar documentos que precisam atenção
 * const needsAttention = validations.filter(doc => 
 *   doc.isExpired || doc.isExpiring
 * );
 * 
 * // 5. Uso da versão simplificada
 * const { daysUntilExpiry, status } = getExpiryInfo('2024-10-15');
 * 
 * switch (status) {
 *   case ValidityStatusType.EXPIRED:
 *     console.log('Documento expirado!');
 *     break;
 *   case ValidityStatusType.EXPIRING:
 *     console.log(`Expira em ${daysUntilExpiry} dias`);
 *     break;
 *   case ValidityStatusType.VALID:
 *     console.log('Documento válido');
 *     break;
 * }
 */