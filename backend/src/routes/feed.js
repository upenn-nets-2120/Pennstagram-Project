import express from 'express';
import { Kafka } from 'kafkajs';
import config from './config.json';
import { fetchTopHashtags } from './dbOperations/posts_dbOperations'; // Adjust according to actual path


const app = express();
const kafka = new Kafka({
    clientId: 'my-feed-app',
    brokers: config.bootstrapServers
});

//consumer for Twitter-Kafka
const twitterConsumer = kafka.consumer({ groupId: 'twitter-group' });
//consumer for FederatedPosts
const federatedConsumer = kafka.consumer({ groupId: 'federated-group' });

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
    await twitterConsumer.subscribe({ topic: 'Twitter-Kafka', fromBeginning: true });
    console.log(`Following topic 'Twitter-Kafka'`);

    //cnnect and subscribe to the federated posts consumer
    await federatedConsumer.connect();
    await federatedConsumer.subscribe({ topic: 'FederatedPosts', fromBeginning: true });
    console.log(`Following topic 'FederatedPosts'`);

    //connect and subscribe to the UserHashtags consumer
    await hashtagConsumer.connect();
    await hashtagConsumer.subscribe({ topic: 'UserHashtags', fromBeginning: true });
    console.log(`Following topic 'UserHashtags'`);

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

    //user hashtags
    await hashtagConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(`Received message from ${topic}: ${message.value.toString()}`);
            const userID = parseInt(message.value.toString());
            const hashtags = await fetchUserHashtags(userID);
            console.log(`User ${userID} is interested in hashtags: ${hashtags.join(", ")}`);
        },
    });
};

runConsumers().catch(error => console.error('Error in running consumers:', error));

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port} -- you can GET the Kafka messages`);
});
