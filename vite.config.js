import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// server {
//   listen 80;  # HTTP port
//   server_name 45.92.173.181;  # IP manzilingiz yoki domen nomingiz

//   # Frontend uchun
//   location / {
//       root /Alsafia-frontend/dist;  # Frontendning build fayllari joylashgan papka
//       index index.html;
//       try_files $uri /index.html;  # React Routing bilan muammo chiqmasligi uchun
//   }

//   # Backend API uchun
//   location /api/ {
//       proxy_pass http://localhost:1282/;  # Backend serverga yo'naltirish
//       proxy_set_header Host $host;
//       proxy_set_header X-Real-IP $remote_addr;
//       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//   }
// }


// http {
//   # Nginx sozlamalarini bu yerga qo'shish mumkin

//   server {
//       listen 80;  # HTTP port
//       server_name 45.92.173.181;  # IP manzilingiz yoki domen nomingiz

//       # Frontend uchun
//       location / {
//           root /Alsafia-frontend/dist;  # Frontendning build fayllari joylashgan papka
//           index index.html;
//           try_files $uri /index.html;  # React Routing bilan muammo chiqmasligi uchun
//       }

//       # Backend API uchun
//       location /api/ {
//           proxy_pass http://localhost:1282/;  # Backend serverga yo'naltirish
//           proxy_set_header Host $host;
//           proxy_set_header X-Real-IP $remote_addr;
//           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
//       }
//   }
// }


// http {

//   ##
//   # Basic Settings
//   ##

//   sendfile on;
//   tcp_nopush on;
//   tcp_nodelay on;
//   keepalive_timeout 65;
//   types_hash_max_size 2048;
//   # server_tokens off;

//   # server_names_hash_bucket_size 64;
//   # server_name_in_redirect off;

//   server_names_hash_bucket_size 64;
//   include /etc/nginx/mime.types;
//   default_type application/octet-stream;

//   ##
//   # SSL Settings
//   ##

//   ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3; # Dropping SSLv3, ref: POODLE
//   ssl_prefer_server_ciphers on;

//   ##
//   # Logging Settings
//   ##

//   access_log /var/log/nginx/access.log;
//   error_log /var/log/nginx/error.log;

//   ##
//   # Gzip Settings
//   ##

//   gzip on;

//   # gzip_vary on;
//   # gzip_proxied any;
//   # gzip_comp_level 6;
//   # gzip_buffers 16 8k;
//   # gzip_http_version 1.1;
//   # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

//   ##
//   # Virtual Host Configs
//   ##

//   include /etc/nginx/conf.d/*.conf;
//   include /etc/nginx/sites-enabled/*;
// }
