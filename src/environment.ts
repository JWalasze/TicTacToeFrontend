export const environment = {
  production: false,
  apiUrl: 'http://10.0.1.165:4015/api',
  hubUrl: 'http://10.0.1.165:4015/moves',
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
