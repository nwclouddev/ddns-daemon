#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Route53 DDNS Service Installer${NC}"
echo "================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root (use sudo)${NC}"
  exit 1
fi

# Configuration
SERVICE_NAME="route53-ddns"
INSTALL_DIR="/opt/${SERVICE_NAME}"
SERVICE_USER="route53-ddns"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo -e "${YELLOW}Node.js not found. Installing Node.js...${NC}"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

echo -e "${GREEN}Node.js version: $(node --version)${NC}"
echo -e "${GREEN}npm version: $(npm --version)${NC}"

# Create service user
if ! id "$SERVICE_USER" &>/dev/null; then
  echo -e "${YELLOW}Creating service user: ${SERVICE_USER}${NC}"
  useradd --system --no-create-home --shell /bin/false "$SERVICE_USER"
fi

# Create installation directory
echo -e "${YELLOW}Creating installation directory: ${INSTALL_DIR}${NC}"
mkdir -p "$INSTALL_DIR"

# Copy application files
echo -e "${YELLOW}Copying application files...${NC}"
cp -r src package.json tsconfig.json web vite.config.ts "$INSTALL_DIR/"

# Copy .env if it exists, otherwise copy .env.example
if [ -f .env ]; then
  echo -e "${YELLOW}Copying existing .env file...${NC}"
  cp .env "$INSTALL_DIR/"
else
  echo -e "${YELLOW}Copying .env.example as .env...${NC}"
  cp .env.example "$INSTALL_DIR/.env"
  echo -e "${RED}IMPORTANT: Edit ${INSTALL_DIR}/.env with your configuration!${NC}"
fi

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
cd "$INSTALL_DIR"
npm install --production=false

# Build application
echo -e "${YELLOW}Building application...${NC}"
npm run build

# Set ownership
echo -e "${YELLOW}Setting file permissions...${NC}"
chown -R "$SERVICE_USER:$SERVICE_USER" "$INSTALL_DIR"
chmod 600 "$INSTALL_DIR/.env"

# Create systemd service file
echo -e "${YELLOW}Creating systemd service...${NC}"
cat > "$SERVICE_FILE" << EOF
[Unit]
Description=Route53 Dynamic DNS Service
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/node $INSTALL_DIR/dist/index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$INSTALL_DIR

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd
echo -e "${YELLOW}Reloading systemd...${NC}"
systemctl daemon-reload

echo ""
echo -e "${GREEN}Installation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit configuration: sudo nano ${INSTALL_DIR}/.env"
echo "2. Enable service: sudo systemctl enable ${SERVICE_NAME}"
echo "3. Start service: sudo systemctl start ${SERVICE_NAME}"
echo "4. Check status: sudo systemctl status ${SERVICE_NAME}"
echo "5. View logs: sudo journalctl -u ${SERVICE_NAME} -f"
echo ""
echo "Web interface will be available at: http://localhost:3000"
