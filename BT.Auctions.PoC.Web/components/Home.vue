<template>
  <!-- <div>
  <img src="/public/btlogo.jpg" alt="bt logo" class="mb-5" width="500px;" />
  <h2>Welcome!</h2>
  </div> -->
  <div>
    <section>
      <v-parallax src="public/auctions-hero.png" height="600">
        <v-layout
          column
          align-center
          justify-center
          class="white--text"
        >
          <img src="public/logo.png" alt="Barfoot &amp; Thompson" height="200">
          <!-- <h1 class="white--text mb-2 display-1 text-xs-center">Parallax Template</h1>
          <div class="subheading mb-3 text-xs-center">Powered by Vuetify</div>
          <v-btn
            class="blue lighten-2 mt-5"
            dark
            large
            href="/pre-made-themes"
          >
            Get Started
          </v-btn> -->
        </v-layout>
      </v-parallax>
    </section>

    <section>
      <v-layout
        column
        wrap
        class="my-5"
        align-center
      >
        <v-flex xs12 sm4 class="my-3">
          <div class="text-xs-center">
            <h2 class="headline">Barfoot &amp; Thompson run auctions at a number of fixed locations across Auckland and Whangarei, as well as at Barfoot & Thompson branches and on-site.</h2>
            <span class="subheading">
              Check your property's listing page to find out where and when the auction will be held. Auction details may change so check your listing for any updated details.
            </span>
          </div>
        </v-flex>
        <v-flex xs12>
          <v-container grid-list-xl>
            <v-layout row wrap align-center>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-media class="text-xs-center">
                    <v-avatar
                      size="192"
                      color="grey lighten-4"
                      class="avatar-center">
                      <img src="public/campbell.jpg" alt="avatar">
                    </v-avatar>                    
                  </v-card-media>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-xs-center">Campbell Dunnoon</div>
                  </v-card-title>
                  <v-card-text>
                    Campbell has around 15 years’ experience in real estate, both residential and commercial, and is a talented marketer and highly skilled auctioneer. In November 2013, Campbell moved from his role as Harcourts Regional Manager, to take up the position of Auction Manager here at Barfoot &amp; Thompson.
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-media>
                    <v-avatar
                      size="192"
                      color="grey lighten-4"
                      class="avatar-center">
                      <img src="public/tony.jpg" alt="avatar">
                    </v-avatar>                    
                  </v-card-media>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline">Tony Loughran</div>
                  </v-card-title>
                  <v-card-text>
                    Tony has amassed an extensive curriculum vitae in real estate experience in only a decade in the industry, being a successful salesperson before moving into auctioneering in both local and national roles. 
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12 md4>
                <v-card class="elevation-0 transparent">
                  <v-card-media>
                    <v-avatar
                      size="192"
                      color="grey lighten-4"
                      class="avatar-center">
                      <img src="public/marian.jpg" alt="avatar">
                    </v-avatar>                    
                  </v-card-media>
                  <v-card-title primary-title class="layout justify-center">
                    <div class="headline text-xs-center">Marian Tolich</div>
                  </v-card-title>
                  <v-card-text>
                    Marian joined Barfoot &amp; Thompson in 1999 as a full-time Auctioneer. 
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </section>

    <section>
      <v-container grid-list-xl>
        <v-layout row wrap justify-center class="my-5">
          <v-flex xs12 sm4>
            <v-card class="elevation-0 transparent">
              <v-card-title primary-title class="layout justify-center">
                <div class="headline">About Us</div>
              </v-card-title>
              <v-card-text>
                With over 90 years of experience, we understand what makes Auckland and Northland so unique. From our white sandy beaches, to our wild west coast and the hustle and bustle of the CBD, we know our communities inside and out, and we love them.
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm4 offset-sm1>
            <v-card class="elevation-0 transparent">
              <v-card-title primary-title class="layout justify-center">
                <div class="headline">Contact us</div>
              </v-card-title>
              <v-card-text>
                You can contact our auction team through the following channels
              </v-card-text>
              <v-list class="transparent">
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon class="blue--text text--lighten-2">phone</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>(09) 307 5400</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon class="blue--text text--lighten-2">place</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>Auckland, New Zealand</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-icon class="blue--text text--lighten-2">email</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title>auction@barfoot.co.nz</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<style>
  .avatar-center {
    margin: 0 auto;
  }
</style>