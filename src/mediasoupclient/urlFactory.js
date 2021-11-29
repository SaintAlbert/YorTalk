let protooPort = 4443;
let hostIp = "159.65.215.186"//"192.168.0.2" //"127.0.0.1"//"165.227.226.246"
let peerPort = 4444;
let port = 3016;

if (window.location.hostname === 'test.mediasoup.org')
  protooPort = 4444;

export function getProtooUrl({ roomId, peerId}) {
  const hostname = hostIp;

  //return `wss://${hostname}:${protooPort}?roomId=${roomId}&peerId=${peerId}`;
  //return `wss://${hostname}:${protooPort}`;
  return `https://${hostname}:${protooPort}?roomId=${roomId}&peerId=${peerId}`;
}

export function getTCPUrl() {
  /*  return `https://${hostIp}:${port}`;*/
  return `https://${hostIp}:${port}`;
}

export function getLocalTCPUrl() {
  /*  return `https://${hostIp}:${port}`;*/
  return `https://127.0.0.1:${port}`;
}


export function getPeerUrl() {
  const hostname = hostIp;

  //return `wss://${hostname}:${protooPort}?roomId=${roomId}&peerId=${peerId}`;
  //return `wss://${hostname}:${protooPort}`;
  return `${hostname}`;
}
export function getPort() {
  return peerPort;
}
