function VideoPlayback () {
   // Initiaties download of a file from the specified URL to 
   this.loadVideo = function (url) {
      var req = new XMLHttpRequest()
      req.open('GET', url, true)
      req.responseType = 'blob'

      req.onload = function () {
         // Onload is triggered even on 404
         // 
         if (this.status === 200) {
            var videoBlob = this.response
            var vid = URL.createObjectURL(videoBlob);

            // Video is now downloaded
            // and we can set it as source on the video element
            //elem.src = vid
         }
      }

      req.onerror = function (e) {
         //Error
         console.log(e)
      }
      
      console.log('sending video request')
      req.send()
   }

   this.trigger = function(action, elementId) {
      var video = JSON.parse(action)
      var elem = document.getElementById(elementId)

      if (video.action === 'schedule') {
         if (video.delay > 0) {
            setTimeout(function () {
               elem.play()
            }, video.delay)
         }
      }

      if (video.action === 'play') {
         elem.play()
      }
      
      if (video.action === 'pause') {
         elem.pause()
      }
   }

   this.buildActionMessage = function (action, delay = 0) {
      var message = {
         action: action,
         delay: delay
      }
      return message
   }
}

module.exports = VideoPlayback