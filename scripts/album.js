// Example Album
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};

// Another Example Album
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};
// Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

 // Store state of playing songs
  var currentlyPlayingSong = null;

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
             var songNumber = $(this).attr('data-song-number');

             if (currentlyPlayingSong !== null) {
                 // Revert to song number for currently playing song because user started playing new song.
                 var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
                 currentlyPlayingCell.html(currentlyPlayingSong);
             }
             if (currentlyPlayingSong !== songNumber) {
                 // Switch from Play -> Pause button to indicate new song is playing.
                 $(this).html(pauseButtonTemplate);
                 currentlyPlayingSong = songNumber;
             } else if (currentlyPlayingSong === songNumber) {
                 // Switch from Pause -> Play button to pause currently playing song.
                 $(this).html(playButtonTemplate);
                 currentlyPlayingSong = null;
             }
         };
         var onHover = function(event) {
             // Only target individual song rows
                 var songItem = $(this).find('.song-item-number');
                 var songItemNumber = songItem.attr('data-song-number')
                 // Change the content from the number to the play button's HTML
                 if (songItemNumber !== currentlyPlayingSong) {
                     songItem.html = playButtonTemplate;
                 }

         };
         var offHover = function(event) {
            var $songItem = $(this).find('.song-item-number');
             var $ongItemNumber = $songItem.attr('data-song-number');

             // check that the item the mouse is leaving is not the current song,
             // and we only change the content if it isn't
             if (songItemNumber !== currentlyPlayingSong) {
                 songItem.html(songItemNumber);
             }
         };

         $row.find('.song-item-number').click(clickHandler);
         $row.hover(onHover, offHover);
         return $row;
     };

     var setCurrentAlbum = function(album) {
// select all of the HTML elements required to display on the album page:
//  title, artist, release info, image, and song list.
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



  var clickHandler = function(targetElement) {
      var songItem = getSongItem(targetElement);
      if (currentlyPlayingSong === null) {
          songItem.innerHTML = pauseButtonTemplate;
           currentlyPlayingSong = songItem.getAttribute('data-song-number') ;
       } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
           songItem.innerHTML = playButtonTemplate;
           currentlyPlayingSong = null;
       } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
           var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
           currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
           songItem.innerHTML = pauseButtonTemplate;
           currentlyPlayingSong = songItem.getAttribute('data-song-number');
       }
   };

// Call setCurrentAlbum when window loads
$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
 });
