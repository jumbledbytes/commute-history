#!/usr/bin/env bash

source ~/.bash_profile
cd $COMMUTE_HISTORY_ROOT/server/data-loader/scheduler
npx ts-node load-routes.ts
