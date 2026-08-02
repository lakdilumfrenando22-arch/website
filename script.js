/**
 * Sindu Vault - Audio Player Logic (100% Fixed & Mobile Responsive)
 */
const SinduApp = (function() {
    
    // ඔබගේ ෆෝල්ඩරයේ ඇති සින්දු වල නියමිත නම් (Exact File Names)
    const allSongs = [
        { 
            id: 1, 
            name: "Alec Benjamin", 
            artist: "Alec Benjamin", 
            category: "Pop", 
            duration: "3:05", 
            icon: "fa-guitar", 
            color: "from-amber-500 to-orange-600", 
            audioUrl: "songs/Alec Benjamin.mp3" 
        },
        { 
            id: 2, 
            name: "Captain Jack", 
            artist: "Hans Zimmer", 
            category: "Instrumental", 
            duration: "4:00", 
            icon: "fa-anchor", 
            color: "from-blue-600 to-indigo-800", 
            audioUrl: "songs/Captain Jack.mp3" 
        },
        { 
            id: 3, 
            name: "Carol Of The Bells", 
            artist: "Traditional", 
            category: "Classical", 
            duration: "2:45", 
            icon: "fa-bell", 
            color: "from-emerald-500 to-teal-700", 
            audioUrl: "songs/Carol Of The Bells.mp3" 
        },
        { 
            id: 4, 
            name: "CKay - Love Nwantiti", 
            artist: "CKay", 
            category: "Afrobeat", 
            duration: "2:25", 
            icon: "fa-heart", 
            color: "from-purple-500 to-pink-600", 
            audioUrl: "songs/CKay - Love Nwantiti.mp3" 
        },
        { 
            id: 5, 
            name: "Handawaka", 
            artist: "Local Artist", 
            category: "Pop", 
            duration: "3:40", 
            icon: "fa-moon", 
            color: "from-indigo-500 to-violet-700", 
            audioUrl: "songs/Handawaka.mp3" 
        },
        { 
            id: 6, 
            name: "LEMON_MUZYKA_L...", 
            artist: "Lemon", 
            category: "Remix", 
            duration: "3:50", 
            icon: "fa-compact-disc", 
            color: "from-yellow-500 to-amber-600", 
            audioUrl: "songs/LEMON_MUZYKA_L....mp3" 
        },
        { 
            id: 7, 
            name: "Manoparakata", 
            artist: "SLMIX.LK", 
            category: "Pop", 
            duration: "3:30", 
            icon: "fa-music", 
            color: "from-rose-500 to-pink-600", 
            audioUrl: "songs/Manoparakata.mp3" 
        },
        { 
            id: 8, 
            name: "Manoparakata Mind", 
            artist: "SLMIX.LK", 
            category: "Pop", 
            duration: "3:35", 
            icon: "fa-headphones", 
            color: "from-cyan-500 to-blue-600", 
            audioUrl: "songs/Manoparakata Mind.mp3" 
        },
        { 
            id: 9, 
            name: "Himi Nathi Adareka", 
            artist: "Local Artist", 
            category: "Pop", 
            duration: "3:20", 
            icon: "fa-star", 
            color: "from-rose-600 to-red-700", 
            audioUrl: "songs/Himi Nathi Adareka.mp3" 
        },
        { 
            id: 10, 
            name: "Shakira, Burna Boy", 
            artist: "Shakira ft. Burna Boy", 
            category: "Pop", 
            duration: "3:15", 
            icon: "fa-fire", 
            color: "from-orange-500 to-rose-600", 
            audioUrl: "songs/Shakira, Burna Boy.mp3" 
        }
    ];

    const database = {
        android: allSongs,
        ios: allSongs
    };

    let state = {
        platform: 'android',
        category: 'All',
        searchQuery: ''
    };

    let audioElement = new Audio();
    const categories = ['All', 'Pop', 'Remix', 'Instrumental', 'Classical', 'Afrobeat'];

    function init() {
        renderCategories();
        renderSongs();
        setupEventListeners();
        loadFeaturedSong();
    }

    function loadFeaturedSong() {
        const songs = database[state.platform];
        if (songs && songs.length > 0) {
            const featured = songs[0];
            updateFeaturedUI(featured.name, featured.artist, featured.category, featured.audioUrl);
        }
    }

    function updateFeaturedUI(name, artist, category, url) {
        const titleEl = document.getElementById('featuredTitle');
        const artistEl = document.getElementById('featuredArtist');
        const playBtn = document.getElementById('featuredPlayBtn');

        if (titleEl) titleEl.innerText = name;
        if (artistEl) artistEl.innerText = `${artist} • Category: ${category}`;
        
        if (playBtn) {
            playBtn.onclick = function() {
                playSong(name, artist, url);
            };
        }
    }

    function setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchQuery = e.target.value.toLowerCase();
                renderSongs();
            });
        }

        audioElement.addEventListener('ended', () => {
            const icon = document.getElementById('playPauseIcon');
            if(icon) {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    }

    function switchPlatform(platform) {
        state.platform = platform;
        state.category = 'All';
        
        document.querySelectorAll('.platform-tab').forEach(tab => {
            tab.classList.remove('active-tab');
            tab.classList.add('text-slate-400');
        });
        const activeBtn = document.getElementById(`btn-${platform}`);
        if(activeBtn) {
            activeBtn.classList.add('active-tab');
            activeBtn.classList.remove('text-slate-400');
        }

        renderCategories();
        renderSongs();
        loadFeaturedSong();
    }

    function filterCategory(cat) {
        state.category = cat;
        renderCategories();
        renderSongs();
    }

    function renderCategories() {
        const listEl = document.getElementById('categoryList');
        if(!listEl) return;

        let html = categories.map(cat => {
            const isActive = state.category === cat;
            const activeClass = isActive ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/20' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800';
            return `<button onclick="SinduApp.filterCategory('${cat}')" class="px-4 py-2 text-xs rounded-xl whitespace-nowrap transition ${activeClass}">
                ${cat}
            </button>`;
        }).join('');

        listEl.innerHTML = html;
    }

    function renderSongs() {
        const listEl = document.getElementById('songList');
        if (!listEl) return;

        let songs = [...database[state.platform]];

        if (state.category !== 'All') {
            songs = songs.filter(song => song.category === state.category);
        }

        if (state.searchQuery) {
            songs = songs.filter(song => 
                song.name.toLowerCase().includes(state.searchQuery) || 
                song.artist.toLowerCase().includes(state.searchQuery)
            );
        }

        const badge = document.getElementById('songCountBadge');
        if (badge) {
            badge.innerText = `${songs.length} songs available`;
        }

        if (songs.length === 0) {
            listEl.innerHTML = `
                <div class="col-span-full py-16 text-center bg-slate-900/30 border border-slate-800/60 rounded-3xl">
                    <i class="fa-solid fa-music-slash text-4xl text-slate-600 mb-3"></i>
                    <p class="text-sm font-medium text-slate-400">No songs found matching your search.</p>
                </div>`;
            return;
        }

        // මෙහි Play බටන් එකේ දැන් "Play" පමණක් ඇත (සිංහල අකුරු ඉවත් කර ඇත)
        listEl.innerHTML = songs.map(song => `
            <div class="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between hover:border-slate-700 transition shadow-lg group">
                <div class="flex items-center space-x-3.5 overflow-hidden">
                    <div class="bg-gradient-to-tr ${song.color} w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                        <i class="fa-solid ${song.icon}"></i>
                    </div>
                    <div class="truncate">
                        <h4 class="font-bold text-sm text-white tracking-tight truncate">${song.name}</h4>
                        <p class="text-[11px] text-slate-400 mt-0.5 truncate">${song.artist} &bull; ${song.duration}</p>
                        <span class="inline-block bg-slate-800 text-rose-400 text-[10px] px-2 py-0.5 rounded-md mt-1">${song.category}</span>
                    </div>
                </div>
                <button onclick="SinduApp.playSong('${song.name}', '${song.artist}', '${song.audioUrl}')" class="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-md shadow-rose-600/25 flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <i class="fa-solid fa-play text-[10px]"></i> Play
                </button>
            </div>
        `).join('');
    }

    function playSong(name, artist, url) {
        document.getElementById('playerSongName').innerText = name;
        document.getElementById('playerArtist').innerText = artist;
        document.getElementById('audioPlayerBar').classList.remove('hidden');

        const currentSongObj = allSongs.find(s => s.audioUrl === url);
        if (currentSongObj) {
            updateFeaturedUI(currentSongObj.name, currentSongObj.artist, currentSongObj.category, currentSongObj.audioUrl);
        }

        if (audioElement.src !== url) {
            audioElement.src = url;
        }
        
        audioElement.play().then(() => {
            const icon = document.getElementById('playPauseIcon');
            if(icon) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            }
        }).catch(error => {
            console.log("Audio playback error:", error);
            alert("සින්දුව ප්ලේ විය නොහැක! ෆෝල්ඩරය තුළ මෙම ෆයිල් නම ('" + url + "') නිවැරදිව ඇද්දැයි පරීක්ෂා කරන්න.");
        });
    }

    function scrollToPlaylist() {
        const songsSection = document.getElementById('songsSection');
        if(songsSection) {
            songsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function closePlayer() {
        audioElement.pause();
        document.getElementById('audioPlayerBar').classList.add('hidden');
    }

    function togglePlay() {
        const icon = document.getElementById('playPauseIcon');
        if (audioElement.paused) {
            audioElement.play();
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            audioElement.pause();
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    }

    window.addEventListener('DOMContentLoaded', init);

    return {
        switchPlatform,
        filterCategory,
        playSong,
        playFeatured: scrollToPlaylist,
        scrollToPlaylist,
        closePlayer,
        togglePlay
    };

})();