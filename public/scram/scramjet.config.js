self.__scramjetConfig = {
  prefix: "/scramjet/",
  codec: {
    encode: (url) => encodeURIComponent(url),
    decode: (url) => decodeURIComponent(url),
  },
  files: {
    wasm: "/public/scram/scramjet.wasm.wasm",
    worker: "/public/scram/scramjet.all.js",
    client: "/public/scram/scramjet.bundle.js",
    sync: "/public/scram/scramjet.sync.js",
  },
};
