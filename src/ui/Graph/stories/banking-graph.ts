export const bankingGraph = {
  nodes: [
    { id: 'Board of Directors', group: 1 },
    { id: 'Internal Audit', group: 2 },
    { id: 'CEO', group: 2 },
    { id: 'Government Relations Group', group: 3 },
    { id: 'Human Resources Group', group: 3 },
    { id: 'Wholesale Banking Group', group: 3 },
    { id: 'Consumer Banking Group', group: 3 },
    { id: 'General Counsel Board', group: 2 }
  ],
  links: [
    { source: 'Board of Directors', target: 'Internal Audit', value: 1 },
    { source: 'Board of Directors', target: 'CEO', value: 1 },
    {
      source: 'Board of Directors',
      target: 'General Counsel Board',
      value: 1
    },

    { source: 'CEO', target: 'Government Relations Group', value: 2 },
    { source: 'CEO', target: 'Human Resources Group', value: 2 },
    { source: 'CEO', target: 'Wholesale Banking Group', value: 2 },
    { source: 'CEO', target: 'Consumer Banking Group', value: 2 }
  ]
};
