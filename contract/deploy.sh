#! /bin/bash

if [[ ! -f .env ]]; then
	cat .env.example >.env
fi

chain='local'
while read line; do
	name=$(echo $line | cut -d= -f1)
	value=$(echo $line | cut -d= -f2 | sed 's/"//g')

	if [ "$name" = "NODE_ENV" ]; then
		if [ $value = "MAINNET" ]; then
			chain='mainnet'
		elif [ $value = "GOERLI" ]; then
			chain='goerli'
		elif [ $value = "SEPOLIA" ]; then
			chain='sepolia'
		elif [ $value = "BNB_TESTNET" ]; then
			chain='bnb_testnet'
		fi
		break
	fi
done <".env"

function deploy() {
	pnpm hardhat --network $chain run $1
}

for file in $1/*.ts; do
	deploy $file
done
