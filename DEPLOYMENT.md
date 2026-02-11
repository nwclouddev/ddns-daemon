# Deployment Guide

This guide covers deploying the Route53 DDNS service on Debian/Ubuntu Linux systems.

## Prerequisites

- Debian/Ubuntu Linux system
- Root or sudo access
- Internet connection

## Installation

1. Clone or copy the project to your server:
```bash
git clone <repository-url>
cd route53-ddns-service
```

2. Run the installation script:
```bash
sudo ./install.sh
```

The installer will:
- Install Node.js (if not present)
- Create a dedicated service user
- Install the application to `/opt/route53-ddns`
- Build the application
- Create a systemd service

3. Configure the service:
```bash
sudo nano /opt/route53-ddns/.env
```

Required configuration:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
GATEWAY_DNS_RECORD=gateway.example.com
HOSTED_ZONE_ID=Z1234567890ABC
EMAIL_FROM=alerts@example.com
EMAIL_TO=admin@example.com
WEB_PORT=3000
```

4. Enable and start the service:
```bash
sudo systemctl enable route53-ddns
sudo systemctl start route53-ddns
```

## Service Management

Check service status:
```bash
sudo systemctl status route53-ddns
```

View logs:
```bash
sudo journalctl -u route53-ddns -f
```

Restart service:
```bash
sudo systemctl restart route53-ddns
```

Stop service:
```bash
sudo systemctl stop route53-ddns
```

## Web Interface

Access the status dashboard at:
```
http://your-server-ip:3000
```

To access from external networks, configure your firewall:
```bash
sudo ufw allow 3000/tcp
```

## Updating the Application

1. Stop the service:
```bash
sudo systemctl stop route53-ddns
```

2. Update files in `/opt/route53-ddns`

3. Rebuild:
```bash
cd /opt/route53-ddns
sudo npm run build
```

4. Start the service:
```bash
sudo systemctl start route53-ddns
```

## Uninstallation

Run the uninstall script:
```bash
sudo ./uninstall.sh
```

## Troubleshooting

### Service won't start
Check logs for errors:
```bash
sudo journalctl -u route53-ddns -n 50
```

### Permission issues
Ensure proper ownership:
```bash
sudo chown -R route53-ddns:route53-ddns /opt/route53-ddns
sudo chmod 600 /opt/route53-ddns/.env
```

### AWS credentials issues
Verify credentials have required permissions:
- route53:ListResourceRecordSets
- route53:ChangeResourceRecordSets
- ses:SendEmail

Test AWS connectivity:
```bash
cd /opt/route53-ddns
sudo -u route53-ddns node -e "require('./dist/services/route53').getCurrentARecord().then(console.log)"
```

## Security Considerations

- The service runs as a non-privileged user
- Environment file has restricted permissions (600)
- Systemd security hardening is enabled
- Consider using IAM roles instead of access keys if running on EC2
- Use AWS SES in sandbox mode or verify email addresses
- Restrict web interface access with firewall rules or reverse proxy

## Production Recommendations

1. Use a reverse proxy (nginx/Apache) for the web interface
2. Enable HTTPS with Let's Encrypt
3. Set up log rotation:
```bash
sudo journalctl --vacuum-time=7d
```
4. Monitor service health with your monitoring solution
5. Consider using AWS IAM roles if running on EC2
