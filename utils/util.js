const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const dateformat = (date) =>{
  const dt = new Date(date)
    const yyyy = dt.getFullYear()
    const MM = (dt.getMonth() + 1 + '').padStart(2, 0);
    const dd = (dt.getDate() + '').padStart(2, 0);
    const HH = (dt.getHours() + '').padStart(2, 0);
    const mm = (dt.getMinutes() + '').padStart(2, 0);
    const ss = (dt.getSeconds() + '').padStart(2, 0);
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
}

const dateformat2 = (originVal) =>{
  const dt = new Date(originVal[0], originVal[1], originVal[2], originVal[3], originVal[4], originVal[5],)
  const yyyy = dt.getFullYear()
  const MM = (dt.getMonth() + 1 + '').padStart(2, 0);
  const dd = (dt.getDate() + '').padStart(2, 0);
  const HH = (dt.getHours() + '').padStart(2, 0);
  const mm = (dt.getMinutes() + '').padStart(2, 0);
  const ss = (dt.getSeconds() + '').padStart(2, 0);
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  dateformat,dateformat2
}
