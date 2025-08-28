"use server"

import { auditLogRepository } from "@/db";
import { AuditLogWithUserResponse } from "@/types";

export const getAuditLogs = async (): Promise<AuditLogWithUserResponse[]> => {
  try {
    return await auditLogRepository.findAll();
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    throw error;
  }
};

export const getAuditLogsInputs = async (): Promise<AuditLogWithUserResponse[]> => {
  try {
    return await auditLogRepository.findInputs();
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    throw error;
  }
};

export const getAuditLogsOutputs = async (): Promise<AuditLogWithUserResponse[]> => {
  try {
    return await auditLogRepository.findOutputs();
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    throw error;
  }
};

export const getAuditLogsInputOutput = async (): Promise<AuditLogWithUserResponse[]> => {
  try {
    return await auditLogRepository.findInputOutput();
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    throw error;
  }
};

export const getAuditLogsAdjustment = async (): Promise<AuditLogWithUserResponse[]> => {
  try {
    return await auditLogRepository.findAdjustment();
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    throw error;
  }
};

export const getAuditLogsSeveral = async (): Promise<AuditLogWithUserResponse[]> => {
  try {
    return await auditLogRepository.findSeveral();
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    throw error;
  }
};

export const getAuditLogsSystem = async (): Promise<AuditLogWithUserResponse[]> => {
  try {
    return await auditLogRepository.findSystem();
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    throw error;
  }
};