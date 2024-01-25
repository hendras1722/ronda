import { format } from 'date-fns'

function createArrayByDateRange(startDate: any, endDate: any) {
  const dateArray = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  while (start <= end) {
    dateArray.push(new Date(start))
    start.setDate(start.getDate() + 1)
  }
  const res = dateArray.map((item) => format(new Date(item), 'dd-MM-yyyy'))
  return res
}

// Example usage
// const dates = createArrayByDateRange('2024-01-01', '2024-01-31')

// console.log(dates) // Output: [Array of Date objects for January 2024]

export { createArrayByDateRange }
