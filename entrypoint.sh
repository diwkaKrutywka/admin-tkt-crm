#!/bin/sh

# Create runtime config
cat > /usr/share/nginx/html/config.js << EOF
window.APP_CONFIG = {
  BASE_API_URL: '${VITE_BASE_API_URL:-}'
};
EOF

# Start nginx
exec nginx -g "daemon off;"