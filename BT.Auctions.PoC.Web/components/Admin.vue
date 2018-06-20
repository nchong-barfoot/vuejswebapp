<template>
  <v-container grid-list-md text-xs-center fluid>
    <h1>Select an Admin view</h1>
    <v-btn @click="showMedia" color="information">Play Media</v-btn>
    <v-btn @click="showBidding" color="information">Start Auction</v-btn>
    <div v-if="currentView === 'AdminMedia'">
      <AdminMedia></AdminMedia>
    </div>
    <div v-else-if="currentView === 'AdminBidding'">
      <v-container grid-list-md text-xs-center fluid>
        <v-layout row wrap>
          <v-flex xs3>
            <AdminBidding></AdminBidding>
          </v-flex>
          <v-flex xs9>
            <v-list two-line subheader>
          <v-list-tile v-for="item in items" :key="item.title" avatar @click="startBiddingOnLot(item)">
            <v-list-tile-avatar>
              <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-for="item in items2" :key="item.title" avatar @click="startBiddingOnLot(item)">
            <v-list-tile-avatar>
              <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div v-else>
        <h1>Oh hey</h1>
    </div>
  </v-container>
</template>


<script>
import SignalRHub from '../components/common/signalrhub.js'
import AdminMedia from '../components/AdminMedia.vue'
import AdminBidding from '../components/AdminBidding.vue'
  export default {
    name: 'Admin',
    components : {
      'AdminBidding' : AdminBidding,
      'AdminMedia' : AdminMedia
    },
    methods: {
      showBidding: function() {
        this.connection.invoke('changeView', 'ClientBidding')
        return this.currentView = 'AdminBidding'
      },
      showMedia: function() {
        this.connection.invoke('changeView', 'ClientMedia')
        return this.currentView = 'AdminMedia'
      },
      startBiddingOnLot: function(item) {
          console.debug(item)
      }
    },
    mounted () {
        var signalRHub = new SignalRHub()
        console.log('opening connection')
        this.connection = signalRHub.startHub()
        this.connection.start()
    },
    data () {
      return {
        currentView: 'default',
        connection: null,
         items2: [
          { icon: 'home', iconClass: 'blue white--text', title: 'Lot No. 1', subtitle: 'Address: 32 Brady Road, Otahuhu' },
          { icon: 'home', iconClass: 'blue white--text', title: 'Lot No. 2', subtitle: 'Address: 32 Brady Road, Otahuhu' },
          { icon: 'home', iconClass: 'blue white--text', title: 'Lot No. 3', subtitle: 'Address: 32 Brady Road, Otahuhu' },
          { icon: 'home', iconClass: 'blue white--text', title: 'Lot No. 4', subtitle: 'Address: 32 Brady Road, Otahuhu' },
          { icon: 'home', iconClass: 'blue white--text', title: 'Lot No. 5', subtitle: 'Address: 32 Brady Road, Otahuhu' },
          { icon: 'home', iconClass: 'blue white--text', title: 'Lot No. 6', subtitle: 'Address: 32 Brady Road, Otahuhu' },
          { icon: 'home', iconClass: 'blue white--text', title: 'Lot No. 7', subtitle: 'Address: 32 Brady Road, Otahuhu' }
        ]
      }
    }
  }
</script>
