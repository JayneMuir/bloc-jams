
// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

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

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
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
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});

            $(this).html(pauseButtonTemplate);
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

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // use the built-in JavaScript Math.max() and Math.min()
    //to make sure our percentage is between 0 and 100
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    // convert  percentage to a string because the CSS expects a percent
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
     // we are using jQuery to find all elements in the DOM with a class of "seek-bar"
     // that are contained within the element with a class of "player-bar".
     // This will return a jQuery wrapped array containing both the song seek control
     //  and the volume control.
      var $seekBars = $('.player-bar .seek-bar');

      $seekBars.click(function(event) {
          // pageX is the  event value,
          // which holds the X (or horizontal) coordinate at which the event occurred
           // subtract the offset() of the seek bar held in $(this) from the left side
          var offsetX = event.pageX - $(this).offset().left;
          var barWidth = $(this).width();

          // divide offsetX by the width of the entire bar to calculate seekBarFillRatio
          var seekBarFillRatio = offsetX / barWidth;

          if ($(this).parent().attr('class') == 'seek-control') {
              seek(seekBarFillRatio * currentSoundFile.getDuration());
          } else {
              setVolume(seekBarFillRatio * 100);
          }

          //  pass $(this) as the $seekBar argument and
          // seekBarFillRatio for its eponymous argument
          updateSeekPercentage($(this), seekBarFillRatio);
      });
      // find elements with a class of .thumb inside our $seekBars
      // and add an event listener for the mousedown event
      $seekBars.find('.thumb').mousedown(function(event) {

          // this will be equal to the .thumb node that was clicked.
          //  we are attaching an event to both the song seek and volume control,
          //this is  node that dispatched the event.
          // the  parent method will give  whichever seek bar this .thumb belongs to.
          var $seekBar = $(this).parent();

          // Using jQuery bind() to track events
          // the mousemove event is attached to the document so that we can drag
          // the thumb even when the mouse leaves the seek bar
          $(document).bind('mousemove.thumb', function(event){
              var offsetX = event.pageX - $seekBar.offset().left;
              var barWidth = $seekBar.width();
              var seekBarFillRatio = offsetX / barWidth;

              if ($seekBar.parent().attr('class') == 'seek-control') {
                  seek(seekBarFillRatio * currentSoundFile.getDuration());
              } else {
                  setVolume(seekBarFillRatio);
              }

              updateSeekPercentage($seekBar, seekBarFillRatio);
          });

          // bind mouseup with .thumb namespace
          $(document).bind('mouseup.thumb', function() {
              // unbind removes the previous event listeners just added
              $(document).unbind('mousemove.thumb');
              $(document).unbind('mouseup.thumb');
          });
      });
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
     setupSeekBars();
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 });
