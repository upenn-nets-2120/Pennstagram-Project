import express from 'express';
import { Kafka } from 'kafkajs';
import config from './config.json';

const app = express();
const kafka = new Kafka({
    clientId: 'my-feed-app',
    brokers: config.bootstrapServers
});

//consumer for Twitter-Kafka
const twitterConsumer = kafka.consumer({groupId: config.kafka.groupIdTwitter});
//consumer for FederatedPosts
const federatedConsumer = kafka.consumer({groupId: config.kafka.groupIdFederated});
//const consumer = kafka.consumer({ groupId: config.kafka.groupId });

let kafkaMessages = {
    twitter: [],
    federated: []
};

app.get('/', (req, res) => {
    res.json(kafkaMessages);
});

const runConsumers = async () => {
    //connect and subscribe to the twitter consumer
    await twitterConsumer.connect();
    //await consumer.connect();
    await twitterConsumer.subscribe({ topic: config.twitterTopic, fromBeginning: true });
    //await consumer.subscribe({ topic: config.kafka.twitterTopic, fromBeginning: true });
    console.log(`Following topic 'Twitter-Kafka'`);

    //cnnect and subscribe to the federated posts consumer
    await federatedConsumer.connect();
    await federatedConsumer.subscribe({ topic: config.federatedTopic, fromBeginning: true });
    //await consumer.subscribe({ topic: config.kafka.federatedTopic, fromBeginning: true });
    console.log(`Following topic 'FederatedPosts'`);
    //console.log(`Following topics '${config.kafka.twitterTopic}' and '${config.kafka.federatedTopic}'`);


    /*//connect and subscribe to the UserHashtags consumer
    await hashtagConsumer.connect();
    await hashtagConsumer.subscribe({ topic: 'UserHashtags', fromBeginning: true });
    console.log(`Following topic 'UserHashtags'`);*/

    //twitter consumer
    await twitterConsumer.run({
        eachMessage: async ({ topic, partition, message }) => { //ask Ives what partition
            console.log(`Received from ${topic}: ${message.value.toString()}`);
            kafkaMessages.twitter.push({
                value: message.value.toString(),
            });
        },
    });

    //federated posts 
    await federatedConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received from ${topic}: ${message.value.toString()}`);
            kafkaMessages.federated.push({
                value: message.value.toString(),
            });
        },
    });

    /*
    // Run the consumer
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received from ${topic}: ${message.value.toString()}`);
            if (topic === config.kafka.twitterTopic) {
                kafkaMessages.twitter.push({
                    value: message.value.toString(),
                });
            } else if (topic === config.kafka.federatedTopic) {
                kafkaMessages.federated.push({
                    value: message.value.toString(),
                });
            }
        },
    });
    */

    /*//user hashtags
    await hashtagConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message from ${topic}: ${message.value.toString()}`);
            const userID = parseInt(message.value.toString());
            const hashtags = await fetchTopHashtags(userID);
            console.log(`User ${userID} is interested in hashtags: ${hashtags.join(", ")}`);
        },
    });*/
};

runConsumers().catch(error => console.error('Error in running consumers:', error));

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port} -- you can GET the Kafka messages`);
});
