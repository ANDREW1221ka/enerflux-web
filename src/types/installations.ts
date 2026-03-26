export type InstallationCategory =
  | 'power_system'
  | 'pumping_system'
  | 'treatment_system'
  | 'production_system'
  | 'energy_generation_system'
  | 'power_quality_system'
  | 'custom'

export type InstallationType =
  | 'mv_distribution'
  | 'lv_distribution'
  | 'main_switchboard'
  | 'motor_control_center'
  | 'drinking_water_pumping'
  | 'peas_pumping'
  | 'riles_pumping'
  | 'wastewater_pumping'
  | 'treatment_plant'
  | 'food_processing_plant'
  | 'production_line'
  | 'industrial_process_control'
  | 'generator_system'
  | 'solar_generation'
  | 'hybrid_energy_system'
  | 'power_quality_monitoring'
  | 'custom'

export const INSTALLATION_CATEGORIES: InstallationCategory[] = [
  'power_system',
  'pumping_system',
  'treatment_system',
  'production_system',
  'energy_generation_system',
  'power_quality_system',
  'custom',
]

export const INSTALLATION_TYPES: InstallationType[] = [
  'mv_distribution',
  'lv_distribution',
  'main_switchboard',
  'motor_control_center',
  'drinking_water_pumping',
  'peas_pumping',
  'riles_pumping',
  'wastewater_pumping',
  'treatment_plant',
  'food_processing_plant',
  'production_line',
  'industrial_process_control',
  'generator_system',
  'solar_generation',
  'hybrid_energy_system',
  'power_quality_monitoring',
  'custom',
]

export const DEFAULT_INSTALLATION_CATEGORY: InstallationCategory = 'custom'
export const DEFAULT_INSTALLATION_TYPE: InstallationType = 'custom'

export const INSTALLATION_CATEGORY_LABELS: Record<InstallationCategory, string> = {
  power_system: 'Sistema de potencia',
  pumping_system: 'Sistema de bombeo',
  treatment_system: 'Sistema de tratamiento',
  production_system: 'Sistema de producción',
  energy_generation_system: 'Sistema de generación de energía',
  power_quality_system: 'Calidad de energía',
  custom: 'Otro',
}

export const INSTALLATION_TYPE_LABELS: Record<InstallationType, string> = {
  mv_distribution: 'Distribución MT',
  lv_distribution: 'Distribución BT',
  main_switchboard: 'Tablero general',
  motor_control_center: 'Centro de control de motores',
  drinking_water_pumping: 'Bombeo agua potable',
  peas_pumping: 'Bombeo PEAS',
  riles_pumping: 'Bombeo RILES',
  wastewater_pumping: 'Bombeo aguas servidas',
  treatment_plant: 'Planta de tratamiento',
  food_processing_plant: 'Planta productora de alimentos',
  production_line: 'Línea de producción',
  industrial_process_control: 'Control de proceso industrial',
  generator_system: 'Sistema generador',
  solar_generation: 'Generación solar',
  hybrid_energy_system: 'Sistema energético híbrido',
  power_quality_monitoring: 'Monitoreo calidad de energía',
  custom: 'Otro',
}

export interface InstallationLocation {
  address?: string
  comuna?: string
  region?: string
  plant?: string
  area?: string
}

export interface InstallationCapabilities {
  telemetry: boolean
  alarms: boolean
  remoteControl: boolean
  trends: boolean
  notifications: boolean
}

export interface InstallationTechnicalData {
  plc?: boolean
  vfd?: boolean
  hmi?: boolean
  mqtt?: boolean
  modbus?: boolean
  sensors?: string[]
  actuators?: string[]
  powerLevel?: 'mv' | 'lv'
}

export interface InstallationRealtimeCurrent {
  connected: boolean
  lastTelemetryAt?: string | null
  activeAlarms: number
  status: 'online' | 'offline' | 'idle' | 'alarm'
}

export interface Installation {
  id?: string
  name: string
  companyId: string
  companyName: string
  category: InstallationCategory
  type: InstallationType
  subtype?: string
  location?: InstallationLocation
  description?: string
  active: boolean
  clientVisible: boolean
  capabilities: InstallationCapabilities
  technical?: InstallationTechnicalData
  createdAt?: string
  createdBy?: string
}

export const DEFAULT_INSTALLATION_CAPABILITIES: InstallationCapabilities = {
  telemetry: true,
  alarms: true,
  remoteControl: false,
  trends: true,
  notifications: true,
}

export type CreateInstallationPayload = Omit<Installation, 'id' | 'createdAt'> & {
  realtimeCurrent?: InstallationRealtimeCurrent
}

export type UpdateInstallationPayload = Omit<Installation, 'createdAt'> & {
  id: string
}

export function formatInstallationLocation(location?: InstallationLocation): string {
  if (!location) return 'Sin ubicación'

  const parts = [
    location.address,
    location.comuna,
    location.region,
    location.plant,
    location.area,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(' · ') : 'Sin ubicación'
}
