const fs = require('fs');
const fastify = require('fastify')({ logger: true })
const PDFDocument = require('pdfkit');
const path = require('path');

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'dist'),
  prefix: '/',
})

const PORT = process.env.PORT || 3000
const Title = 'Form of Report on Services Provided'
const Subtitle = 'Wzór sprawozdania z wykonanych obowiązków'
const DateLine = 'Date - Number of hours - Place - Activity'
const DateLinePl = 'Data - Liczba godzin - Miejsce - Czynność'

const HOLIDAYS_IN_POLAND = [
  {month: 0, day: 1, name: 'New Year`s Day'},
  {month: 0, day: 2, name: 'Epiphany day off (transferred from January 06)'},
  {month: 3, day: 10, name: 'Easter Monday'},
  {month: 4, day: 1, name: 'Labour Day'},
  {month: 4, day: 3, name: 'Constitution Day'},
  {month: 5, day: 8, name: 'Corpus Christi'},
  {month: 7, day: 15, name: 'Assumption Day'},
  {month: 10, day: 1, name: 'All Saints\' Day'},
  {month: 10, day: 11, name: 'PL Independence Day'},
  {month: 10, day: 13, name: 'PL Independence Day(moved)'},
  {month: 11, day: 25, name: 'Christmas Day'},
  {month: 11, day: 26, name: '2nd Day of Christmas'},
];

const generatePdfStream = (date, city, address, postalCode, activity, dayOffsEnhanced) => {
  const doc = new PDFDocument();
  doc.registerFont('Regular', './fonts/madefor-Regular.ttf');
  doc.registerFont('Bold', './fonts/madefor-Bold.ttf');
  let location = '';
  if (city !== "") {
    location = location + city
  }
  if (address !== "") {
    location = location + ', ' + address
  }
  if (postalCode !== "") {
    location = location + ', ' + postalCode
  }
  
  doc.font('Bold').text(Title, 200)
  doc.font('Regular').text(Subtitle, 200)
  doc.moveDown();
  doc.moveDown();
  doc.font('Bold').text(DateLine,20)
  doc.font('Regular').text(DateLinePl)
  doc.moveDown();
  getWorkingDayPeriodsInMonth(date, dayOffsEnhanced).forEach((i) => {
    doc.text(getLineItemForPeriod(i, location, activity))
    doc.moveDown();
  })
  doc.end();
  return doc
}

const getWorkingDayPeriodsInMonth = (date, dayOffs) => {
  let month = date.getMonth();
  let year = date.getFullYear();
  let daysInMonth = new Date(year, month + 1, 0).getDate();
  let periods = [];
  let inteval;
  for(let day = 1; day <= daysInMonth; day++) {
      let dayOfWeek = new Date(year, month, day).getDay();
      // Monday to Friday are working days + take into account custom day offs
      if(dayOfWeek > 0 && dayOfWeek < 6 && !isDayInArray(day, month, dayOffs)) {
          if (Array.isArray(inteval)) {
            inteval.push(new Date(year, month, day));
          } else {
            inteval = [];
            periods.push(inteval);
            inteval.push(new Date(year, month, day));
          }
      } else {
        inteval = undefined
      }
  }

  return periods
}

const getLineItemForPeriod = (arr, location, activity) => {
  const startDate = arr[0]
  const endDate = arr[arr.length -1]
  const getMonth = (d) => d.getMonth() + 1 
  const from = `${startDate.getFullYear()}-${padZero(getMonth(startDate))}-${padZero(startDate.getDate())}`
  const to = `${endDate.getFullYear()}-${padZero(getMonth(endDate))}-${padZero(endDate.getDate())}`
  const hours = arr.length * 8
  return `${from} - ${to} - ${hours} - ${location} - ${activity}`
}

const padZero = (s) => {
  if (String(s).length < 2) {
    return '0' + String(s);
  }
  return String(s)
}

const isDayInArray = (day, month, dayOffs) => {
  return !!dayOffs.find(h => h.day === day && h.month === month)
}

fastify.get('/', (request, reply) => {
  const f = fs.createReadStream('./dist/index.html')
  reply.send(f)
})

fastify.get('/doc', function handler (request, reply) {
  request.log.info(request.query);
  const { year, month, city, address, postalCode, activity, dayOffs} = request.query
  reply.header('Content-Type', 'application/pdf');
  const date = new Date();
  date.setFullYear(Number(year), Number(month), Number(1));
  const dayOffsEnhanced = dayOffs !== '' ? dayOffs.split(',').map(day => ({day: Number(day), month: date.getMonth(), name: 'Personal day off'})) : [];
  const doc = generatePdfStream(date, city, address, postalCode, activity, dayOffsEnhanced.concat(HOLIDAYS_IN_POLAND));
  reply.send(doc);
})

// Run the server!
fastify.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
