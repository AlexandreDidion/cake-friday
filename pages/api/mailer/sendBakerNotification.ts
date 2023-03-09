import { MailerSend, EmailParams, Sender, Recipient, Attachment } from 'mailersend'
import { Member } from '@/models/members'
import type { NextApiRequest, NextApiResponse } from 'next'
import { APIResponse } from 'mailersend/lib/services/request.service'

type Data = {
  result: APIResponse | unknown
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { recipient, sender, date, outlookUrl, googleUrl, textFile } = req.body

  const mailerSend = new MailerSend({
    apiKey: process.env.MAILER_SEND_API_KEY as string,
  })

  const sentFrom = new Sender('team@fridaycake.no', sender.displayName)

  const bulkEmails: EmailParams[] = []

  recipient.forEach((r: Member) => {
    const recipients = [
      new Recipient(r.email, `${r.firstName} ${r.lastName}`)
    ]


    const attachments = [
      new Attachment(Buffer.from(textFile).toString('base64'),
      'calendarEvent.ics',
      'attachment')
    ]

    const variables = [
      {
        email: r.email,
        substitutions: [
          {
            var: "memberFullName",
            value: `${r.firstName} ${r.lastName}`,
          },
          {
            var: "userFullName",
            value: sender.displayName,
          },
          {
            var: "nextDate",
            value: date,
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
      .setAttachments(attachments)
      .setSubject('Cake Friday - You are the Chosen One')
      .setVariables(variables)
      .setTemplateId('0r83ql32vyz4zw1j')

    bulkEmails.push(emailParams)
  })

  try {
    const response = await mailerSend.email.sendBulk(bulkEmails)
    res.status(200).json({result: response})
  } catch (err) {
    res.status(500).json({result: err})
  }
}
