import { trennungConfig } from './trennung/config'
import { erbschaftConfig } from './erbschaft/config'
import { nachbarschaftConfig } from './nachbarschaft/config'
import { mietverhaeltnisConfig } from './mietverhaeltnis/config'
import { arbeitsplatzConfig } from './arbeitsplatz/config'
import { odrConfig } from './odr/config'
import { schlichtungConfig } from './schlichtung/config'
import { ecommerceConfig } from './ecommerce/config'
import { b2bConfig } from './b2b/config'
import { wgConfig } from './wg/config'
import { verbraucherConfig } from './verbraucher/config'
import { NewMediationConfig, MediationType } from './types'

export const mediationRegistry: Record<MediationType, NewMediationConfig> = {
  trennung: trennungConfig,
  erbschaft: erbschaftConfig,
  nachbarschaft: nachbarschaftConfig,
  mietverhaeltnis: mietverhaeltnisConfig,
  arbeitsplatz: arbeitsplatzConfig,
  wg: wgConfig,
  verbraucher: verbraucherConfig,
  // ODR-Familie (Online Dispute Resolution, ehemals "geschaeft")
  odr: odrConfig,
  schlichtung: schlichtungConfig,
  ecommerce: ecommerceConfig,
  b2b: b2bConfig,
}

export function getConfig(type: MediationType): NewMediationConfig {
  // Altbestand: "geschaeft" wurde zu "odr" (Online Dispute Resolution)
  const key = ((type as string) === 'geschaeft' ? 'odr' : type) as MediationType
  const config = mediationRegistry[key]
  if (!config) throw new Error(`Unbekannter Mediationstyp: ${type}`)
  return config
}
