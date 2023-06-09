// eip155
export const ChainPresets = {
  eip155: {
    1: {
      name: 'Ethereum',
      icon: '692ed6ba-e569-459a-556a-776476829e00',
    },
    42161: {
      name: 'Arbitrum',
      icon: '600a9a04-c1b9-42ca-6785-9b4b6ff85200',
    },
    43114: {
      name: 'Avalanche',
      icon: '30c46e53-e989-45fb-4549-be3bd4eb3b00',
    },
    56: {
      name: 'BNB Smart Chain',
      icon: '93564157-2e8e-4ce7-81df-b264dbee9b00',
    },
    250: {
      name: 'Fantom',
      icon: '06b26297-fe0c-4733-5d6b-ffa5498aac00',
    },
    10: {
      name: 'Optimism',
      icon: 'ab9c186a-c52f-464b-2906-ca59d760a400',
    },
    137: {
      name: 'Polygon',
      icon: '41d04d42-da3b-4453-8506-668cc0727900',
    },
    100: {
      name: 'Gnosis',
      icon: '02b53f6a-e3d4-479e-1cb4-21178987d100',
    },
    9001: {
      name: 'Evmos',
      icon: 'f926ff41-260d-4028-635e-91913fc28e00',
    },
    324: {
      name: 'ZkSync',
      icon: 'b310f07f-4ef7-49f3-7073-2a0a39685800',
    },
    4689: {
      name: 'IoTex',
      icon: '34e68754-e536-40da-c153-6ef2e7188a00',
    },
    1088: {
      name: 'Metis',
      icon: '3897a66d-40b9-4833-162f-a2c90531c900',
    },
  },
} as Record<
  string,
  Record<
    string,
    {
      name: string;
      icon: string;
    }
  >
>;
