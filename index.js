const fs = require('fs');
const fastify = require('fastify')({ logger: true })
const PDFDocument = require('pdfkit');

const PORT = process.env.PORT || 3000
const Title = 'Form of Report on Services Provided'
const Subtitle = 'Wzór sprawozdania z wykonanych obowiązków'
const DateLine = 'Date - Number of hours - Place - Activity'
const DateLinePl = 'Data - Liczba godzin - Miejsce - Czynność'

const generatePdfStream = () => {
  const doc = new PDFDocument();
  doc.registerFont('Regular', './fonts/madefor-Regular.ttf');
  doc.registerFont('Bold', './fonts/madefor-Bold.ttf');
  
  // Inputs that should be provided
  const date = new Date();
  const location = 'Wieliczki, Zbozowa 20B, 32-020'
  const activity = 'Software development'
  // inputs end
  
  doc.font('Bold').text(Title, 200)
  doc.font('Regular').text(Subtitle, 200)
  doc.moveDown();
  doc.moveDown();
  doc.font('Bold').text(DateLine,20)
  doc.font('Regular').text(DateLinePl)
  doc.moveDown();
  getWorkingDayPeriodsInCurrentMonth(date).forEach((i) => {
    doc.text(getLineItemForPeriod(i, location, activity))
    doc.moveDown();
  })
  doc.end();
  return doc
}

const getWorkingDayPeriodsInCurrentMonth = (date) => {
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

const getLineItemForPeriod = (i, location, activity) => {
  const from = `${i[0].getFullYear()}-${i[0].getMonth()}-${i[0].getDate()}`
  const to = `${i[i.length -1].getFullYear()}-${i[i.length -1].getMonth()}-${i[i.length -1].getDate()}`
  const hours = i.length * 8
  return `${from} - ${to} - ${hours} - ${location} - ${activity}`
}

fastify.get('/', (request, reply) => {
  const f = fs.createReadStream('./public/index.html')
  reply.send(f)
})

fastify.get('/doc', function handler (request, reply) {
  request.log.info(request.params);
  reply.header('Content-Type', 'application/pdf');
  const doc = generatePdfStream(reply);
  reply.send(doc);
})

// Run the server!
fastify.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
