<template>
  <v-container grid-list-md text-xs-center fluid>
    <h1>Clock</h1>
    <v-btn @click="requestTiming" color="information">Sync Clock</v-btn>
    <v-btn @click="updateClockDisplay" color="information">Init Clock</v-btn>
    <div>
      <v-container grid-list-md text-xs-center fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <p>Clock Timer in sync with Server: </p>
            <div>Server Time: <span id="clock"></span></div>
          </v-flex>
        </v-layout>
        <ClientMedia></ClientMedia>
      </v-container>
    </div>
  </v-container>
</template>


<script>
import ClientMedia from '../components/ClientMedia.vue'
  export default {
    name: 'Clock',
    components : {
      'ClientMedia' : ClientMedia
    },
    methods: {
      startConnection: function(hubUrl) {
        console.log('opening connection')
        const signalR = require('@aspnet/signalr')
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl(hubUrl)
          .configureLogging(signalR.LogLevel.Debug)
          .build()
        console.log('connection built. trying with credentials')

        this.connection.on('syncMessage', function (message) {
          console.log('sync message received', message)
          if (!message) 
            return;
          message = JSON.parse(message)
          var clientReceived = Date.now(), improved = 0, acc;
          console.log('Message Timing: ', message.Timing)
          if (message.Timing !== undefined) {
            const dateFormat = require('date-and-time')
            this.timing = dateFormat.parse(message.Timing, "DD/MM/YYYY HH:mm:ss.SSS")
            console.log('Converted timing: ', this.timing)
            this.minDifference = Math.min(this.minDifference != null ? this.minDifference : -Infinity, clientReceived - this.timing)
            console.log('Date Now - Timing Received : ', clientReceived - this.timing)
            console.log('Min Difference Calculated: ', this.minDifference)
            console.log('Max Difference Found?: ', this.maxDifference)

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

                  if (acc < 50) {
                  this.done = true;
                  }
                }
                if ((improved >= 10 || this.done)){// && callback) {
                  //this.GetCurrentVideoTimeFromServer()
                  //start playing video
                  //actually done, tell server we're in sync ish?
                }
              } else {
                this.timingDifference = this.minDifference;
              }
          }
        }
        }.bind(this))

        this.connection.on('broadcastMessage',
                    function(message) {
                        console.log(message)
                    }.bind(this))

        this.connection.start({ withCredentials: false })
        .then()
          .catch(error => {
            console.error(error.message)
          })
      },
      getCurrentVideoTimeFromServer() {
          this.connection.invoke('getCurrentVideoTime')
      },
      updateClockDisplay: function() {
          document.getElementById('clock').textContent = 'Calculated Server Time: ' +  (new Date(Date.now() - this.timingDifference)).toTimeString()
          + ' In millis: ' + (new Date(Date.now() - this.timingDifference)).getMilliseconds()
          setTimeout(this.updateClockDisplay, 1)
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
      }
    },
    mounted () {
      this.startConnection('https://btauctionpocapi.azurewebsites.net/hubs/videoActionHub')
    },
    data () {
      return {
        currentView: 'default',
        connection: null,
        timingDifference: 0,
        minDifference: Infinity,
        maxDifference: -Infinity,
        accuracy: Infinity,
        timing: '',
        synced: false,
        done: false
      }
    }
  }
</script>
