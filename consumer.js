const MongoDB = require("./queries/mongo.connection");
const postgres = require("./queries/postgres.connection");
const amqp = require("amqplib/callback_api");
const host = "rabbitmq:5672";
const credential = "guest:guest";
const server = `amqp://${credential}@${host}`;

var args = process.argv.slice(2);

const consumerA = async () => {
  await amqp.connect(server, (err, conn) => {
    if (err) throw err;
    conn.createChannel((errCh, channel) => {
      if (errCh) throw errCh;
      const queue_exchange = "queue";
      channel.assertExchange(queue_exchange, "fanout", { durable: false });
      channel.assertQueue("", { exclusive: true }, (error2, q) => {
        if (error2) throw error2;

        console.log(" [*] Waiting for messages in consumerA " + q.queue);
        channel.bindQueue(q.queue, queue_exchange, "");
        channel.consume(
          q.queue,
          (msg) => {
            let payload = JSON.parse(msg.content.toString());
            if (msg.content) {
              console.log("consumer A ", payload.name);
              postgres.createUserPostgres(payload.name);
            }
          },
          { noAck: true }
        );
      });
    });
  });
};

const consumerB = async () => {
  await amqp.connect(server, (err, conn) => {
    if (err) throw err;
    conn.createChannel((errCh, channel) => {
      if (errCh) throw errCh;
      const queue_exchange = "queue";
      channel.assertExchange(queue_exchange, "fanout", { durable: false });
      channel.assertQueue("", { exclusive: true }, (error2, q) => {
        if (error2) throw error2;

        console.log(" [*] Waiting for messages in consumerB " + q.queue);
        channel.bindQueue(q.queue, queue_exchange, "");
        channel.consume(
          q.queue,
          (msg) => {
            let payload = JSON.parse(msg.content.toString());
            if (msg.content) {
              console.log("consumer B ", payload.name);
              MongoDB.createUserMongo(payload.name);
            }
          },
          { noAck: true }
        );
      });
    });
  });
};

module.exports = {
  consumerA,
  consumerB,
};
