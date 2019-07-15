#!/bin/bash -e

# Usage ./build-pkg.sh [version]
#
# Use the optional version argument to override the version that is included in the
# zip file names. Used for setting the version on unstable releases.
# Defaults to the version in garden-service/package.json.
# Note that this is only for the version string used in the file name, not the version of the
# code that is built.

garden_service_root=$(cd `dirname $0` && cd .. && pwd)

cd ${garden_service_root}

commit_hash=$(git rev-parse --short HEAD)

# Use version argument if provided, otherwise read version from package.json
if [ -n "$1" ]; then
  version=$1
else
  version="v$(cat package.json | jq -r .version)"
fi


echo "Packaging version ${version}-${commit_hash}"

echo "-> Copying files to tmp build dir..."
mkdir -p dist
rm -rf tmp/dist
mkdir -p tmp/dist
mkdir tmp/dist/bin
mkdir tmp/dist/build

cp -r package.json package-lock.json node_modules Dockerfile tmp/dist
cp -r build/src tmp/dist/build/src
cp bin/garden tmp/dist/bin
rsync -r --exclude=.garden --exclude=.git static tmp/dist

echo "-> Building executables..."
cd dist
pkg --target node10-macos-x64,node10-linux-x64,node10-win-x64,node10-alpine-x64 ../tmp/dist

echo "-> Preparing packages..."

echo "  -> linux-amd64"
rm -rf linux-amd64
mkdir linux-amd64
mv garden-service-linux linux-amd64/garden
cp -r ../tmp/dist/static linux-amd64
echo "    -> tar"
tar -czf garden-${version}-linux-amd64.tar.gz linux-amd64

echo "  -> alpine-amd64"
rm -rf alpine-amd64
mkdir alpine-amd64
mv garden-service-alpine alpine-amd64/garden
cp -r ../tmp/dist/static alpine-amd64
echo "    -> tar"
tar -czf garden-${version}-alpine-amd64.tar.gz alpine-amd64

echo "  -> macos-amd64"
rm -rf macos-amd64
mkdir macos-amd64
mv garden-service-macos macos-amd64/garden
cp -r ../tmp/dist/static macos-amd64
# need to include the .node binary for fsevents
cp ../lib/fsevents/node-v64-darwin-x64/fse.node macos-amd64/fse.node
echo "    -> tar"
tar -czf garden-${version}-macos-amd64.tar.gz macos-amd64

echo "  -> windows-amd64"
rm -rf windows-amd64
mkdir windows-amd64
# Name should match go release and other standards using full "windows" name
mv garden-service-win.exe windows-amd64/garden.exe
cp -r ../tmp/dist/static windows-amd64
echo "    -> zip"
zip -q -r garden-${version}-windows-amd64.zip windows-amd64
