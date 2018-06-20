<template :key="currentView">
  <div>
    <h1>Client - Ready to go</h1>
    <div v-if="currentView === 'ClientMedia'">
      <ClientMedia></ClientMedia>
    </div>
    <div v-else-if="currentView === 'ClientBidding'">
      <ClientBidding></ClientBidding>
    </div>
    <div v-else>
        <h1>Awaiting Admin orders...</h1>
         <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </div>
</template>

<script>
import SignalRHub from '../components/common/signalrhub.js'
import ClientMedia from '../components/ClientMedia.vue'
import ClientBidding from '../components/ClientBidding.vue'
  export default {
    name: 'Client',
    components : {
      'ClientBidding' : ClientBidding,
      'ClientMedia' : ClientMedia
    },
    methods: {
      initConnection: function() {
          this.selectedVideo = this.videos[0]
        // Get the user name and store it to prepend to messages.
        var signalRHub = new SignalRHub()
        console.log('opening connection')
        var connection = signalRHub.startHub()
        connection.start()
        // Create a function that the hub can call to broadcast messages.
        connection.on('changeView', function (viewName) {
          this.currentView = viewName
        }.bind(this))

        // Transport fallback functionality is now built into start.
        connection.start()
          .catch(function(error) {
            console.error(error.message)
          })
      },
      changeView: function(viewName) {
        return this.currentView = viewName
      }
    },
    props: ['currentView'],
    mounted () {
      this.initConnection()
    },
    data () {
      return {
        // default data
        currentKey: 0,
        currentView: 'default',
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 10px;
  }

  a {
    color: #42b983;
  }
</style>
