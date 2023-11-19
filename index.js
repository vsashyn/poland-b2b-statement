const fs = require('fs');
const fastify = require('fastify')({ logger: true })
const PDFDocument = require('pdfkit');
const path = require('path');

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'dist'),
  prefix: '/',
  // constraints: { host: 'example.com' } // optional: default {}
})

const PORT = process.env.PORT || 3000
const Title = 'Form of Report on Services Provided'
const Subtitle = 'Wzór sprawozdania z wykonanych obowiązków'
const DateLine = 'Date - Number of hours - Place - Activity'
const DateLinePl = 'Data - Liczba godzin - Miejsce - Czynność'

const generatePdfStream = (date, city, address, postalCode) => {
  const doc = new PDFDocument();
  doc.registerFont('Regular', './fonts/madefor-Regular.ttf');
  doc.registerFont('Bold', './fonts/madefor-Bold.ttf');
  
  const location = `${city}, ${address}, ${postalCode}`;
  // TODO: provide activity
  const activity = 'Software development'
  
  doc.font('Bold').text(Title, 200)
  doc.font('Regular').text(Subtitle, 200)
  doc.moveDown();
  doc.moveDown();
  doc.font('Bold').text(DateLine,20)
  doc.font('Regular').text(DateLinePl)
  doc.moveDown();
  getWorkingDayPeriodsInMonth(date).forEach((i) => {
    doc.text(getLineItemForPeriod(i, location, activity))
    doc.moveDown();
  })
  doc.end();
  return doc
}

const getWorkingDayPeriodsInMonth = (date) => {
  let month = date.getMonth();
  let year = date.getFullYear();
  let daysInMonth = new Date(year, month + 1, 0).getDate();
  let periods = [];
  let inteval;
  for(let day = 1; day <= daysInMonth; day++) {
      let dayOfWeek = new Date(year, month, day).getDay();
      // Monday to Friday are working days
      if(dayOfWeek > 0 && dayOfWeek < 6) {
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

fastify.get('/', (request, reply) => {
  const f = fs.createReadStream('./dist/index.html')
  reply.send(f)
})

fastify.get('/doc', function handler (request, reply) {
  request.log.info(request.query);
  const { year, month, city, address, postalCode} = request.query
  reply.header('Content-Type', 'application/pdf');
  const date = new Date();
  date.setFullYear(Number(year), Number(month), Number(1));
  const doc = generatePdfStream(date, city, address, postalCode);
  reply.send(doc);
})

// Run the server!
fastify.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
