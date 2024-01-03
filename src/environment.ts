export const environment = {
  production: false,
  apiUrl: 'https://localhost:7166/api',
  hubUrl: 'https://localhost:7166/moves',
  apiEndpoints: {
    playerHistory: '/Ranking/GetPlayerHistory',
    globalRanking: '/Ranking/GetRanking',
    playerScore: '/Ranking/GetPlayerScore'
  },
  cognito: {
    userPoolId: 'us-east-1_fy0rOL0v4',
    userPoolWebClientId: '4b78lhqm3tpnpvi9cq0ormu2sg',
  },
};
