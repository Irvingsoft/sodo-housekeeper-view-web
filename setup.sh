#!/usr/bin/env
image_version=`date +%Y%m%d%H%M%S`;
echo $image_version;
# cd housekeeper
git pull --rebase origin master;
docker stop housekeeper || true;
docker rm housekeeper || true;
docker rmi --force $(docker images | grep housekeeper | awk '{print $3}') || true;
docker build -t housekeeper:$image_version .;
docker images;
docker run -p 1888:80 -d --name housekeeper housekeeper:$image_version;
# -v ~/docker-data/house-web/appsettings.json:/app/appsettings.json -v ~/docker-data/house-web/NLogFile/:/app/NLogFile   --restart=always
docker logs housekeeper;
#删除build过程中产生的镜像    #docker image prune -a -f
docker image prune -a -f;
docker rmi $(docker images -f "dangling=true" -q);# 对空间进行自动清理docker system prune -a -f
