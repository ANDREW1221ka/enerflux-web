export const INSTALLATION_CATEGORIES = [
  'power_system',
  'pumping_system',
  'treatment_system',
  'production_system',
  'energy_generation_system',
  'power_quality_system',
  'custom',
] as const

export type InstallationCategory = (typeof INSTALLATION_CATEGORIES)[number]

export const INSTALLATION_TYPES = [
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
] as const

export type InstallationType = (typeof INSTALLATION_TYPES)[number]

export type InstallationLocation = {
  address?: string
  comuna?: string
  region?: string
  plant?: string
  area?: string
}

export type InstallationCapabilities = {
  telemetry: boolean
  alarms: boolean
  remoteControl: boolean
  trends: boolean
  notifications: boolean
}

export type InstallationTechnicalData = {
  plc?: string
  vfd?: string
  hmi?: string
  mqtt?: boolean
  modbus?: boolean
  sensors?: string[]
  actuators?: string[]
  powerLevel?: string
}

export type InstallationRealtimeCurrent = {
  connected?: boolean
  lastTelemetryAt?: string
  activeAlarms?: number
  status?: string
}

export type Installation = {
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

export type CreateInstallationPayload = Omit<Installation, 'id' | 'createdAt'> & {
  realtimeCurrent?: InstallationRealtimeCurrent
}

export type UpdateInstallationPayload = CreateInstallationPayload & {
  id: string
}

export const DEFAULT_INSTALLATION_CAPABILITIES: InstallationCapabilities = {
  telemetry: true,
  alarms: true,
  remoteControl: false,
  trends: true,
  notifications: true,
}

export function formatInstallationLocation(location?: InstallationLocation): string {
  if (!location) {
    return 'Sin ubicación'
  }

  const parts = [location.plant, location.area, location.comuna, location.region, location.address].filter(
    (value): value is string => Boolean(value?.trim()),
  )

  return parts.length > 0 ? parts.join(', ') : 'Sin ubicación'
}
