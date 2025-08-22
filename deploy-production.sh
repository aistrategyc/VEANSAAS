#!/bin/bash

# 🚀 Production deployment script for planerix.com
# Server: cx22 (Hetzner) - IP: 65.108.220.33

set -e

echo "🚀 Starting production deployment..."

# Production server configuration
SERVER_IP="92.242.60.211"
SERVER_USER="root"
PROJECT_DIR="/opt/liderix"
COMPOSE_FILE="docker-compose.prod.yml"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we have access to the server
check_server_access() {
    log_info "Checking server access..."
    if ssh -i ~/.ssh/liderix_prod -o ConnectTimeout=10 -q "$SERVER_USER@$SERVER_IP" exit; then
        log_info "✅ Server access confirmed"
    else
        log_error "❌ Cannot access server $SERVER_IP"
        echo "Please check:"
        echo "1. SSH key is added to the server"
        echo "2. Server is running"
        echo "3. Network connectivity"
        exit 1
    fi
}

# Create project directory on server
setup_server_directories() {
    log_info "Setting up server directories..."
    ssh -i ~/.ssh/liderix_prod "$SERVER_USER@$SERVER_IP" << 'EOF'
        mkdir -p /opt/liderix
        mkdir -p /opt/liderix/logs
        mkdir -p /opt/liderix/backups
        chown -R root:root /opt/liderix
EOF
}

# Copy files to server
deploy_files() {
    log_info "Copying application files..."
    
    # Create temporary directory for clean deployment
    TEMP_DIR=$(mktemp -d)
    
    # Copy necessary files
    cp -r apps "$TEMP_DIR/"
    cp docker-compose.prod.yml "$TEMP_DIR/"
    cp Caddyfile "$TEMP_DIR/"
    cp .env.production "$TEMP_DIR/"
    
    # Remove development files
    find "$TEMP_DIR" -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
    find "$TEMP_DIR" -name ".next" -exec rm -rf {} + 2>/dev/null || true
    find "$TEMP_DIR" -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find "$TEMP_DIR" -name ".git" -exec rm -rf {} + 2>/dev/null || true
    
    # Copy to server
    rsync -avz --delete \
        -e "ssh -i ~/.ssh/liderix_prod" \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='__pycache__' \
        "$TEMP_DIR/" "$SERVER_USER@$SERVER_IP:$PROJECT_DIR/"
    
    # Cleanup
    rm -rf "$TEMP_DIR"
}

# Setup Docker and dependencies on server
setup_docker() {
    log_info "Setting up Docker environment..."
    ssh -i ~/.ssh/liderix_prod "$SERVER_USER@$SERVER_IP" << 'EOF'
        # Update system
        apt-get update
        
        # Install Docker if not present
        if ! command -v docker &> /dev/null; then
            curl -fsSL https://get.docker.com -o get-docker.sh
            sh get-docker.sh
            systemctl enable docker
            systemctl start docker
        fi
        
        # Install Docker Compose if not present
        if ! command -v docker-compose &> /dev/null; then
            curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            chmod +x /usr/local/bin/docker-compose
        fi
        
        # Install other dependencies
        apt-get install -y curl wget htop nano
EOF
}

# Deploy application
deploy_application() {
    log_info "Deploying application containers..."
    ssh -i ~/.ssh/liderix_prod "$SERVER_USER@$SERVER_IP" << EOF
        cd $PROJECT_DIR
        
        # Stop existing containers
        docker-compose -f $COMPOSE_FILE down || true
        
        # Clean up old images (keep last 2 versions)
        docker image prune -f
        
        # Build and start containers
        docker-compose -f $COMPOSE_FILE build --no-cache
        docker-compose -f $COMPOSE_FILE up -d
        
        # Show status
        docker-compose -f $COMPOSE_FILE ps
EOF
}

# Check deployment health
check_health() {
    log_info "Checking deployment health..."
    
    # Wait for services to start
    sleep 30
    
    ssh -i ~/.ssh/liderix_prod "$SERVER_USER@$SERVER_IP" << 'EOF'
        cd /opt/liderix
        
        # Check container status
        echo "📊 Container Status:"
        docker-compose -f docker-compose.prod.yml ps
        
        # Check logs for errors
        echo -e "\n📝 Recent Logs:"
        docker-compose -f docker-compose.prod.yml logs --tail=20
        
        # Test health endpoints
        echo -e "\n🏥 Health Checks:"
        
        # Test Caddy health
        if curl -s -f http://localhost:8080/health > /dev/null; then
            echo "✅ Caddy proxy: healthy"
        else
            echo "❌ Caddy proxy: unhealthy"
        fi
        
        # Test API health (internal)
        if docker exec liderix-api curl -s -f http://localhost:8001/api/health > /dev/null; then
            echo "✅ API service: healthy"
        else
            echo "❌ API service: unhealthy"
        fi
EOF
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring..."
    ssh -i ~/.ssh/liderix_prod "$SERVER_USER@$SERVER_IP" << 'EOF'
        # Create monitoring script
        cat > /opt/liderix/monitor.sh << 'MONITOR_SCRIPT'
#!/bin/bash
cd /opt/liderix

# Check if all containers are running
if [ $(docker-compose -f docker-compose.prod.yml ps -q | wc -l) -eq $(docker-compose -f docker-compose.prod.yml config --services | wc -l) ]; then
    echo "$(date): All containers running" >> logs/monitor.log
else
    echo "$(date): Some containers are down, restarting..." >> logs/monitor.log
    docker-compose -f docker-compose.prod.yml up -d
fi

# Clean up old logs
find logs/ -name "*.log" -mtime +7 -delete
MONITOR_SCRIPT

        chmod +x /opt/liderix/monitor.sh
        
        # Add to crontab (every 5 minutes)
        (crontab -l 2>/dev/null; echo "*/5 * * * * /opt/liderix/monitor.sh") | crontab -
EOF
}

# Main deployment process
main() {
    log_info "🚀 Liderix Production Deployment"
    log_info "Server: $SERVER_IP"
    log_info "Project: $PROJECT_DIR"
    
    check_server_access
    setup_server_directories
    setup_docker
    deploy_files
    deploy_application
    check_health
    setup_monitoring
    
    log_info "✅ Deployment completed successfully!"
    echo ""
    echo "🌐 Your application should be available at:"
    echo "   https://planerix.com"
    echo "   https://www.planerix.com" 
    echo "   https://api.planerix.com"
    echo ""
    echo "🔧 Server management:"
    echo "   SSH: ssh root@$SERVER_IP"
    echo "   Logs: docker-compose -f docker-compose.prod.yml logs -f"
    echo "   Status: docker-compose -f docker-compose.prod.yml ps"
}

# Run deployment
main "$@"