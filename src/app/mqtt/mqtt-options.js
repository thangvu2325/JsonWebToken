const options = {
  host: "mqtt://mqtt.innoway.vn",
  username: "Dev_Web",
  password: "b0xgB0OqEtojp89jbKabNeuVuoaw874f",
  clientId: "Dev_Web",
  keepalive: 10,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 10000,
  will: {
    topic: "WillMsg",
    payload: "Connection Closed abnormally..!",
    qos: 0,
    retain: false,
  },
  rejectUnauthorized: false,
};
module.exports = options;
