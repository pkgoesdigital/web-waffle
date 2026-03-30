export type SlotType = 'visit' | 'meal' | 'quiet'

export type SlotDefinition = {
  key: string
  type: SlotType
  label: string
  timeRange: string
  startHour: number
  maxSignups: number
}

export const SLOT_DEFINITIONS: SlotDefinition[] = [
  {
    key: 'visit-morning',
    type: 'visit',
    label: 'Morning Visit',
    timeRange: '10:00 AM – 12:00 PM',
    startHour: 10,
    maxSignups: 3,
  },
  {
    key: 'visit-afternoon',
    type: 'visit',
    label: 'Afternoon Visit',
    timeRange: '1:00 PM – 6:00 PM',
    startHour: 13,
    maxSignups: 3,
  },
  {
    key: 'meal-dinner',
    type: 'meal',
    label: 'Dinner Drop-off',
    timeRange: '5:30 PM – 6:30 PM',
    startHour: 17,
    maxSignups: 1,
  },
  {
    key: 'quiet-overnight',
    type: 'quiet',
    label: 'Quiet Hours',
    timeRange: '9:00 PM – 9:00 AM',
    startHour: 21,
    maxSignups: 0,
  },
]

export const BOOKABLE_SLOTS = SLOT_DEFINITIONS.filter((s) => s.type !== 'quiet')
export const VALID_SLOT_KEYS = new Set(BOOKABLE_SLOTS.map((s) => s.key))
export const SLOT_BY_KEY = Object.fromEntries(SLOT_DEFINITIONS.map((s) => [s.key, s]))

export const CALENDAR_DAYS = 28
