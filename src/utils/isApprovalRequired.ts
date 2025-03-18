import { SafetyLevel } from '../components/SafetySettings';
import { AuditReport } from './protocol';

export const DEFAULT_SAFETY_LEVEL = 2;
const LOCAL_STORAGE_KEY_SAFETY_LEVEL = 'safetyLevel';

export function isApprovalRequired(report?: AuditReport): boolean {
  switch (getSafetyLevel()) {
    case SafetyLevel.Basic:
      return ["Safe", "Warning", "Danger"].includes(report?.category)
    case SafetyLevel.Cautious:
      return ["Warning", "Danger"].includes(report?.category)
    case SafetyLevel.Critical:
      return ["Danger"].includes(report?.category)
    default:
      return ["Danger"].includes(report?.category)
  }
}

export function getSafetyLevel(): SafetyLevel {
  // Load safety level from local storage
  const savedLevel = localStorage.getItem(LOCAL_STORAGE_KEY_SAFETY_LEVEL);
  if (savedLevel == null) return DEFAULT_SAFETY_LEVEL as SafetyLevel;
  if (!isNaN(Number(savedLevel))) {
    return Number(savedLevel) as SafetyLevel;
  } else {
    return DEFAULT_SAFETY_LEVEL as SafetyLevel;
  }
}

export function setSafetyLevel(level: SafetyLevel): void {
  localStorage.setItem(LOCAL_STORAGE_KEY_SAFETY_LEVEL, level.toString());
}
