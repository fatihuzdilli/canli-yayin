<template>
  <div>
    <div>
      <h1 style="font-size: 100%; color: grey">
        {{ titlePrefix }} CANLI YAYIN
      </h1>
    </div>
    <div v-if="screen == 'play'">
      <img
        alt="Dokun"
        src="./assets/play.png"
        style="width: 100%; max-width: 750px; max-height: 1000px"
        @click="onPlayClick"
      />
    </div>
    <div v-if="screen == 'pause'">
      <img
        alt="Durdur"
        src="./assets/pause.png"
        style="width: 100%; max-width: 750px; max-height: 1000px"
        @click="onPauseClick"
      />
    </div>
    <div v-if="screen == 'waiting'">
      <img
        alt="Bekleniyor"
        src="./assets/waiting.png"
        style="width: 100%; max-width: 750px; max-height: 1000px"
        @click="onWaitingClick"
      />
    </div>
    <div v-if="screen == 'error'">
      <img
        alt="Hata"
        src="./assets/error.png"
        style="width: 100%; max-width: 750px; max-height: 1000px"
        @click="onErrorClick"
      />
    </div>
    <div v-if="showDebug">
      {{ mixlrId }}
      {{ titlePrefix }}
      {{ showDebug }}
      <div v-for="e in loggedEventTypes" v-bind:key="e.index">
        {{ e }}
      </div>
    </div>
  </div>
</template>



<script>
export default {
  name: "App",
  data() {
    var hashSplit = window.location.hash.split("#");
    return {
      player: null,
      screen: "",
      loggedEventTypes: [],
      showDebug: window.location.hash.includes("fuu"),
      mixlrId: hashSplit.length > 1 ? hashSplit[1] : "mcrgf",
      titlePrefix:
        hashSplit.length > 2
          ? decodeURI(hashSplit[2]).toUpperCase()
          : "İSVİÇRE",
    };
  },
  created() {
    this.player = this.createPlayer();
  },
  methods: {
    createPlayer() {
      //var source =
      // "https://cdn.plyr.io/static/demo/Kishi_Bashi_-_It_All_Began_With_a_Burst.mp3";
      //var source = "https://radio.blknr.com/radio/8020/p8qDvRkXLDBZ6kse";
      var source = "https://edge.mixlr.com/channel/" + this.mixlrId;
      console.log(source);
      var player = new Audio(source);
      player.preload = "none";
      var events = [
        "abort",
        "canplay",
        "canplaythrough",
        "durationchange",
        "emptied",
        "ended",
        "error",
        "loadeddata",
        "loadedmetadata",
        "loadstart",
        "pause",
        "play",
        "playing",
        //"progress",
        "ratechange",
        "seeked",
        "seeking",
        "stalled",
        "suspend",
        //"timeupdate",
        "volumechange",
        "waiting",
      ];
      for (var i = 0; i < events.length; i++) {
        var e = events[i];
        player.addEventListener(e, (ev) => {
          console.log(ev);
          this.loggedEventTypes.push(ev.type);
        });
      }
      player.addEventListener("loadstart", this.onLoadStartEvent);
      player.addEventListener("waiting", this.onWaitingEvent);
      player.addEventListener("playing", this.onPlayingEvent);
      player.addEventListener("pause", this.onPauseEvent);
      player.addEventListener("abort", this.onAbortEvent);
      player.addEventListener("ended", this.onEndedEvent);
      player.addEventListener("stalled", this.onStalledEvent);
      player.addEventListener("error", this.onErrorEvent);
      return player;
    },
    /**
     * EVENT HANDLERS FOR THE PLAYER
     */
    onLoadStartEvent(e) {
      if (this.screen === "") {
        this.screen = "play";
      }
    },
    onWaitingEvent(e) {
      this.screen = "waiting";
    },
    onPlayingEvent(e) {
      this.screen = "pause";
    },
    onPauseEvent(e) {
      this.screen = "play";
    },
    onAbortEvent(e) {
      this.handleError();
    },
    onEndedEvent(e) {
      this.handleError();
    },
    onStalledEvent(e) {
      this.handleError();
    },
    onErrorEvent(e) {
      this.handleError();
    },
    handleError(e) {
      this.screen = "error";
      setTimeout(() => this.onErrorClick(), 5000);
    },
    /**
     * CLICK HANDLERS ON THE SCREEN
     */
    onPlayClick() {
      this.player.play();
    },
    onPauseClick() {
      this.player.pause();
    },
    onWaitingClick() {
      this.player.pause();
    },
    onErrorClick() {
      if (this.player.paused) {
        console.log("YE PAUSED CLICK");
        window.location.reload();
      } else {
        console.log("NO PAUSED CLICK");
      }
    },
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>