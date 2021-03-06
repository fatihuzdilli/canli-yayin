<template>
  <div>
    <div>
      <h1 style="font-size: 100%; color: grey">
        {{ title }}
      </h1>
    </div>
    <div v-show="screen == 'play'">
      <img
        alt="Dokun"
        src="./assets/play.png"
        style="max-width: 100%; height: auto; max-height: 80vh"
        @click="onPlayClick"
      />
    </div>
    <div v-show="screen == 'pause'">
      <img
        alt="Durdur"
        src="./assets/pause.png"
        style="max-width: 100%; height: auto; max-height: 80vh"
        @click="onPauseClick"
      />
    </div>
    <div v-show="screen == 'waiting'">
      <img
        alt="Bekleniyor"
        src="./assets/waiting.png"
        style="max-width: 100%; height: auto; max-height: 80vh"
        @click="onWaitingClick"
      />
    </div>
    <div v-show="screen == 'error'">
      <img
        alt="Hata"
        src="./assets/error.png"
        style="max-width: 100%; height: auto; max-height: 80vh"
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
    var postHash = hashSplit.length > 1 ? hashSplit[1] : "";
    var postHashSplit = postHash.split("/");
    var postHash1 = postHashSplit[0];
    var postHash2 = postHashSplit.length > 0 ? postHashSplit[1] : "";
    return {
      player: null,
      screen: "",
      loggedEventTypes: [],
      showDebug: window.location.hash.includes("fuu"),
      mixlrId: postHash1.length > 0 ? postHash1 : "ndbda",
      title:
        (postHash2 !== ""
          ? decodeURI(postHash2).toUpperCase()
          : "İSVİÇRE-İTALYA") + " CANLI YAYIN",
    };
  },
  created() {
    this.player = this.createPlayer();
    document.title = this.title;
  },
  methods: {
    createPlayer() {
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
      player.autoplay = true;
      return player;
    },
    /**
     * EVENT HANDLERS FOR THE PLAYER
     */
    onLoadStartEvent() {
      if (this.screen === "") {
        this.screen = "play";
      }
    },
    onWaitingEvent() {
      this.screen = "waiting";
    },
    onPlayingEvent() {
      this.screen = "pause";
    },
    onPauseEvent() {
      this.screen = "play";
    },
    onAbortEvent() {
      this.handleError();
    },
    onEndedEvent() {
      this.handleError();
    },
    onStalledEvent() {
      this.handleError();
    },
    onErrorEvent() {
      this.handleError();
    },
    handleError() {
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
      if (this.screen === "error") {
        window.location.reload();
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
  margin-top: 10px;
}
</style>