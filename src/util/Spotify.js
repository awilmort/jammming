
const CLIENT_ID = 'b987c5853e014f43a56f1557206c0af0';
const REDIRECT_URI = 'http://wilmortfy.surge.sh';//'http://localhost:3000/';

let userToken = '';
let expirationTime = '';

let Spotify = {
    getAccessToken() {
        if (userToken) return userToken;
        
        let accessToken = window.location.href.match(/access_token=([^&]*)/);
        let expiresIn = window.location.href.match(/expires_in=([^&]*)/);

        if (accessToken && expiresIn) {
            userToken = accessToken[1];
            expirationTime = expiresIn[1];
            window.setTimeout(() => userToken = '', parseInt(expirationTime) * 1000);
            window.history.pushState('Access Token', null, '/');
            return userToken;
        }

        window.location = 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID + '&response_type=token&scope=playlist-modify-public&redirect_uri=' + REDIRECT_URI;
    },

    search(term) {
        return fetch('https://api.spotify.com/v1/search?type=track&q=' + term, {
            headers: {Authorization: `Bearer ${this.getAccessToken()}`}
        }).then(response => {
            return response.json();
        }).then(response => {
            return response && response.tracks ? response.tracks.items.map( t => ({ id: t.id, name: t.name, artist: t.artists[0].name, album: t.album.name, uri: t.uri}) ) : [];   
        });
    },

    savePlaylist(playlistName, trackURIs) {
        if (!(playlistName && trackURIs)) return;

        return fetch('https://api.spotify.com/v1/me', {
            headers: {Authorization: `Bearer ${this.getAccessToken()}`}
        }).then(response => {
            return response.json();
        }).then(response => {
            return fetch(`https://api.spotify.com/v1/users/${response.id}/playlists`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.getAccessToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: playlistName})
            });
        }).then(response => {
            return response.json();
        }).then(response => {
            return fetch(`https://api.spotify.com/v1/playlists/${response.id}/tracks`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.getAccessToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({uris: trackURIs})
            });
        });
    }
};

export default Spotify;