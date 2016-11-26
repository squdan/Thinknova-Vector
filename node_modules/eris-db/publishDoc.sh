#!/usr/bin/env bash

# -------------------------------------------------------------------
# Set vars (change if used in another repo)

base_name=eris-db.js
user_name=eris-ltd
docs_site=docs.erisindustries.com

# -------------------------------------------------------------------
# Set vars (usually shouldn't be changed)

repo=`pwd`
release_min=$(cat package.json | jq --raw-output .version)
start=`pwd`

# -------------------------------------------------------------------
# Build

npm run doc

cd $HOME
git clone git@github.com:$user_name/$docs_site.git
cd $docs_site/documentation
mkdir --parents $base_name
cd $base_name
mv $repo/doc $release_min

if [[ "$1" == "master" ]]; then
  ln --symbolic $release_min latest
fi

# ------------------------------------------------------------------
# Commit and push if there's changes

if [ -z "$(git status --porcelain)" ]; then
  echo "All Good!"
else
  git config --global user.email "billings@erisindustries.com"
  git config --global user.name "Billings the Bot"
  git add -A :/ &&
  git commit -m "$base_name build number $CIRCLE_BUILD_NUM doc generation" &&
  git push origin master
fi

# ------------------------------------------------------------------
# Cleanup

cd $start