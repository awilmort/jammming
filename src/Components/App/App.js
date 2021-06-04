import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {searchResults: [], playlistName: 'New Playlist', playlistTracks: []};
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (!this.state.playlistTracks.some((t) => t.id === track.id)) {
      this.setState((state) => {
        return {
          playlistTracks: [...state.playlistTracks, track]
        };
      });
    }
  }

  removeTrack(id) {
    this.setState((state) => {
      return {
        playlistTracks: state.playlistTracks.filter((t) => t.id !== id)
      };
    });
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map((t) => t.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(response => {
      this.setState({playlistName: 'New Playlist', playlistTracks: []});
    });
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(response => {
      this.setState({searchResults: response});
    });
  }
  
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
        <SearchBar onSearch={this.search}/>
        
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
          <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
        </div>

        </div>
      </div>
    )
  }
}