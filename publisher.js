const amqp = require("amqplib/callback_api");

const host = "rabbitmq:5672";
const credential = "guest:guest";
const server = `amqp://${credential}@${host}`;

const publishToQueue = async (data) => {
  amqp.connect(server, (err, conn) => {
    if (err) throw err;
    conn.createChannel((errCh, ch) => {
      if (errCh) throw err;
      const exchange = "queue";
      const payload = data;
      let parsePayload = JSON.stringify(payload);
      ch.assertExchange(exchange, "fanout", { durable: false });
      ch.publish(exchange, '', Buffer.from(parsePayload));
      console.log(" [x] Sent ", data);
    });
    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 500);
  });
};

module.exports = {
  publishToQueue,
};
