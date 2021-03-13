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
        src="../assets/play.png"
        style="max-width: 100%; height: auto; max-height: 80vh"
        @click="onPlayClick"
      />
    </div>
    <div v-show="screen == 'pause'">
      <img
        alt="Durdur"
        src="../assets/pause.png"
        style="max-width: 100%; height: auto; max-height: 80vh"
        @click="onPauseClick"
      />
    </div>
    <div v-show="screen == 'waiting'">
      <img
        alt="Bekleniyor"
        src="../assets/waiting.png"
        style="max-width: 100%; height: auto; max-height: 80vh"
        @click="onWaitingClick"
      />
    </div>
    <div v-show="screen == 'error'">
      <img
        alt="Hata"
        src="../assets/error.png"
        style="max-width: 100%; height: auto; max-height: 80vh"
        @click="onErrorClick"
      />
    </div>
    <div v-if="showDebug">
      {{ source }}
      <div v-for="e in loggedEventTypes" v-bind:key="e.index">
        {{ e }}
      </div>
    </div>
  </div>
</template>



<script>
export default {
  name: "Player",
  props: {
    source: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    showDebug: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      screen: "",
      player: null,
      loggedEventTypes: [],
    };
  },
  created() {
    this.player = this.createPlayer();
    //document.title = this.title;
  },
  methods: {
    createPlayer() {
      console.log(this.source);
      var player = new Audio(this.source);
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
