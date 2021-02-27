module.exports = {
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      var hashSplit = window.location.hash.split("#");
      var titlePrefix =
        hashSplit.length > 2
          ? decodeURI(hashSplit[2]).toUpperCase()
          : "İSVİÇRE";
      args[0].title = titlePrefix + "Canlı Yayın";
      return args;
    });
  }
};
