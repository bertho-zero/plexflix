#!/usr/bin/env bash

# Update passwords of Radarr, Sonarr, Prowlarr, qBittorrent and joal

if [ "$#" -ne 2 ]; then
    echo "Error: Invalid number of arguments."
    echo "Usage: $0 <service_name> <password>"
    echo "Service names: all, radarr, sonarr, prowlarr, qbittorrent, joal"
    exit 1
fi

scriptDir=$(dirname "$0")
root=$(readlink -f "$scriptDir/..")

command_exists () {
  type "$1" &> /dev/null
}

find_python() {
  if command_exists python3; then
    echo "python3"
  elif command_exists python; then
    echo "python"
  elif command_exists python2; then
    echo "python2"
  else
    return 1
  fi
}

python_cmd=$(find_python)

if [[ $? -ne 0 ]]; then
  echo "Error: python not found"
  exit 1
fi

cleaned_env=$(grep -v '^#' "$root/.env" | sed 's/ *#.*//g')

get_env() {
  echo "$cleaned_env" | grep "^$1=" | cut -d '=' -f 2-
}

set_var() {
  escaped_search_pattern=$(echo "$2" | sed 's/[][\/.^$*]/\\&/g')
  escaped_value=$(echo "$3" | sed 's/[][\/.^$*]/\\&/g')

  sed -i -e "s/^$escaped_search_pattern *=.*/$escaped_search_pattern=$escaped_value/" $1
}

CONFIG_FOLDER=$(get_env "CONFIG_FOLDER")

hash_password() {
  echo $($python_cmd "$scriptDir/hash_password.py" $@)
}

dim() {
    echo -e "\033[2m${1}\033[23m"
}

update_arr_password() {
  service=$1
  password=$2
  salt=$(openssl rand -hex 16)
  salt_b64=$(echo -n $salt | openssl base64)
  hashed_password=$(hash_password "$password" "$salt_b64" 10000 32)

  sqlite3 "$CONFIG_FOLDER/$service/config/$service.db" "UPDATE Users SET Password = '$hashed_password', Salt = '$salt_b64';"
  set_var "$root/.env" ${service^^}_PASSWORD "$password"

  echo "Password of $1 updated to" $(dim "$password")
}

update_qbittorrent_password() {
  password=$1
  salt=$(openssl rand 16)
  salt_b64=$(echo -n $salt | openssl base64)
  hashed_password=$(hash_password "$password" "$salt_b64")

  set_var "$CONFIG_FOLDER/qbittorrent/config/qBittorrent/qBittorrent.conf" "WebUI\Password_PBKDF2" '"'"@ByteArray($salt_b64:$hashed_password)"'"'

  set_var "$root/.env" QBITTORRENT_PASSWORD "$password"

  escpaed_password=$(sed "s/'/'\\\\''/g" <<< "$password")
  download_client_query="UPDATE DownloadClients SET Settings = json_set(Settings, '$.password', '$escpaed_password') WHERE Implementation = 'QBittorrent'"

  sqlite3 "$CONFIG_FOLDER/radarr/config/radarr.db" "$download_client_query"
  sqlite3 "$CONFIG_FOLDER/sonarr/config/sonarr.db" "$download_client_query"

  echo "Password of qbittorrent updated to" $(dim "$password")
}

update_joal_password() {
  password=$1

  set_var "$root/.env" JOAL_PASSWORD "$password"

  echo "Password of joal updated to" $(dim "$password")
}

service=$1
password=$2

case $service in
    radarr|sonarr|prowlarr)
        update_arr_password $service "$password"
        ;;
    qbittorrent)
        update_qbittorrent_password "$password"
        ;;
    joal)
        update_joal_password "$password"
        ;;
    all)
        update_arr_password radarr "$password"
        update_arr_password sonarr "$password"
        update_arr_password prowlarr "$password"
        update_qbittorrent_password "$password"
        update_joal_password "$password"
        ;;
    *)
        echo "Error: Invalid service name."
        echo "Service names: all, radarr, sonarr, prowlarr, qbittorrent or joal."
        exit 1
        ;;
esac
