import { trennungConfig } from './trennung/config'
import { erbschaftConfig } from './erbschaft/config'
import { nachbarschaftConfig } from './nachbarschaft/config'
import { NewMediationConfig, MediationType } from './types'

export const mediationRegistry: Record<MediationType, NewMediationConfig> = {
  trennung: trennungConfig,
  erbschaft: erbschaftConfig,
  nachbarschaft: nachbarschaftConfig,
}

export function getConfig(type: MediationType): NewMediationConfig {
  const config = mediationRegistry[type]
  if (!config) throw new Error(`Unbekannter Mediationstyp: ${type}`)
  return config
}
