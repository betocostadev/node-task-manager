// Setup for SendGrid service
const sgMail = require('@sendgrid/mail')
/* Attention:
Both the API key and the sender email were hidden to provide better security.
Check the dev.env for any info. */
const sender = process.env.SENDER_MAIL // The real domain account when you have one
const sgAPIKey = process.env.SG_API_KEY

sgMail.setApiKey(sgAPIKey)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: sender,
    subject: 'Welcome to Task Map',
    html: `<h1>Task Map</h1>
    <h2>Hello, ${name}! Welcome to Task Map application.</h2>
    <p>We hope you enjoy using it.<br>
    If you have any doubts, please check our documentation.</p>`
  })
}

const sendByeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: sender,
    subject: 'We are sorry to see you go | Task Map',
    html: `<h1>Task Map</h1>
    <h2>${name}, we are really sorry to see you go.</h2>
    <p>We are always looking to improve our App to be the best <em>Task Manager/To-do application</em> available online.</p>
    <p><strong>Please</strong>, if you have some time, tell us why have you decided to stop using our services</p>.
    <p>Sincerely, Task Map team.</p>`
  })
}

module.exports = {
  sendWelcomeEmail, sendByeEmail
}