import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {NavBar} from '../../components';


interface KafkaMessage {
  value: string;
}

interface KafkaMessages {
  twitter: KafkaMessage[];
  federated: KafkaMessage[];
}

const FeedPage: React.FC = () => {
  const [data, setData] = useState<KafkaMessages>({ twitter: [], federated: [] });

  useEffect(() => {
axios.get('/')
  .then(response => {
    if (response.data && Array.isArray(response.data.twitter) && Array.isArray(response.data.federated)) {
      setData(response.data);
    } else {
      console.error('Invalid data structure:', response.data);
    }
  })
  .catch(err => {
    console.error(err);
  });
  }, []);

  return (
    <>
    <NavBar />
    <div>
      <h2>Twitter Messages</h2>
      {data.twitter.map((message, index) => (
        <div key={index}>
          <p>{message.value}</p>
        </div>
      ))}

      <h2>Federated Messages</h2>
      {data.federated.map((message, index) => (
        <div key={index}>
          <p>{message.value}</p>
        </div>
      ))}
    </div></>
  );
};

export default FeedPage;