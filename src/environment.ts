export const environment = {
  production: true,
  apiUrl: 'http://34.192.62.5:4015/api',
  hubUrl: 'http://34.192.62.5:4015/moves',
  apiEndpoints: {
    playerHistory: '/Ranking/GetPlayerHistory',
    globalRanking: '/Ranking/GetRanking',
    playerScore: '/Ranking/GetPlayerScore',
    addNewPlayer: '/Auth/CreateNewPlayer',
    getPlayerIdByUsername: '/Auth/GetIdForUsername'
  },
  cognito: {
    userPoolId: 'us-east-1_fy0rOL0v4',
    userPoolWebClientId: '4b78lhqm3tpnpvi9cq0ormu2sg',
  },
};
