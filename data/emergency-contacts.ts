export interface EmergencyContact {
  name: string
  number: string
  note: string
}

export interface EmergencyContactSection {
  category: string
  color: string
  contacts: EmergencyContact[]
}

export const NATIONAL_EMERGENCY_NUMBER = '999 / 112'

export const EMERGENCY_CONTACTS: EmergencyContactSection[] = [
  {
    category: 'National Emergency',
    color: '#EF4444',
    contacts: [
      { name: 'Police Emergency', number: '999', note: 'National emergency line' },
      { name: 'Fire Brigade', number: '999 / 112', note: 'National' },
      { name: 'Ambulance (National)', number: '0800 720 999', note: 'Kenya Red Cross' },
      { name: 'Kenya Red Cross', number: '1199', note: '24-hour helpline' },
    ],
  },
  {
    category: 'Local Hospitals — 24hr',
    color: '#10B981',
    contacts: [
      { name: 'Aga Khan Hospital Ridgeways', number: 'To be confirmed', note: 'Off Kiambu Road, Ridgeways' },
      { name: 'RFH Thindigua', number: '0111 033 800', note: 'Kiambu Road, Thindigua' },
      { name: 'Radiant Hospital Kiambu', number: '0709 668 899', note: 'Kiambu-Githunguri Road' },
      { name: 'The Nairobi Hospital — Kiambu Mall', number: '+254 701 442 277', note: '2nd Floor, Kiambu Mall' },
      { name: 'St Bridget Hospital', number: 'To be confirmed', note: '24-hour emergency' },
    ],
  },
  {
    category: 'Local Authorities',
    color: '#3B82F6',
    contacts: [
      { name: 'Kiambu Police Station', number: 'To be confirmed', note: 'Kiambu Town' },
      { name: 'Kiambu County Referral Hospital', number: 'To be confirmed', note: 'Kiambu Town' },
      { name: 'Kiambu County Government', number: 'To be confirmed', note: 'County headquarters' },
    ],
  },
  {
    category: 'Ambulance & Medical',
    color: '#F59E0B',
    contacts: [
      { name: 'AAR Emergency', number: 'To be confirmed', note: 'Private ambulance service' },
      { name: 'AMREF Flying Doctors', number: '+254 20 6000 090', note: 'Air ambulance and evacuation' },
      { name: 'St John Ambulance', number: '0722 310 571', note: 'First aid & ambulance' },
    ],
  },
]
