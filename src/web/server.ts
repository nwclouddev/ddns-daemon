import express from 'express';
import path from 'path';
import { config } from '../config';
import { state } from '../state';

export function startWebServer() {
  const app = express();

  app.use(express.static(path.join(__dirname, '../../dist-web')));

  app.get('/api/status', (req, res) => {
    res.json({
      ...state,
      dnsRecord: config.route53.dnsRecord,
    });
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist-web/index.html'));
  });

  app.listen(config.webPort, () => {
    console.log(`Web interface available at http://localhost:${config.webPort}`);
  });
}
