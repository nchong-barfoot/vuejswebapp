const signalR = require('@aspnet/signalr')
const SEND_MESSAGE = 'send'
const BROADCAST_MESSAGE = 'broadcast'

function SignalRHub () {
   var connection = {}

   // Establishes a connection with the SignalR hub   
   this.startHub = function () {
      this.connection = new signalR.HubConnectionBuilder()
         .withUrl('https://btauctionpocapidev.azurewebsites.net/hubs/videoActionHub')
         .configureLogging(signalR.LogLevel.Trace)
         .build()
         
      console.log('connection built. trying with credentials')

      return this.connection
   }

   this.trigger = function (action, elementId) {

   }

   this.sendMessage = function (message) {
      this.connection.invoke(SEND_MESSAGE, message)
   }
}

module.exports = SignalRHub