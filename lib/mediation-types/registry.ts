import { trennungConfig } from './trennung/config'
import { erbschaftConfig } from './erbschaft/config'
import { nachbarschaftConfig } from './nachbarschaft/config'
import { geschaeftConfig } from './geschaeft/config'
import { wgConfig } from './wg/config'
import { verbraucherConfig } from './verbraucher/config'
import { NewMediationConfig, MediationType } from './types'

export const mediationRegistry: Record<MediationType, NewMediationConfig> = {
  trennung: trennungConfig,
  erbschaft: erbschaftConfig,
  nachbarschaft: nachbarschaftConfig,
  geschaeft: geschaeftConfig,
  wg: wgConfig,
  verbraucher: verbraucherConfig,
}

export function getConfig(type: MediationType): NewMediationConfig {
  const config = mediationRegistry[type]
  if (!config) throw new Error(`Unbekannter Mediationstyp: ${type}`)
  return config
}
