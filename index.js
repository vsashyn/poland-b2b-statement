const PDFDocument = require('pdfkit');
const fs = require('fs');

const Title = 'Form of Report on Services Provided'
const Subtitle = 'Wzór sprawozdania z wykonanych obowiązków'
const DateLine = 'Date - Number of hours - Place - Activity'
const DateLinePl = 'Data - Liczba godzin - Miejsce - Czynność'

const doc = new PDFDocument();
doc.registerFont('Regular', './fonts/madefor-Regular.ttf');
doc.registerFont('Bold', './fonts/madefor-Bold.ttf');

// Inputs that should be provided
const date = new Date();
const location = 'Wieliczki, Zbozowa 20B, 32-020'
const activity = 'Software development'
const fileName = 'file.pdf'
// inputs end

doc.pipe(fs.createWriteStream(`./${fileName}`));
doc.font('Bold').text(Title, 200)
doc.font('Regular').text(Subtitle, 200)
doc.moveDown();
doc.moveDown();
doc.font('Bold').text(DateLine,20)
doc.font('Regular').text(DateLinePl)
doc.moveDown();

const getWorkingDayPeriodsInCurrentMonth = () => {
  let month = date.getMonth();
  let year = date.getFullYear();
  let daysInMonth = new Date(year, month + 1, 0).getDate();
  let workingDays = [];
  let inteval;
  for(let day = 1; day <= daysInMonth; day++) {
      let dayOfWeek = new Date(year, month, day).getDay();
      // Monday to Friday are working days
      if(dayOfWeek > 0 && dayOfWeek < 6) {
          if (Array.isArray(inteval)) {
            inteval.push(new Date(year, month, day));
          } else {
            inteval = [];
            workingDays.push(inteval);
            inteval.push(new Date(year, month, day));
          }
      } else {
        inteval = undefined
      }
  }

  return workingDays
}

const getLineItemForPeriod = (i) => {
  const from = `${i[0].getFullYear()}-${i[0].getMonth()}-${i[0].getDate()}`
  const to = `${i[i.length -1].getFullYear()}-${i[i.length -1].getMonth()}-${i[i.length -1].getDate()}`
  const hours = i.length * 8
  return `${from} - ${to} - ${hours} - ${location} - ${activity}`
}

getWorkingDayPeriodsInCurrentMonth().forEach((i) => {
  doc.text(getLineItemForPeriod(i))
  doc.moveDown();
})

doc.end();
console.log('done!');
