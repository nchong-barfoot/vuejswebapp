<template>
  <div>
        <img src="https://media.barfoot.co.nz/ListingPhotos/high/756922N.jpg?width=1500&amp;height=1028&amp;mode=Crop&amp;quality=70&amp;scale=canvas" style="max-width:100%"/>
        <v-text-field
          name="input-2"
          label="Admin Bid"
          value="Admin Bid"
          class="input-group--focused"
          id="message"
        ></v-text-field>
        <v-btn color="info" id="sendmessage" value="Send Bid">Send Bid</v-btn>
  </div>
</template>

<script>
  import SignalRHub from '../components/common/signalrhub.js'

  export default {
    name: 'AdminBidding',
    methods: {
      startBiddingOnLot: function (item){
        console.debug('something' + item)
      }
    },
    mounted () {
      var signalRHub = new SignalRHub()
      console.log('opening connection')
      var connection = signalRHub.startHub()

      // Create a function that the hub can call to broadcast messages.
      connection.on('broadcastMessage', function (action) {
        console.log('broadcast received')
      })

      // Transport fallback functionality is now built into start.
      connection.start({ withCredentials: false })
        .then(function () {
          console.log('connection started')
          
          document.getElementById('sendmessage').addEventListener('click', function (event) {
                  // Call the Send method on the hub.
                  connection.invoke('send', messageInput.value)

                  // Clear text box and reset focus for next comment.
                  //messageInput.value = ''
                  messageInput.focus()
                  event.preventDefault()
              });
        })
        .catch(error => {
          console.error(error.message)
        })
    },
    data () {
      return {
        connection: null
      }
    }
  }
</script>
