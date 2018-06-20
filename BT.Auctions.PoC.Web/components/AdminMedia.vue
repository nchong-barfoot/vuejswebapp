<template>
<div>
    <div>
      <!-- Video selection -->
      <!--<ul id="video-list">
        <li v-for="(video, index) in videos">
          <a v-bind:href="video.url" v-on:click="playVideo(index, $event)">{{ video.title }}</a>
        </li>
      </ul>-->
      <v-btn color="blue lighten-2" id="stopBtn" value="Pause">
        Pause
        <v-icon right dark>pause_circle_outline</v-icon>
      </v-btn>
      <v-btn color="blue lighten-2" id="playBtn" value="Play">
        Play
        <v-icon right dark>play_circle_outline</v-icon>
      </v-btn>
    </div>
    <div>
      <v-container grid-list-md text-xs-center fluid>
        <v-layout
          column 
          wrap
          align-center
        >
          <v-layout
            row 
            wrap
            align-center
          >
            <v-flex xs11>
              <v-text-field
                id="delayInput"
                name="input-2-3"
                label="Please enter the number of seconds..."
                class="input-group--focused"
                single-line
              ></v-text-field>
            </v-flex>
            <v-flex xs1>        
              <v-btn color="blue lighten-2" id="scheduleBtn" value="Schedule">
                Schedule
                <v-icon right dark>schedule</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-container>
    </div>
    <section>
      <v-layout
        column
        wrap
        align-center
      >
      <v-flex xs12>
          <v-container grid-list-xl>
            <v-layout row wrap align-center>
              <div v-if="selectedVideo !== null">
                <video id="adminVideo" v-bind:src="selectedVideo.url" v-bind:type="selectedVideo.format" v-bind:key="selectedVideo.key" width="640" height="480" class="video-container">
                  We are having troubles rendering the selected video.
                </video>
              </div>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </section>
  </div>
</template>

<script>
  import SignalRHub from '../components/common/signalrhub.js'
  import VideoPlayback from '../components/common/videoplayback.js'
  
  export default {
    name: 'AdminMedia',
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
      requestTiming: function() {
        const dateFormat = require('date-and-time')
        var request = { Timing:dateFormat.format(new Date(), "DD/MM/YYYY HH:mm:ss.SSS")}
        if(this.minDifference != Infinity)
          request.MinDifference = this.minDifference 
        this.connection.invoke('syncClock', request)
        if(!this.done) {
          setTimeout(this.requestTiming, 1000)
        }
      },
      startConnection: function(hubUrl) {
        this.selectedVideo = this.videos[0]
      console.log('opening connection')
        const signalR = require('@aspnet/signalr')
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl('https://btauctionpocapi.azurewebsites.net/hubs/videoActionHub')
          .configureLogging(signalR.LogLevel.Information)
          .build()
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
                if (acc < 200) {
                  if (!this.synced) {
                    this.synced = true;
                    console.log('synched: ' + this.synced)
                    //todo: fire callback for first sync
                  }

                  if (acc < 50) {
                  this.done = true;
                  }
                }
                if ((improved >= 10 || this.done)){
                  
                }
              } else {
                this.timingDifference = this.minDifference;
              }
          }
        }
        }.bind(this))

        this.connection.on('resumeMedia', function(message) {
          const dateFormat = require('date-and-time')
          let startTime = dateFormat.parse(message, "DD/MM/YYYY HH:mm:ss.SSS")
          let serverTimeNow = new Date(Date.now() - this.timingDifference)
          let currentVideoTime = (serverTimeNow - startTime) / 1000
          let elem = document.getElementById('adminVideo')
          elem.play();
          elem.currentTime = currentVideoTime;
        }.bind(this))

        this.connection.on('playMedia', function(message) {
          const dateFormat = require('date-and-time')
          let startTime = dateFormat.parse(message, "DD/MM/YYYY HH:mm:ss.SSS")
          let serverTimeNow = new Date(Date.now() - this.timingDifference)
          let currentVideoTime = (serverTimeNow - startTime) / 1000
          let elem = document.getElementById('adminVideo')
          elem.play();
          elem.currentTime = currentVideoTime;
        }.bind(this))
        
        // Transport fallback functionality is now built into start.
        this.connection.start({ withCredentials: false })
          .then(function () {
            console.log('Connection started')
            document.getElementById('stopBtn').addEventListener('click', function (event) {
              var message = {
                action: 'pause',
                delay: 0
              }
              // Call the Send method on the hub.
              this.connection.invoke('send', JSON.stringify(message))
              event.preventDefault()
            })

            document.getElementById('scheduleBtn').addEventListener('click', function (event) {
              var numberOfSeconds = document.getElementById('delayInput').value

            // just in case
            if (isNaN(numberOfSeconds)) {
              numberOfSeconds = 0
            }

              var message = {
                action: 'schedule',
                delay: parseInt(numberOfSeconds) * 1000
              }
              // Call the Send method on the hub.
              this.connection.invoke('send', JSON.stringify(message))
              event.preventDefault()
            }.bind(this))
          })
          .catch(error => {
            console.error(error.message)
          })
      }
    },
    mounted () {
      this.startConnection('https://btauctionpocapi.azurewebsites.net/hubs/videoActionHub')
      this.requestTiming()

      document.getElementById('playBtn').addEventListener('click', function (event) {
              var message = {
                action: 'play',
                delay: 0
              }
              // Call the Send method on the hub.
              //connection.invoke('send', JSON.stringify(message))
              const dateFormat = require('date-and-time')
              let startTime = dateFormat.format((new Date(Date.now() - this.timingDifference)), "DD/MM/YYYY HH:mm:ss.SSS")
              let key = 1
              let length = 2000
              this.connection.invoke('startVideo', {StartTime: startTime})
            }.bind(this))
    },
    data () {
      return {
        // default data
        currentKey: 0,
        connection: null,
        currentView: 'default',
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
