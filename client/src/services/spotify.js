import Cookies from 'js-cookie'

export default {
    async getPlaylists (minTracks = 15) {
        const token = Cookies.get('user_token')

        const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(data => data.json())

        const placeholder = 'http://placekitten.com/250/250'

        return response.items
            .filter(item => item.tracks.total >= minTracks)
            .map(({ name, id, images }) => {
                return {
                    name: name,
                    id: id,
                    image: images[0] ? images[0].url : placeholder
                }
            })
    }
}
