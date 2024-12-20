import http from 'http';
import https from 'https';

export const getHttpAgent = (timeout: number): http.Agent => {
  return new http.Agent({
    keepAlive: true,
    maxSockets: Infinity,
    maxFreeSockets: 10,
    timeout: timeout,
  });
};

export const getHttpsAgent = (timeout: number): https.Agent => {
  return new https.Agent({
    keepAlive: true,
    maxSockets: Infinity,
    maxFreeSockets: 10,
    timeout: timeout,
  });
};

export const defaultDownstreamKeepAliveTimeout = 45000;
