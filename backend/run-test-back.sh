#!/bin/sh
npm run seed
npm start &
sleep 15
npm run test &
sleep 15
npm run start

