const getBgColor = (key?: string) => {
  switch(key) {
    case 'contest':
      return 'bg-red-400';
    case 'talks':
      return 'bg-orange-400';
    case 'various':
      return 'bg-green-400';
    case 'eating':
      return 'bg-purple-200';
    case 'other':
      return 'bg-gray-100';
    default:
      return 'bg-gray-400';
  }
}

type Activity = {
  rowspan: number,
  label: string,
  bgColor?: string,
}

export type DaySchedule = (Activity|Activity[])[];

export const dayLabels = [
  'Sunday July 28th',
  'Monday July 29th',
  'Tuesday July 30th',
  'Wednesday July 31st',
  'Thursday August 1st',
]

export const schedule: DaySchedule[] = [
  [
    { rowspan: 12, label: '', bgColor: getBgColor() },
    { rowspan: 10, label: 'Check-in', bgColor: getBgColor('other') },
    { rowspan: 4, label: `Opening ceremony (with virtual address from Pr. Guerraoui)`, bgColor: getBgColor('contest') },
    { rowspan: 5, label: 'Dinner', bgColor: getBgColor('eating') },
  ],
  [
    { rowspan: 3, label: 'Breakfast', bgColor: getBgColor('eating') },
    { rowspan: 8, label: 'Contest Day 1', bgColor: getBgColor('contest') },
    { rowspan: 4, label: 'Lunch', bgColor: getBgColor('eating') },
    [
      { rowspan: 3, label: 'UM6P tour', bgColor: getBgColor('various') },
      { rowspan: 3, label: 'Orientation Q&A', bgColor: getBgColor('talks') },
    ],
    [
      { rowspan: 3, label: 'Orientation Q&A', bgColor: getBgColor('talks') },
      { rowspan: 3, label: 'UM6P tour', bgColor: getBgColor('various') },
    ],
    { rowspan: 2, label: 'Contest 1 correction', bgColor: getBgColor('various') },
    { rowspan: 2, label: 'Free time', bgColor: getBgColor('other') },
    { rowspan: 6, label: 'Dinner', bgColor: getBgColor('eating') },
  ],
  [
    { rowspan: 3, label: 'Breakfast', bgColor: getBgColor('eating') },
    { rowspan: 8, label: 'Contest Day 2', bgColor: getBgColor('contest') },
    { rowspan: 4, label: 'Lunch', bgColor: getBgColor('eating') },
    { rowspan: 3, label: 'Talk 1 - Salim Tayou', bgColor: getBgColor('talks') },
    { rowspan: 1, label: 'Break', bgColor: getBgColor('other') },
    { rowspan: 3, label: 'Talk 2 - Rida Laraki', bgColor: getBgColor('talks') },
    { rowspan: 3, label: 'Game "Question pour un majorant"', bgColor: getBgColor('various') },
    { rowspan: 6, label: 'Dinner', bgColor: getBgColor('eating') },
  ],
  [
    { rowspan: 3, label: 'Breakfast', bgColor: getBgColor('eating') },
    { rowspan: 6, label: 'Sport tournament & Activities', bgColor: getBgColor('various') },
    { rowspan: 2, label: 'Contest 2 correction', bgColor: getBgColor('various') },

    { rowspan: 4, label: 'Lunch', bgColor: getBgColor('eating') },
    { rowspan: 3, label: 'Panel', bgColor: getBgColor('talks') },
    { rowspan: 2, label: 'Break', bgColor: getBgColor('other') },
    { rowspan: 3, label: 'Talk 3 - Omar El Housni', bgColor: getBgColor('talks') },
    { rowspan: 8, label: 'Dinner & collective activities', bgColor: getBgColor('eating') },
  ],
  [
    { rowspan: 3, label: 'Breakfast', bgColor: getBgColor('eating') },
    { rowspan: 4, label: 'Closing ceremony', bgColor: getBgColor('contest') },
    { rowspan: 3, label: 'Check-out', bgColor: getBgColor('other') },
    { rowspan: 21, label: '', bgColor: getBgColor() },
  ]
]