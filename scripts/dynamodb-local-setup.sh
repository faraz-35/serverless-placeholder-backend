#!/bin/bash

# Set the Docker volume and container names
docker_volume="dynamodb_local_data"
docker_container="dynamodb-local"

# Check if the Docker volume exists
if docker volume inspect "$docker_volume" >/dev/null 2>&1; then
    echo "Docker volume $docker_volume already exists."
else
    # Create Docker volume if it does not exist
    echo "Creating Docker volume $docker_volume..."
    docker volume create "$docker_volume"
fi

# Check if the Docker container exists
if docker inspect "$docker_container" >/dev/null 2>&1; then
    # Check if the Docker container is running
    if [ "$(docker inspect -f '{{.State.Running}}' "$docker_container")" = "true" ]; then
        echo "DynamoDB Local container is already running."
    else
        echo "DynamoDB Local container exists but is not running. Starting container..."
        docker start "$docker_container"
    fi
else
    echo "DynamoDB Local container does not exist. Creating container..."
    # Start DynamoDB Local Docker container with a mounted volume
    docker run -d -p 8000:8000 \
        --name "$docker_container" \
        --mount source="$docker_volume",target=/home/dynamodblocal/data \
        --workdir /home/dynamodblocal \
        amazon/dynamodb-local\
        -jar DynamoDBLocal.jar -sharedDb 


    # Wait for DynamoDB Local to be ready
    until aws dynamodb list-tables --endpoint-url http://localhost:8000 2>/dev/null; do
        echo "Waiting for DynamoDB Local to be ready..."
        sleep 1
    done

    echo "DynamoDB Container created and ready."
fi

