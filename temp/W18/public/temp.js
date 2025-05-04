async function loadSongs() {
    try {
      const response = await fetch('http://localhost:3000/songs'); // Call your API
      const data = await response.json();
      const songs = data.songs; // Assuming data has { count, songs }

      const songsBody = document.getElementById('songsBody');
      songsBody.innerHTML = '';

      songs.forEach((song, index) => {
        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${song.SongName || '-'}</td>
            <td>${song.Film || '-'}</td>
            <td>${song.Music_Director || '-'}</td>
            <td>${song.Singer || '-'}</td>
            <td>${song.Actor || '-'}</td>
            <td>${song.Actress || '-'}</td>
          </tr>
        `;
        songsBody.innerHTML += row;
      });
    } catch (error) {
      console.error('Error loading songs:', error);
    }
  }

  window.onload = loadSongs;