import { MailerSend, EmailParams, Sender, Recipient, Attachment } from 'mailersend'
import { Member } from '@/models/members'
import { User } from '@/models/users'
import dayjs from 'dayjs'

import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}


export const sendBakerNotificationMail = async (
  recipient: Member,
  sender: User,
  date: Date,
  outlookUrl: string,
  googleUrl: string,
  file?: File,
) => {
  const mailerSend = initializeMailer()

  const sentFrom = new Sender(sender.email, sender.fullName())
  const recipients = [
    new Recipient(recipient.email, recipient.fullName())
  ]

  // const attachments = [
  //   new Attachment(file)
  // ]

  const variables = [
    {
      email: sender.email,
      substitutions: [
        {
          var: "memberFullName",
          value: recipient.fullName(),
        },
        {
          var: "userFullName",
          value: sender.fullName(),
        },
        {
          var: "nextDate",
          value: dayjs(date).format('DD/MM'),
        },
        {
          var: "accountName",
          value: "Friday Cake",
        },
        {
          var: "outlookUrl",
          value: outlookUrl,
        },
        {
          var: "googleUrl",
          value: googleUrl,
        },
      ],
    },
  ]

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    // .setAttachments(attachments)
    .setSubject('Cake Friday - You are the Chosen One')
    .setVariables(variables)
    .setTemplateId('0r83ql32vyz4zw1j')

  await mailerSend.email.send(emailParams)
}

const initializeMailer = () => {
  const mailerSend = new MailerSend({
    apiKey: process.env["NEXT_MAILER_SEND_API_KEY"] as string,
  })
  return mailerSend
}
