// Setup for SendGrid service
const sgMail = require('@sendgrid/mail')
const sgAPIKey = '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'

sgMail.setApiKey(sgAPIKey)

sgMail.send({
  to: 'robertomarx@gmail.com',
  from: 'robertomarx@gmail.com',
  subject: 'Testing SendGrid!',
  text: 'Testing the sendgrid api to send emails to myself!',
  // Can use html here.
})