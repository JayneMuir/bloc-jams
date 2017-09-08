
var setSong = function(songNumber) {
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber-1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
     formats: [ 'mp3' ],
     preload: true
 });

 setVolume(currentVolume);
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

// generates the song row content
var createSongRow = function(songNumber, songName, songLength) {
    var template =
    '<tr class="album-view-song-item">'
    +'  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + '  <td class="song-item-title">' + songName + '</td>'
    + '  <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

    var $row = $(template);

    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
             $(this).html(pauseButtonTemplate);
              setSong(songNumber);
              currentSoundFile.play();
             updatePlayerBarSong();
    	} else if (currentlyPlayingSongNumber  === songNumber) {
    		// Switch from Pause -> Play button to pause currently playing song.
                if (currentSoundFile.isPaused()) {
                    currentSoundFile.play();
                     $(this).html(pauseButtonTemplate);
                     $('.main-controls .play-pause').html(playerBarPauseButton);
                }
                else {
                    currentSoundFile.pause();
                    $(this).html(playButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPlayButton);
                }
    	}
    };

    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !==currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };

    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
    // select all of the HTML elements required to display on the album page:
    //  title, artist, release info, image, and song list.
    currentAlbum = album;

    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    // The firstChild property identifies the first child node of an element,
    // and nodeValue returns or sets the value of a node.
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    // Clear the album song list HTML to make sure there are no interfering elements.
    $albumSongList.empty();

    // Go through all the songs from the specified album object
    //  and insert them into the HTML
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

var nextSong = function () {
    // Get the current song index number
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // increment it to the next song
    currentSongIndex++;
    // make sure if you are at the end of the array that you wrap around to the front
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // save the current song as the previous song
    var lastSongNumber = currentlyPlayingSongNumber;

    // set the display number
    setSong( currentSongIndex + 1);
    currentSoundFile.play();
    // refresh that play bar
    updatePlayerBarSong();

    var $nextSongNumberCell =  getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function () {
    // Get the current song index number
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // decrement it to the previous song
    currentSongIndex--;
    // make sure if you are at the end of the array that you wrap around to the front
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // save the current song as the previous song
    var lastSongNumber = currentlyPlayingSongNumber;

    // set the display number
    setSong( currentSongIndex + 1);
    currentSoundFile.play();

    // refresh that play bar
    updatePlayerBarSong();
    $('.main-controls .play-pause').html(playerBarPauseButton);
    var $prevSongNumberCell =   getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell =  getSongNumberCell(lastSongNumber);

    $prevSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

var togglePlayFromPlayerBar = function() {
    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()) {
        currentlyPlayingCell.html(pauseButtonTemplate);
         $('.main-controls .play-pause').html(playerBarPauseButton);
         currentSoundFile.play();
    }
    else {
        currentlyPlayingCell.html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
    }
};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 var $playPauseButton = $('.main-controls .play-pause');

 // Call setCurrentAlbum when window loads
 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $playPauseButton.click(togglePlayFromPlayerBar);
 });
