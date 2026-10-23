#!/bin/sh
# Read-only. Run over an authenticated SSH session; never sources host env files.
# No sudo, Docker mutations, container exec, logs, secrets or full inspect output.
set -eu
section() { printf '\n### %s\n' "$1"; }
section 'Host and capacity snapshot'
date -u
uname -sm
getconf _NPROCESSORS_ONLN
uptime
free -m
df -h -x tmpfs -x devtmpfs
section 'Listening sockets (no process arguments)'
ss -lntu
section 'Docker/Compose versions'
docker version --format '{{.Server.Version}}'
docker compose version
section 'Compose project inventory'
docker compose ls --all --format json
section 'Container identity, image, status and published ports'
docker ps -a --format '{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
section 'Current resource use (single sample, not peak capacity)'
docker stats --no-stream --format '{{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.PIDs}}'
section 'Networks'
docker network ls --format '{{.Name}}\t{{.Driver}}\t{{.Scope}}'
section 'Container network membership, mount destinations and resource limits'
for id in $(docker ps -aq); do
  docker inspect --format '{{.Name}} project={{index .Config.Labels "com.docker.compose.project"}} service={{index .Config.Labels "com.docker.compose.service"}} networks={{range $name,$net := .NetworkSettings.Networks}}{{$name}} {{end}} mounts={{range .Mounts}}{{.Type}}:{{.Destination}}:rw={{.RW}} {{end}} memory={{.HostConfig.Memory}} nanoCPUs={{.HostConfig.NanoCpus}} pids={{.HostConfig.PidsLimit}} restart={{.HostConfig.RestartPolicy.Name}}' "$id"
done
section 'Volume names (no contents)'
docker volume ls --format '{{.Name}}\t{{.Driver}}'
section 'Operator follow-up required'
printf '%s\n' 'Review ONLY the identified proxy config and Workshop OS route; redact credentials before sharing.' 'PostgreSQL version, role/grant isolation, connection headroom and backup policy need separate read-only DBA inspection.'
