import dayjs, { Dayjs } from 'dayjs'

export const outlookCalendarLink = (
  { startAt, endsAt, subject, isAllDay = false, description = '' }
  :
  { startAt: Date | undefined, endsAt: Date | undefined, subject: string, isAllDay?: boolean, description?: string}
) => {
  const baseUrl = 'https://outlook.office.com/calendar/0/deeplink/compose'

  const params = {
    path: '/calendar/option/compose',
    rru: 'addevent',
    startdt: dayjs(startAt).format('YYYY-MM-DDTHH:mm:ss'),
    enddt: dayjs(endsAt).format('YYYY-MM-DDTHH:mm:ss'),
    subject: subject,
    allday: isAllDay,
    body: description,
  }

  return `${baseUrl}?${encodeGetParams(params)}`
}

export const googleCalendarLink = (
  { startAt, endsAt, subject, isAllDay = false, description = '' }
  :
  { startAt: Date | undefined, endsAt: Date | undefined, subject: string, isAllDay?: boolean, description?: string}
) => {
  const baseUrl = 'https://www.google.com/calendar/render'

  const params = {
    action: 'TEMPLATE',
    dates: `${dayjs(startAt).format('YYYYMMDDTHHmmss')}/${dayjs(endsAt).format('YYYYMMDDTHHmmss')}`,
    text: subject,
    allday: isAllDay,
    details: description,
  }

  return `${baseUrl}?${encodeGetParams(params)}`
}

export const createIcsFileText = (
  { startAt, endsAt, subject, isAllDay = false, description = '' }
  :
  { startAt: Date | undefined, endsAt: Date | undefined, subject: string, isAllDay?: boolean, description?: string}
) => {
  const params = {
    summary: subject,
    description: description,
    startTime: dayjs(startAt),
    endTime: dayjs(endsAt),
  }

  const icsContent = `
    BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//FridayCake//NONSGML Event//EN
    BEGIN:VEVENT
    UID:${params.startTime?.toISOString()}-fridayCake
    DTSTAMP:${dayjs().toISOString()}
    DTSTART:${params.startTime?.format('YYYYMMDDTHHmmss')}
    DTEND:${params.endTime?.format('YYYYMMDDTHHmmss')}
    SUMMARY:${params.summary}
    DESCRIPTION:${params.description}
    BEGIN:VALARM
    ACTION:DISPLAY
    DESCRIPTION:Friday Cake
    TRIGGER:-P1D
    END:VALARM
    END:VEVENT
    END:VCALENDAR
  `

  return icsContent
}

const encodeGetParams = (params : object) => {
  return Object.entries(params).map(kv => kv.map(encodeURIComponent).join("=")).join("&")
}
