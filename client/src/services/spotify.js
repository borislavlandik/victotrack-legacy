const apiUrl = 'http://localhost:3000'

export default {
    async getPlaylists (minTracks = 15) {
        const response = await fetch(`${apiUrl}/playlists`, { credentials: 'include' })

        if (response.status !== 200) {
            return []
        }

        const playlistsJson = await response.json()

        if (playlistsJson.error) {
            return this.getPlaylists()
        }

        const placeholder = 'http://placekitten.com/250/250'

        const filteredPlaylists = playlistsJson.items
            .filter(item => item.tracks.total >= minTracks)
            .map(({ name, id, images }) => {
                return {
                    name: name,
                    id: id,
                    image: images[0] ? images[0].url : placeholder
                }
            })

        return filteredPlaylists
    },
    async getPlaylistTracks (playlistId) {
        const response = await fetch(`${apiUrl}/tracks?playlistId=${playlistId}`, { credentials: 'include' })

        if (response.status !== 200) {
            return []
        }

        const tracksJson = await response.json()

        return tracksJson.items
            .map(item => {
                const artists = item.track.artists.map(artist => artist.name)
                const trackName = item.track.name

                return {
                    trackName: trackName,
                    artists: artists,
                    preview: item.track.preview_url,
                    fullName: `${artists[0]} — ${trackName}`
                }
            })
    }
}
