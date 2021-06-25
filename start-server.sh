#!/usr/bin/env bash
# start-server.sh
# if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ] ; then
#     (cd djsr; python manage.py createsuperuser --no-input)
# fi
# ( python manage.py collectstatic; gunicorn djsr.wsgi:application  --user www-data --bind 0.0.0.0:8010 --workers 3) &
# nginx -g "daemon off;"
ls
pm2 start server/index.js
pm2 status &
nginx -g "daemon off;"

# cd .. ; ls -l; cd djsr; 