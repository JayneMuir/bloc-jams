
// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

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
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
             $(this).html(pauseButtonTemplate);
             currentlyPlayingSongNumber = songNumber;
             currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
             updatePlayerBarSong();
    	} else if (currentlyPlayingSongNumber  === songNumber) {
    		// Switch from Pause -> Play button to pause currently playing song.
    		$(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
             currentlyPlayingSongNumber = null;
             currentSongFromAlbum = null;
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
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // refresh that play bar
    updatePlayerBarSong();

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

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
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    // refresh that play bar
    updatePlayerBarSong();
    $('.main-controls .play-pause').html(playerBarPauseButton);
    var $prevSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $prevSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

 // Call setCurrentAlbum when window loads
 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 });
