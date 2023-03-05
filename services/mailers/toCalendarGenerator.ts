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

export const createIcsFile = (
  { startAt, endsAt, subject, isAllDay = false, description = '' }
  :
  { startAt: Date | undefined, endsAt: Date | undefined, subject: string, isAllDay?: boolean, description?: string}
) => {
  const params = {
    summary: subject,
    description: description,
    startTime: startAt,
    endTime: endsAt,
  }

  const icsContent = `
    BEGIN:VCALENDAR
    VERSION:2.0
    PRODID:-//FridayCake//NONSGML Event//EN
    BEGIN:VEVENT
    UID:${params.startTime?.toISOString()}-fridayCake
    DTSTAMP:${dayjs().toISOString()}
    DTSTART:${params.startTime?.toISOString()}
    DTEND:${params.endTime?.toISOString()}
    SUMMARY:${params.summary}
    DESCRIPTION:${params.description}
    END:VEVENT
    END:VCALENDAR
  `

  const file = new File([icsContent], 'calendarEvent.ics', {
    type: 'text/calendar',
  })

  return file
}

const encodeGetParams = (params : object) => {
  return Object.entries(params).map(kv => kv.map(encodeURIComponent).join("=")).join("&")
}
