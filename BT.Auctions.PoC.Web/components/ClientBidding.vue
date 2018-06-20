<template>
    <v-container grid-list-md text-xs-center fluid>
        <v-layout row wrap>
          <v-flex xs3>
            <img src="https://media.barfoot.co.nz/ListingPhotos/high/756922N.jpg?width=1500&amp;height=1028&amp;mode=Crop&amp;quality=70&amp;scale=canvas" style="max-width:100%"/>
            <h1 style="color:green;font-weight:bold">NOW SELLING</h1>
          </v-flex>
          <v-flex xs9>
            <v-list two-line subheader>
              <v-list-tile v-for="item in items.slice().reverse()" :key="item.title" avatar @click="startBiddingOnLot(item)">
                <v-list-tile-avatar>
                  <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>
</template>

<script>
  import SignalRHub from '../components/common/signalrhub.js'
  
  export default {
    name: 'ClientBidding',
    data() {
      return {
        items : []
      }
    },
    methods : {
      initConnection: function() {
        
      var signalRHub = new SignalRHub()
      console.log('opening connection')
      var connection = signalRHub.startHub()

      // Create a function that the hub can call to broadcast messages.
      connection.on('broadcastMessage',
                  function(message) {
                      this.items.push({icon: 'gavel', iconClass: 'blue white--text', title: 'Lot No. 1', subtitle: message})
                  }.bind(this))

      // Transport fallback functionality is now built into start.
      connection.start()
        .then(function () {
          console.log('connection started')
          
          document.getElementById('sendmessage').addEventListener('click', function (event) {
                  //should send across notification to hub saying we're connected and ready to go
              });
        })
        .catch(function(error) {
          console.error(error.message)
        })
      }
    },
    mounted () {
      this.initConnection()
    },
  }
</script>
