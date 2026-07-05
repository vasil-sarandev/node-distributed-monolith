#!/bin/sh
set -eu

# Keep in sync with src/shared/kafka/topics.ts
BOOTSTRAP="${KAFKA_BOOTSTRAP_SERVER:-kafka:9092}"
PARTITIONS="${KAFKA_NUM_PARTITIONS:-3}"
REPLICATION_FACTOR="${KAFKA_REPLICATION_FACTOR:-1}"

KAFKA_TOPICS=/opt/kafka/bin/kafka-topics.sh

create_topic() {
  topic="$1"
  echo "Ensuring topic exists: ${topic}"
  "${KAFKA_TOPICS}" \
    --bootstrap-server "${BOOTSTRAP}" \
    --create \
    --if-not-exists \
    --topic "${topic}" \
    --partitions "${PARTITIONS}" \
    --replication-factor "${REPLICATION_FACTOR}"
}

create_topic user-marketing-consent
create_topic product-restocked

echo "Kafka topics ready."
