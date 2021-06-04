import React from 'react';
import TrackList from '../TrackList/TrackList';
import './PlayList.css';

export default class PlayList extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onNameChange(event.target.value);
    }

    render() {
        return (
            <div className="Playlist">
                <input value={this.props.playlistName} onChange={this.handleChange}/>
                <TrackList tracks={this.props.playlistTracks} isRemoval={true} onRemove={this.props.onRemove}/>
                <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
            </div>
        );
    }
}