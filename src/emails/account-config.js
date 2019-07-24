// Setup for SendGrid service
const sgMail = require('@sendgrid/mail')
const sgAPIKey = process.env.SG_API_KEY

sgMail.setApiKey(sgAPIKey)

sgMail.send({
  to: 'robertomarx@gmail.com',
  from: 'robertomarx@gmail.com',
  subject: 'Testing SendGrid!',
  text: 'Testing the sendgrid api to send emails to myself!',
  // Can use html here.
})