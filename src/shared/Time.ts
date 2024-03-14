type IsoDateTimeString = string

export class Time {
  static buildStringDate = (isoDateTimeString: IsoDateTimeString | null) => {
    if (!isoDateTimeString) return null
    const date = new Date(isoDateTimeString)

    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const dayOfTheMonth = date.getDate().toString().padStart(2, '0')

    return `${date.getFullYear()}-${month}-${dayOfTheMonth}`
  }
}
