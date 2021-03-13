<template>
  <Player
    v-if="view.player != null"
    v-bind:source="view.player.source"
    v-bind:title="view.player.title"
    v-bind:showDebug="showDebug"
  />
</template>



<script>
import Player from "./components/Player";

export default {
  components: {
    Player,
  },
  name: "App",
  data() {
    return {
      currentHash: window.location.hash,
      currentParams: window.location.search,
    };
  },
  computed: {
    showDebug() {
      return this.currentParams.includes("debug");
    },
    view() {
      var hashPath = this.currentHash;
      if (hashPath.length === 0) {
        // Captures paths without a hash.
        return {
          player: this.defaultMixlrPlayerConfig(),
        };
      }

      var config;
      var hashParts;
      if (hashPath.startsWith("#/")) {
        hashParts = this.pathParts(hashPath.substring(2));
      } else {
        hashParts = this.pathParts(hashPath.substring(1));
      }
      console.log("hashparts: " + hashParts);
      if (hashParts.length >= 2 && hashParts[0] === "p") {
        // Captures paths like: #/p/<based64_of_source_url>/<optional_title>
        config = this.genericPlayerConfig(hashParts.slice(1));
      } else if (hashParts.length >= 1) {
        // Captures paths like #/<mixlr_id>/<optional_title>
        config = this.mixlrPlayerFromHashPartsConfig(hashParts);
      }
      return {
        player: config,
      };
    },
  },
  created() {
    window.addEventListener("hashchange", () => {
      this.currentHash = window.location.hash;
    });
  },
  methods: {
    genericPlayerConfig(hashParts) {
      var source = atob(hashParts[0]);
      var titlePrefix = hashParts.length === 2 ? decodeURI(hashParts[1]) : "";
      return this.playerConfig(
        source,
        titlePrefix.toUpperCase() + " CANLI YAYIN"
      );
    },
    mixlrPlayerFromHashPartsConfig(hashParts) {
      var mixlrId = hashParts[0];
      var titlePrefix = hashParts.length === 2 ? decodeURI(hashParts[1]) : "";
      return this.mixlrPlayerConfig(mixlrId, titlePrefix);
    },
    defaultMixlrPlayerConfig() {
      return this.mixlrPlayerConfig("ndbda", "İSVİÇRE-İTALYA");
    },
    mixlrPlayerConfig(id, titlePrefix) {
      return this.playerConfig(
        "https://edge.mixlr.com/channel/" + id,
        titlePrefix.toUpperCase() + " CANLI YAYIN"
      );
    },
    playerConfig(source, title) {
      return {
        title: title,
        source: source,
      };
    },
    pathParts(path) {
      return path.split("/");
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