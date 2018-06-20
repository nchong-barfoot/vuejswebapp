<template>
<div>
    <div v-if="selectedVideo !== null">
      <!-- <link rel="preload" as="video" v-bind:href="selectedVideo.url" v-bind:type="selectedVideo.format"> -->
      <video id="clientVideo" v-bind:src="selectedVideo.url" v-bind:type="selectedVideo.format" v-bind:key="selectedVideo.key" width="640" height="480" class="video-container">
        We are having troubles rendering the selected video.
      </video>
    </div>
    </div>
</template>

<script>
  import SignalRHub from '../components/common/signalrhub.js'
  import VideoPlayback from '../components/common/videoplayback.js'
  
  export default {
    name: 'ClientMedia',
    methods: {
      // plays the selected video
      playVideo (index, event) {
        if (event) {
          // prevents the default actions of a hyperlink tag
          event.preventDefault()
        }
        // sets the selected video
        this.selectedVideo = this.videos[index]
      },
      requestTiming() {
        const dateFormat = require('date-and-time')
        var request = { Timing:dateFormat.format(new Date(), "DD/MM/YYYY HH:mm:ss.SSS")}
        if(this.minDifference != Infinity)
          request.MinDifference = this.minDifference 
        this.connection.invoke('syncClock', request)
        if(!this.done) {
          setTimeout(this.requestTiming, 1000)
        }
      },
      getCurrentVideoTime() {
        this.connection.invoke('getCurrentVideoTime')
      },
      startConnection: function(hubUrl) {
        this.selectedVideo = this.videos[0]

     // console.log('opening connection')
        // Get the user name and store it to prepend to messages.
        const signalR = require('@aspnet/signalr')
         var messageInput = document.getElementById('message')
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl('https://btauctionpocapi.azurewebsites.net/hubs/videoActionHub')
          .configureLogging(signalR.LogLevel.Information)
          .build()

        this.connection.on('syncMessage', function (message) {
          if (!message) 
            return;
          message = JSON.parse(message)
          var clientReceived = Date.now(), improved = 0, acc;
          if (message.Timing !== undefined) {
            const dateFormat = require('date-and-time')
            this.timing = dateFormat.parse(message.Timing, "DD/MM/YYYY HH:mm:ss.SSS")
            this.minDifference = Math.min(this.minDifference != null ? this.minDifference : -Infinity, clientReceived - this.timing)

            if (this.minDifference !== undefined) {
              if (message.MaxDifference !== undefined) {
                this.maxDifference = message.MaxDifference
                this.timingDifference = this.minDifference + (this.maxDifference - this.minDifference) / 2

                var acc = Math.abs(this.maxDifference - this.minDifference);
                var improved = this.accuracy - acc;
                this.accuracy = acc;
                console.log('acc: ' + this.accuracy)
                if (acc < 200) {
                  if (!this.synced) {
                    this.synced = true;
                    console.log('synched: ' + this.synced)
                    //todo: fire callback for first sync
                  }

                  if (acc < 45) {
                  this.done = true;
                  //start doing things!
                    this.getCurrentVideoTime()
                  }
                }
                if ((improved >= 10 || this.done)){
                  //ready to go
                }
              } else {
                this.timingDifference = this.minDifference;
              }
          }
        }
        }.bind(this))


        // Create a function that the hub can call to broadcast messages.
        this.connection.on('broadcastMessage', function (message) {

          var video = JSON.parse(message)
          var elem = document.getElementById('boxVideo')

          if (video.action === 'schedule') {
            if (video.delay > 0) {
              setTimeout(function () {
                elem.play()
              }, video.delay)
            }
          }
          if (video.action === 'play') elem.play()
          if (video.action === 'pause') elem.pause()
        })

        this.connection.on('playMedia', function(message) {
          var video = JSON.parse(message)
          console.log('video object received', video)

          //set video start time to message.videoStartTime
        })

        this.connection.on('resumeMedia', function(message) {
          const dateFormat = require('date-and-time')
            let startTime = dateFormat.parse(message, "DD/MM/YYYY HH:mm:ss.SSS")
            let serverTimeNow = new Date(Date.now() - this.timingDifference)
            let currentVideoTime = (serverTimeNow - startTime) / 1000
            let elem = document.getElementById('clientVideo')
            elem.play();
            elem.currentTime = currentVideoTime; 
        }.bind(this))

        this.connection.on('playMedia', function(message) {
          const dateFormat = require('date-and-time')
          let startTime = dateFormat.parse(message, "DD/MM/YYYY HH:mm:ss.SSS")
          let serverTimeNow = new Date(Date.now() - this.timingDifference)
          let currentVideoTime = (serverTimeNow - startTime) / 1000
          let elem = document.getElementById('clientVideo')
          elem.play();
          elem.currentTime = currentVideoTime;
        }.bind(this))

        this.connection.on('changeView', function(view) {
            console.log('change view called')
        })

        // Transport fallback functionality is now built into start.
        this.connection.start()
        .then(function() {
          this.requestTiming()
        }.bind(this))
          .catch(error => {
            console.error(error.message)
          })
      }
    },
    mounted () {
      this.startConnection('https://btauctionpocapi.azurewebsites.net/hubs/videoActionHub')
    },
    data () {
      return {
        // default data
        currentKey: 0,
        connection: null,
        timingDifference: 0,
        minDifference: Infinity,
        maxDifference: -Infinity,
        accuracy: Infinity,
        timing: '',
        synced: false,
        done: false,
        videos: [
          {
            title: 'Our History - How Barfoot & Thompson Began in 1923',
            url: './content/videos/Barfoot History.mp4',
            format: 'video/mp4',
            key: new Date().getUTCMilliseconds()
          },
          {
            title: 'Barfoot & Thompson: Our Network',
            url: './content/videos/Barfoot Network.mp4',
            format: 'video/mp4',
            key: new Date().getUTCMilliseconds()
          }
        ],
        selectedVideo: null
      }
    }
  }
</script>
