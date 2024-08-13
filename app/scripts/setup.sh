#!/usr/bin/env bash

set -euxo pipefail

ANDROID_DIR=android
IOS_DIR=ios

if [[ "$@" == *"--platform-clean"* ]]; then
  (
    set +e
    echo "Cleaning Android and iOS directories..."
    rm -rf ${ANDROID_DIR} ${IOS_DIR}
  )
fi

if [[ "$@" == *"--clean"* ]]; then
  (
    set +e
    echo "Performing full clean build..."
    rm -rf node_modules
    rm -rf ${ANDROID_DIR} ${IOS_DIR}}
  )
fi

yarn install

if [[ ! -d "${ANDROID_DIR}" || ! -d "${IOS_DIR}" ]]; then
  echo "Android and/or iOS directories does not exist. Performing prebuild.."
  npx expo prebuild
fi