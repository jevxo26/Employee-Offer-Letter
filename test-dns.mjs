import dns from 'dns';
const hostname = '_mongodb._tcp.cluster0.gh1jtid.mongodb.net';

dns.resolveSrv(hostname, (err, addresses) => {
  if (err) {
    console.error("SRV resolution failed:", err);
  } else {
    console.log("SRV addresses:", addresses);
  }
});
