export type MediationType = 'trennung' | 'erbschaft' | 'nachbarschaft'

export interface FormField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'date'
  placeholder?: string
  /**
   * If 'priority', this field's value is sent as the `priority` payload field.
   * All other fields contribute to the `description` string.
   */
  mapTo?: 'priority'
}

export interface NewMediationConfig {
  type: MediationType
  title: string
  description: string
  mainHeading: string
  mainDescription: string
  topics: string[]
  relevantData: Array<{ title: string; fields: string[] }>
  steps: Array<{ num: string; title: string; text: string }>
  formFields: FormField[]
  disclaimer: { title: string; text: string }
}
