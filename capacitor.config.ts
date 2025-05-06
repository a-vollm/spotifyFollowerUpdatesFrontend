export default {
  appId: 'io.ionic.spotifyApp',
  appName: 'SpotifyApp',
  webDir: 'www',
  server: {
    cleartext: true,
  },
  plugins: {
    App: {
      urlOpen: {
        scheme: 'capacitor',
        hostname: 'localhost'
      }
    }
  }
};
