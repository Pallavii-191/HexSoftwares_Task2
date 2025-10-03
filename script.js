// --- 1. Data Structure (Playlist) ---
// Note: You would replace the 'src' with the actual path to your audio files.
const playlist = [
    { title: "Walking on Sunshine", artist: "Katrina & The Waves", duration: "3:58", src: "audio/song1.mp3" },
    { title: "Sweet Caroline", artist: "Neil Diamond", duration: "3:23", src: "audio/song2.mp3" },
    { title: "Don't Stop Believin'", artist: "Journey", duration: "4:09", src: "audio/song3.mp3" }
    // Add more songs here!
];

// --- 2. DOM Element Selectors ---
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const playlistContainer = document.getElementById('playlist');

let currentSongIndex = 0;
let isPlaying = false;

// --- 3. Utility Functions ---

// Formats a time in seconds to mm:ss format
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// Renders the playlist onto the page
function renderPlaylist() {
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-index', index);
        li.innerHTML = `
            <div class="song-details">
                <span class="song-title">${song.title}</span>
                <span class="song-artist">${song.artist}</span>
            </div>
            <span class="song-duration">${song.duration}</span>
        `;
        li.addEventListener('click', () => {
            loadSong(index);
            playSong();
        });
        playlistContainer.appendChild(li);
    });
}

// --- 4. Core Playback Functions ---

// Loads a song's details and audio source
function loadSong(index) {
    currentSongIndex = index;
    const song = playlist[index];
    
    // Update player source and info
    audioPlayer.src = song.src;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;

    // Update the visual active state in the playlist
    document.querySelectorAll('#playlist li').forEach((li, i) => {
        li.classList.remove('active');
        if (i === index) {
            li.classList.add('active');
        }
    });

    // Reset progress bar to 0 and load metadata
    progressBar.value = 0;
    // durationDisplay.textContent is updated once 'loadedmetadata' fires
}

// Plays the current song
function playSong() {
    if (!isPlaying) {
        audioPlayer.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Change icon to pause
        playPauseBtn.title = 'Pause';
    }
}

// Pauses the current song
function pauseSong() {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Change icon to play
        playPauseBtn.title = 'Play';
    }
}

// Toggles between play and pause
function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Skips to the next song in the playlist
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    playSong();
}

// Skips to the previous song in the playlist
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    playSong();
}

// --- 5. Event Listeners (Control Interactions) ---

// Play/Pause button
playPauseBtn.addEventListener('click', togglePlayPause);

// Next button
nextBtn.addEventListener('click', nextSong);

// Previous button
prevBtn.addEventListener('click', prevSong);

// Volume bar control
volumeBar.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
});

// Progress bar control (User interaction)
progressBar.addEventListener('input', (e) => {
    // Set the current playback time based on where the user dragged the bar
    const seekTime = (e.target.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
});


// --- 6. Event Listeners (Audio Player Events) ---

// Fires when audio metadata is loaded (e.g., duration is available)
audioPlayer.addEventListener('loadedmetadata', () => {
    progressBar.max = 100; // Set max for percentage-based progress
    durationDisplay.textContent = formatTime(audioPlayer.duration);
});

// Fires repeatedly as the song plays (used for updating the progress bar)
audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.value = progress || 0;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
});

// Fires when the current song finishes
audioPlayer.addEventListener('ended', () => {
    nextSong(); // Automatically play the next song
});


// --- 7. Initialization ---

// 1. Render the playlist structure
renderPlaylist();

// 2. Load the first song to start
loadSong(currentSongIndex);