#!/bin/sh
sed -i 's|window.ENV = {}|window.ENV = { ZENO_HABIT_BFF_BASE_URI: "'$ZENO_HABIT_BFF_BASE_URI'" }|g' ./index.html
cat ./index.html
nginx -g 'daemon off;'