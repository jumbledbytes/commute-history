#!/usr/bin/env python3
import json
import jwt
import sys
import time

try:
    print(sys.argv)
    keyFileName = sys.argv[1]
    tokenFileName = sys.argv[1].replace('.p8', '.jwt')
    jsonFileName = sys.argv[1].replace('.p8', '.json')
except:
    keyFileName = '../keys/LittleNorthwestFamilyNavigation.p8'
    tokenFileName = '../keys/LittleNorthwestFamilyNavigation.jwt'
    jsonFileName = '../keys/LittleNorthwestFamilyNavigation.json'

# Values from Apple
teamId = '53PXBMXT8B'
keyId = '6T56YZPBLJ'

# Private Key from Apple
keyFile = open(keyFileName, 'r')
privateKey = keyFile.read()
keyFile.close()

# Expire the JWT tomorrow
issuedAt = time.time()
expireAt = issuedAt + 86400

# Create the token
jwtToken = jwt.encode({
    'iss': teamId,
    'iat': issuedAt,
    'exp': expireAt
    }, 
    privateKey, 
    algorithm='ES256', 
    headers={'kid': keyId})

# Save the token
jwtFile = open(tokenFileName, 'wb')
jwtFile.write(jwtToken)
jwtFile.close()

token = {
    'issuedAt': issuedAt,
    'expireAt': expireAt,
    'token': jwtToken.decode(encoding='UTF-8')
}

tokenJson = json.dumps(token)
tokenFile = open(jsonFileName, 'w')
tokenFile.write(tokenJson)
tokenFile.close()

print(tokenJson)